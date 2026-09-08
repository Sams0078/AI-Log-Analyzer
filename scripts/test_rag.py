import sys
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))


from backend.ai.root_cause import (
    analyze_incident_with_ai,
    retrieve_similar_logs,
)


DATASET_PATH = PROJECT_ROOT / "data" / "processed" / "log_dataset.csv"


def main():
    df = pd.read_csv(DATASET_PATH)

    incident = {
        "incident_id": 1,
        "anomaly_count": 1,
        "services": ["api-service"],
        "levels": ["WARNING"],
        "logs": [
            {
                "service": "api-service",
                "level": "WARNING",
                "message": "High latency detected",
                "latency_ms": 850,
                "cpu_usage": 72.5,
                "memory_usage": 68.2,
                "request_count": 145,
                "error_rate": 0.08,
                "db_connections": 42,
            }
        ],
    }

    print("Retrieving similar historical logs...")

    retrieved = retrieve_similar_logs(
        incident,
        top_k=5,
    )

    similar_logs = []

    for result in retrieved:
        log = df.iloc[result["index"]]

        similar_logs.append({
            "distance": result["distance"],
            "service": log["service"],
            "level": log["level"],
            "message": log["message"],
            "latency_ms": log["latency_ms"],
            "cpu_usage": log["cpu_usage"],
            "memory_usage": log["memory_usage"],
            "request_count": log["request_count"],
            "error_rate": log["error_rate"],
            "db_connections": log["db_connections"],
        })

    print("\n===== RETRIEVED CONTEXT =====")

    for index, log in enumerate(similar_logs, start=1):
        print(f"\n--- Historical Log {index} ---")
        print(log)

    print("\n===== QWEN3 RAG ANALYSIS =====")

    response = analyze_incident_with_ai(
        incident,
        similar_logs,
    )

    print(response)


if __name__ == "__main__":
    main()