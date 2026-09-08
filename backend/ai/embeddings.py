from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


def create_log_text(log: dict) -> str:
    return (
        f"Service: {log.get('service', 'unknown')} | "
        f"Level: {log.get('level', 'INFO')} | "
        f"Message: {log.get('message', '')} | "
        f"Latency: {log.get('latency_ms', 'unknown')} ms | "
        f"CPU: {log.get('cpu_usage', 'unknown')}% | "
        f"Memory: {log.get('memory_usage', 'unknown')}% | "
        f"Requests: {log.get('request_count', 'unknown')} | "
        f"Error rate: {log.get('error_rate', 'unknown')} | "
        f"DB connections: {log.get('db_connections', 'unknown')}"
    )


def create_embedding(text: str):
    return model.encode(text)


def create_embeddings(texts: list[str]):
    return model.encode(
        texts,
        show_progress_bar=True,
    )