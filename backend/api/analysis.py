from fastapi import APIRouter, HTTPException

from backend.database.database import SessionLocal
from backend.database.models import Log
from backend.services.analysis_service import analyze_logs
from backend.ai.root_cause import (
    analyze_incident_with_ai,
    retrieve_similar_logs,
)


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


@router.post("/ai")
def ai_analyze_incident(incident: dict):
    try:
        retrieved = retrieve_similar_logs(
            incident,
            top_k=5,
        )

        return {
            "incident_id": incident.get("incident_id"),
            "similar_logs": retrieved,
            "ai_analysis": analyze_incident_with_ai(
                incident,
                retrieved,
            ),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )