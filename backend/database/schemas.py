from datetime import datetime

from pydantic import BaseModel


class LogCreate(BaseModel):
    timestamp: datetime | None = None
    level: str
    service: str | None = None
    message: str
    source: str | None = None


class LogResponse(LogCreate):
    id: int

    class Config:
        from_attributes = True