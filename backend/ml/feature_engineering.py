import pandas as pd


LEVEL_MAP = {
    "INFO": 0,
    "WARNING": 1,
    "ERROR": 2,
    "CRITICAL": 3,
}


SERVICE_MAP = {
    "auth-service": 0,
    "api-service": 1,
    "database-service": 2,
    "payment-service": 3,
    "notification-service": 4,
}


def extract_features(logs):
    df = pd.DataFrame(logs)

    if df.empty:
        return pd.DataFrame()

    # Basic log features
    df["message_length"] = (
        df["message"]
        .fillna("")
        .astype(str)
        .str.len()
    )

    df["level_encoded"] = (
        df["level"]
        .fillna("INFO")
        .str.upper()
        .map(LEVEL_MAP)
        .fillna(0)
    )

    df["service_encoded"] = (
        df["service"]
        .fillna("unknown")
        .map(SERVICE_MAP)
        .fillna(-1)
    )

    # Telemetry fields
    # Real uploaded logs may not contain these fields.
    defaults = {
        "latency_ms": 180.0,
        "status_code": 200,
        "cpu_usage": 42.0,
        "memory_usage": 48.0,
        "request_count": 80.0,
        "error_rate": 0.015,
        "db_connections": 35.0,
    }

    for column, default_value in defaults.items():
        if column not in df.columns:
            df[column] = default_value
        else:
            df[column] = pd.to_numeric(
                df[column],
                errors="coerce",
            ).fillna(default_value)

    return df[
        [
            "message_length",
            "level_encoded",
            "service_encoded",
            "latency_ms",
            "status_code",
            "cpu_usage",
            "memory_usage",
            "request_count",
            "error_rate",
            "db_connections",
        ]
    ]