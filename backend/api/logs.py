from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from backend.database.database import SessionLocal
from backend.database.models import Log
from backend.database.schemas import LogCreate, LogResponse
from backend.parser.json_parser import parse_json_file
from backend.parser.log_normalizer import normalize_log
from backend.parser.regex_parser import parse_log_file


router = APIRouter(
    prefix="/logs",
    tags=["Logs"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get(
    "/",
    response_model=list[LogResponse],
)
def get_logs(
    db: Session = Depends(get_db),
):
    return db.query(Log).all()


@router.post(
    "/",
    response_model=LogResponse,
)
def create_log(
    log: LogCreate,
    db: Session = Depends(get_db),
):
    new_log = Log(
        **log.model_dump()
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return new_log


@router.post("/upload")
async def upload_logs(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    content = (
        await file.read()
    ).decode("utf-8")

    try:
        # -----------------------------
        # Parse file
        # -----------------------------

        if file.filename.lower().endswith(
            ".json"
        ):
            parsed_logs = parse_json_file(
                content
            )

        elif file.filename.lower().endswith(
            (".log", ".txt")
        ):
            parsed_logs = parse_log_file(
                content
            )

        else:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Only .log, .txt and .json "
                    "files are supported"
                ),
            )

        # -----------------------------
        # Normalize logs
        # -----------------------------

        normalized_logs = [
            normalize_log(log)
            for log in parsed_logs
            if log.get("message")
        ]

        # -----------------------------
        # Save to database
        # -----------------------------

        db_logs = []

        for log in normalized_logs:
            log["source"] = file.filename

            db_logs.append(
                Log(**log)
            )

        db.add_all(db_logs)
        db.commit()

        return {
            "filename": file.filename,
            "logs_processed": len(db_logs),
            "message": (
                "Logs uploaded successfully"
            ),
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )