from datetime import datetime


def normalize_log(log: dict):
    timestamp = log.get("timestamp")

    if isinstance(timestamp, str):
        try:
            timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        except ValueError:
            timestamp = None

    return {
        "timestamp": timestamp,
        "level": str(log.get("level", "INFO")).upper(),
        "service": log.get("service"),
        "message": str(log.get("message", "")),
        "source": log.get("source"),
    }