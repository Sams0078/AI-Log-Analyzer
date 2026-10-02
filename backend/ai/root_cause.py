from pathlib import Path

import pandas as pd

from backend.ai.embeddings import create_embedding, create_log_text
from backend.ai.ollama_client import generate_response
from backend.ai.prompts import build_root_cause_prompt
from backend.ai.vector_store import load_index, search_index


PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "log_dataset.csv"
)


def retrieve_similar_logs(
    incident: dict,
    top_k: int = 5,
):
    index = load_index()

    logs = incident.get("logs", [])

    if not logs:
        return []

    query_log = logs[0]
    query_text = create_log_text(query_log)

    query_embedding = create_embedding(query_text)

    distances, indices = search_index(
        index,
        query_embedding,
        top_k=top_k,
    )

    df = pd.read_csv(DATASET_PATH)

    results = []

    for distance, index_id in zip(
        distances,
        indices,
    ):
        if index_id < 0 or index_id >= len(df):
            continue

        log = df.iloc[int(index_id)]

        results.append(
            {
                "similarity_distance": float(distance),
                "service": str(log["service"]),
                "level": str(log["level"]),
                "message": str(log["message"]),
                "latency_ms": float(log["latency_ms"]),
                "cpu_usage": float(log["cpu_usage"]),
                "memory_usage": float(log["memory_usage"]),
                "request_count": float(log["request_count"]),
                "error_rate": float(log["error_rate"]),
                "db_connections": float(log["db_connections"]),
            }
        )

    return results


def analyze_incident_with_ai(
    incident: dict,
    similar_logs: list[dict] | None = None,
) -> str:

    if similar_logs:
        incident = {
            **incident,
            "similar_historical_logs": similar_logs,
        }

    prompt = build_root_cause_prompt(
        incident
    )

    response = generate_response(
        prompt,
        temperature=0.2,
    )

    return response