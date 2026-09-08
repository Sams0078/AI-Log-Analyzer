from pathlib import Path

import faiss
import numpy as np


INDEX_PATH = Path("vector_db/logs.index")


def create_index(embeddings):
    embeddings = np.asarray(
        embeddings,
        dtype="float32",
    )

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    INDEX_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    faiss.write_index(
        index,
        str(INDEX_PATH),
    )

    return index


def search_index(index, query_embedding, top_k=5):
    query_embedding = np.asarray(
        [query_embedding],
        dtype="float32",
    )

    distances, indices = index.search(
        query_embedding,
        top_k,
    )

    return distances[0], indices[0]


def load_index():
    if not INDEX_PATH.exists():
        raise FileNotFoundError(
            f"FAISS index not found: {INDEX_PATH}"
        )

    return faiss.read_index(
        str(INDEX_PATH)
    )