
import re
from datetime import datetime, timezone


def normalize_log(log: dict):
    timestamp = log.get("timestamp")

    if isinstance(timestamp, str):
        try:
            timestamp = datetime.fromisoformat(
                timestamp.replace("Z", "+00:00")
            )
        except ValueError:
            timestamp = None

    if isinstance(timestamp, datetime) and timestamp.tzinfo is not None:
        timestamp = timestamp.astimezone(timezone.utc).replace(tzinfo=None)

    message = str(log.get("message") or "")

    # Extract telemetry values from the message when separate fields
    # are absent. Supports key=value and key: value formats.
    def extract_number(*keys):
        for key in keys:
            if log.get(key) is not None:
                try:
                    return float(log[key])
                except (TypeError, ValueError):
                    pass

        for key in keys:
            pattern = (
                r"(?i)(?<![\w])"
                + re.escape(key)
                + r"\s*[:=]\s*(-?\d+(?:\.\d+)?)"
                + r"\s*%?"
            )
            match = re.search(pattern, message)
            if match:
                try:
                    return float(match.group(1))
                except ValueError:
                    pass

        return None

    def extract_int(*keys):
        value = extract_number(*keys)
        return int(value) if value is not None else None

    return {
        "timestamp": timestamp,
        "level": str(log.get("level") or "INFO").upper(),
        "service": log.get("service"),
        "message": message,
        "source": log.get("source"),

        "latency_ms": extract_number(
            "latency_ms", "duration_ms", "latency"
        ),
        "status_code": extract_int(
            "status_code", "status", "http_status"
        ),
        "cpu_usage": extract_number(
            "cpu_usage", "cpu_percent", "cpu"
        ),
        "memory_usage": extract_number(
            "memory_usage", "memory_percent", "memory"
        ),
        "request_count": extract_number(
            "request_count", "requests"
        ),
        "error_rate": extract_number(
            "error_rate", "errors_percent"
        ),
        "db_connections": extract_number(
            "db_connections", "database_connections"
        ),
    }
