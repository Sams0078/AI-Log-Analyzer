from backend.ai.embeddings import create_embedding, create_log_text
from backend.ai.ollama_client import generate_response
from backend.ai.prompts import build_root_cause_prompt
from backend.ai.vector_store import load_index, search_index


def retrieve_similar_logs(incident: dict, top_k: int = 5):
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

    return [
        {
            "distance": float(distance),
            "index": int(index_id),
        }
        for distance, index_id in zip(distances, indices)
    ]


def analyze_incident_with_ai(
    incident: dict,
    similar_logs: list[dict] | None = None,
) -> str:

    if similar_logs:
        incident = {
            **incident,
            "similar_historical_logs": similar_logs,
        }

    prompt = build_root_cause_prompt(incident)

    response = generate_response(
        prompt,
        temperature=0.2,
    )

    return response