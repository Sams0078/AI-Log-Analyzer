import sys
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))


from backend.ai.embeddings import create_embedding
from backend.ai.vector_store import load_index, search_index


DATASET_PATH = PROJECT_ROOT / "data" / "processed" / "log_dataset.csv"


def main():
    df = pd.read_csv(DATASET_PATH)

    index = load_index()

    query = "Database connection failure"

    query_embedding = create_embedding(query)

    distances, indices = search_index(
        index,
        query_embedding,
        top_k=20,
    )

    print(f"\nQuery: {query}")
    print("\n===== SIMILAR LOGS =====")

    seen_messages = set()
    results_shown = 0

    for distance, index_id in zip(distances, indices):
        log = df.iloc[index_id]
        message = str(log["message"])

        if message in seen_messages:
            continue

        seen_messages.add(message)
        results_shown += 1

        print(f"\n--- Result {results_shown} ---")
        print(f"Distance: {distance:.4f}")
        print(f"Service: {log['service']}")
        print(f"Level: {log['level']}")
        print(f"Message: {message}")

        if results_shown >= 5:
            break


if __name__ == "__main__":
    main()