from datetime import datetime

from pydantic import BaseModel


class LogCreate(BaseModel):
    timestamp: datetime | None = None
    level: str
    service: str | None = None
    message: str
    source: str | None = None

    # Telemetry features
    latency_ms: float | None = None
    status_code: int | None = None
    cpu_usage: float | None = None
    memory_usage: float | None = None
    request_count: float | None = None
    error_rate: float | None = None
    db_connections: float | None = None


class LogResponse(LogCreate):
    id: int

    class Config:
        from_attributes = True