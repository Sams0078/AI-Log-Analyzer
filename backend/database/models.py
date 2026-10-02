from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.database import Base


class Log(Base):
    __tablename__ = "logs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    timestamp: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    level: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    service: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    source: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # Telemetry features
    latency_ms: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    status_code: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    cpu_usage: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    memory_usage: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    request_count: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    error_rate: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    db_connections: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )


class ConnectedSystem(Base):
    __tablename__ = "connected_systems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    environment: Mapped[str] = mapped_column(String(40), nullable=False, default="production")
    source_type: Mapped[str] = mapped_column(String(40), nullable=False, default="http")
    endpoint: Mapped[str | None] = mapped_column(String(500), nullable=True)
    ingestion_key_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ready")
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
