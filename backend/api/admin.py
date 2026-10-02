import base64
import hashlib
import hmac
import json
import os
import secrets
import time

from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.database.database import SessionLocal
from backend.database.models import ConnectedSystem, Log
from backend.parser.log_normalizer import normalize_log


router = APIRouter(prefix="/admin", tags=["Admin"])
bearer = HTTPBearer(auto_error=False)
TOKEN_TTL_SECONDS = 60 * 60 * 8
# A new random value is created only when an explicit production secret is absent.
# This keeps development safe: existing sessions simply expire after a restart.
SESSION_SECRET = os.getenv("ADMIN_SESSION_SECRET") or secrets.token_urlsafe(48)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _encode(payload: dict) -> str:
    body = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    signature = hmac.new(SESSION_SECRET.encode(), body.encode(), hashlib.sha256).hexdigest()
    return f"{body}.{signature}"


def _decode(token: str) -> dict | None:
    try:
        body, signature = token.split(".", 1)
        expected = hmac.new(SESSION_SECRET.encode(), body.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return None
        payload = json.loads(base64.urlsafe_b64decode(body + "=" * (-len(body) % 4)))
        return payload if payload.get("exp", 0) > time.time() else None
    except Exception:
        return None


def require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)):
    payload = _decode(credentials.credentials) if credentials else None
    if not payload:
        raise HTTPException(status_code=401, detail="Admin session is required")
    return payload


class LoginInput(BaseModel):
    username: str
    password: str


class SystemInput(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    environment: str = Field(default="production", max_length=40)
    source_type: str = Field(default="http", max_length=40)
    endpoint: str | None = Field(default=None, max_length=500)


class IngestionBatch(BaseModel):
    logs: list[dict] = Field(min_length=1, max_length=10000)


@router.post("/login")
def login(credentials: LoginInput):
    username = os.getenv("ADMIN_USERNAME")
    password = os.getenv("ADMIN_PASSWORD")
    if not username or not password:
        raise HTTPException(status_code=503, detail="Admin credentials are not configured on the server")
    if not (secrets.compare_digest(credentials.username, username) and secrets.compare_digest(credentials.password, password)):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"token": _encode({"sub": username, "exp": int(time.time()) + TOKEN_TTL_SECONDS}), "username": username, "expires_in": TOKEN_TTL_SECONDS}


@router.get("/session")
def session(admin: dict = Depends(require_admin)):
    return {"username": admin["sub"], "expires_at": admin["exp"]}


@router.get("/systems")
def list_systems(db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    return db.query(ConnectedSystem).order_by(ConnectedSystem.created_at.desc()).all()


@router.post("/systems")
def register_system(data: SystemInput, db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    key = f"ala_{secrets.token_urlsafe(24)}"
    system = ConnectedSystem(
        name=data.name,
        environment=data.environment,
        source_type=data.source_type,
        endpoint=data.endpoint,
        ingestion_key_hash=hashlib.sha256(key.encode()).hexdigest(),
        status="ready",
    )
    db.add(system)
    db.commit()
    db.refresh(system)
    return {"system": system, "ingestion_key": key, "ingest_url": f"/admin/systems/{system.id}/ingest"}


@router.post("/systems/{system_id}/ingest")
def ingest_logs(system_id: int, batch: IngestionBatch, x_ingestion_key: str | None = Header(default=None), db: Session = Depends(get_db)):
    system = db.get(ConnectedSystem, system_id)
    if not system or not x_ingestion_key or not hmac.compare_digest(system.ingestion_key_hash, hashlib.sha256(x_ingestion_key.encode()).hexdigest()):
        raise HTTPException(status_code=401, detail="Invalid ingestion key")
    logs = []
    for item in batch.logs:
        entry = normalize_log(item)
        if entry["message"]:
            entry["source"] = f"system:{system.name}"
            logs.append(Log(**entry))
    db.add_all(logs)
    db.commit()
    return {"system_id": system.id, "logs_processed": len(logs), "message": "Logs ingested successfully"}
