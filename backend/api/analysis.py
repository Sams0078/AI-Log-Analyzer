from fastapi import APIRouter

from backend.database.database import SessionLocal
from backend.database.models import Log
from backend.services.analysis_service import analyze_logs


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.get("/")
def analyze_database_logs():
    db = SessionLocal()

    try:
        logs = db.query(Log).all()

        log_data = [
            {
                "id": log.id,
                "timestamp": log.timestamp,
                "level": log.level,
                "service": log.service,
                "message": log.message,
                "source": log.source,

                # Telemetry features
                "latency_ms": log.latency_ms,
                "status_code": log.status_code,
                "cpu_usage": log.cpu_usage,
                "memory_usage": log.memory_usage,
                "request_count": log.request_count,
                "error_rate": log.error_rate,
                "db_connections": log.db_connections,
            }
            for log in logs
        ]

        return analyze_logs(log_data)

    finally:
        db.close()