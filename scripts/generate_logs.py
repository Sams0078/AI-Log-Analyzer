import random
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
import pandas as pd


SERVICES = [
    "auth-service",
    "api-service",
    "database-service",
    "payment-service",
    "notification-service",
]


NORMAL_MESSAGES = [
    "Request processed successfully",
    "User login successful",
    "User logout successful",
    "Database query completed",
    "Cache refreshed successfully",
    "Payment processed successfully",
    "Notification sent successfully",
    "Request completed",
    "Health check passed",
    "Session validated",
]


ANOMALY_MESSAGES = [
    "Request latency increased",
    "Database connection pool saturated",
    "Unexpected resource usage detected",
    "Request processing degraded",
    "Service response degraded",
    "Elevated failure rate detected",
    "Connection timeout observed",
    "Unusual request volume detected",
]


NORMAL_LEVELS = ["INFO", "WARNING", "ERROR"]

ANOMALY_LEVELS = ["INFO", "WARNING", "ERROR", "CRITICAL"]


def generate_logs(count=12000, anomaly_ratio=0.12):
    random.seed(42)
    np.random.seed(42)

    start_time = datetime(2026, 1, 1)

    rows = []

    for i in range(count):
        timestamp = start_time + timedelta(seconds=i * 30)

        service = random.choice(SERVICES)

        # Base normal telemetry
        latency_ms = max(
            20,
            np.random.normal(180, 45),
        )

        cpu_usage = np.clip(
            np.random.normal(42, 10),
            5,
            90,
        )

        memory_usage = np.clip(
            np.random.normal(48, 10),
            10,
            90,
        )

        request_count = max(
            1,
            int(np.random.normal(80, 20)),
        )

        error_rate = np.clip(
            np.random.normal(0.015, 0.01),
            0,
            0.08,
        )

        db_connections = max(
            1,
            int(np.random.normal(35, 8)),
        )

        status_code = random.choices(
            [200, 201, 400, 404, 500],
            weights=[0.78, 0.08, 0.06, 0.05, 0.03],
        )[0]

        is_anomaly = random.random() < anomaly_ratio

        anomaly_type = None

        if is_anomaly:

            anomaly_type = random.choice([
                "latency_spike",
                "cpu_spike",
                "memory_spike",
                "request_burst",
                "error_burst",
                "db_saturation",
                "mixed_degradation",
            ])

            if anomaly_type == "latency_spike":
                latency_ms = np.random.uniform(700, 1800)
                error_rate += np.random.uniform(0.01, 0.05)

            elif anomaly_type == "cpu_spike":
                cpu_usage = np.random.uniform(85, 99)
                latency_ms *= np.random.uniform(1.5, 3)

            elif anomaly_type == "memory_spike":
                memory_usage = np.random.uniform(85, 99)
                latency_ms *= np.random.uniform(1.3, 2.5)

            elif anomaly_type == "request_burst":
                request_count = int(
                    np.random.uniform(250, 600)
                )
                latency_ms *= np.random.uniform(1.2, 2)

            elif anomaly_type == "error_burst":
                error_rate = np.random.uniform(0.15, 0.7)

                status_code = random.choice([
                    400,
                    404,
                    500,
                ])

            elif anomaly_type == "db_saturation":
                db_connections = int(
                    np.random.uniform(90, 150)
                )
                latency_ms *= np.random.uniform(1.5, 3)

            elif anomaly_type == "mixed_degradation":
                latency_ms = np.random.uniform(500, 1500)
                cpu_usage = np.random.uniform(75, 98)
                memory_usage = np.random.uniform(75, 98)
                error_rate = np.random.uniform(0.1, 0.5)

            message = random.choice(ANOMALY_MESSAGES)

            # Do NOT always make anomalies ERROR/CRITICAL
            level = random.choices(
                ANOMALY_LEVELS,
                weights=[0.25, 0.35, 0.30, 0.10],
            )[0]

        else:

            message = random.choice(NORMAL_MESSAGES)

            # Normal data can occasionally contain errors/warnings
            level = random.choices(
                NORMAL_LEVELS,
                weights=[0.82, 0.13, 0.05],
            )[0]

        rows.append({
            "timestamp": timestamp,
            "level": level,
            "service": service,
            "message": message,
            "latency_ms": round(float(latency_ms), 2),
            "status_code": status_code,
            "cpu_usage": round(float(cpu_usage), 2),
            "memory_usage": round(float(memory_usage), 2),
            "request_count": request_count,
            "error_rate": round(float(error_rate), 4),
            "db_connections": db_connections,
            "anomaly_type": anomaly_type,
            "is_anomaly": int(is_anomaly),
        })

    return pd.DataFrame(rows)


if __name__ == "__main__":
    df = generate_logs()

    output_path = Path(
        "data/processed/log_dataset.csv"
    )

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    df.to_csv(
        output_path,
        index=False,
    )

    print("========== DATASET GENERATED ==========")
    print(f"Total logs     : {len(df)}")
    print(
        f"Anomalies      : {df['is_anomaly'].sum()}"
    )
    print(
        f"Normal logs    : {(df['is_anomaly'] == 0).sum()}"
    )
    print(
        f"Anomaly ratio  : "
        f"{df['is_anomaly'].mean():.2%}"
    )

    print("\nAnomaly types:")
    print(
        df[df["is_anomaly"] == 1]
        ["anomaly_type"]
        .value_counts()
    )

    print(
        f"\nSaved to: {output_path}"
    )