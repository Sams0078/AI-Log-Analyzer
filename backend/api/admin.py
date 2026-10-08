import hashlib
import hmac
import os
import secrets
import time

import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.database.database import SessionLocal
from backend.database.models import ConnectedSystem, Log
from backend.parser.log_normalizer import normalize_log


# Load environment variables from .env
load_dotenv()


router = APIRouter(prefix="/admin", tags=["Admin"])

bearer = HTTPBearer(auto_error=False)

TOKEN_TTL_SECONDS = 60 * 60 * 8
JWT_ALGORITHM = "HS256"


# Dedicated JWT secret is preferred.
# ADMIN_SESSION_SECRET remains as a fallback for development compatibility.
JWT_SECRET = (
    os.getenv("ADMIN_JWT_SECRET")
    or os.getenv("ADMIN_SESSION_SECRET")
    or secrets.token_urlsafe(48)
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def _create_jwt(username: str) -> str:
    now = int(time.time())

    payload = {
        "sub": username,
        "iat": now,
        "exp": now + TOKEN_TTL_SECONDS,
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def _decode_jwt(token: str) -> dict | None:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )

        return payload

    except ExpiredSignatureError:
        return None

    except InvalidTokenError:
        return None


def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
):
    token = credentials.credentials if credentials else None

    payload = _decode_jwt(token) if token else None

    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=401,
            detail="Admin session is required",
        )

    return payload


class LoginInput(BaseModel):
    username: str
    password: str


class SystemInput(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=120,
    )

    environment: str = Field(
        default="production",
        max_length=40,
    )

    source_type: str = Field(
        default="http",
        max_length=40,
    )

    endpoint: str | None = Field(
        default=None,
        max_length=500,
    )


class IngestionBatch(BaseModel):
    logs: list[dict] = Field(
        min_length=1,
        max_length=10000,
    )


@router.post("/login")
def login(credentials: LoginInput):
    username = os.getenv("ADMIN_USERNAME")
    password = os.getenv("ADMIN_PASSWORD")

    if not username or not password:
        raise HTTPException(
            status_code=503,
            detail="Admin credentials are not configured on the server",
        )

    valid_username = secrets.compare_digest(
        credentials.username,
        username,
    )

    valid_password = secrets.compare_digest(
        credentials.password,
        password,
    )

    if not (valid_username and valid_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    token = _create_jwt(username)

    return {
        "token": token,
        "username": username,
        "expires_in": TOKEN_TTL_SECONDS,
    }


@router.get("/session")
def session(
    admin: dict = Depends(require_admin),
):
    return {
        "username": admin["sub"],
        "expires_at": admin["exp"],
    }


@router.get("/systems")
def list_systems(
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    return (
        db.query(ConnectedSystem)
        .order_by(ConnectedSystem.created_at.desc())
        .all()
    )


@router.post("/systems")
def register_system(
    data: SystemInput,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    key = f"ala_{secrets.token_urlsafe(24)}"

    system = ConnectedSystem(
        name=data.name,
        environment=data.environment,
        source_type=data.source_type,
        endpoint=data.endpoint,
        ingestion_key_hash=hashlib.sha256(
            key.encode()
        ).hexdigest(),
        status="ready",
    )

    db.add(system)
    db.commit()
    db.refresh(system)

    return {
        "system": system,
        "ingestion_key": key,
        "ingest_url": f"/admin/systems/{system.id}/ingest",
    }


@router.post("/systems/{system_id}/ingest")
def ingest_logs(
    system_id: int,
    batch: IngestionBatch,
    x_ingestion_key: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    system = db.get(
        ConnectedSystem,
        system_id,
    )

    if (
        not system
        or not x_ingestion_key
        or not hmac.compare_digest(
            system.ingestion_key_hash,
            hashlib.sha256(
                x_ingestion_key.encode()
            ).hexdigest(),
        )
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid ingestion key",
        )

    logs = []

    for item in batch.logs:
        entry = normalize_log(item)

        if entry["message"]:
            entry["source"] = f"system:{system.name}"
            logs.append(Log(**entry))

    db.add_all(logs)
    db.commit()

    return {
        "system_id": system.id,
        "logs_processed": len(logs),
        "message": "Logs ingested successfully",
    }