from datetime import datetime


def normalize_log(log: dict):
    timestamp = log.get("timestamp")

    if isinstance(timestamp, str):
        try:
            timestamp = datetime.fromisoformat(
                timestamp.replace("Z", "+00:00")
            )
        except ValueError:
            timestamp = None

    return {
        "timestamp": timestamp,
        "level": str(
            log.get("level", "INFO")
        ).upper(),
        "service": log.get("service"),
        "message": str(
            log.get("message", "")
        ),
        "source": log.get("source"),

        # Telemetry features
        "latency_ms": log.get(
            "latency_ms"
        ),
        "status_code": log.get(
            "status_code"
        ),
        "cpu_usage": log.get(
            "cpu_usage"
        ),
        "memory_usage": log.get(
            "memory_usage"
        ),
        "request_count": log.get(
            "request_count"
        ),
        "error_rate": log.get(
            "error_rate"
        ),
        "db_connections": log.get(
            "db_connections"
        ),
    }