import sys
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))


from backend.ai.embeddings import create_embeddings, create_log_text
from backend.ai.vector_store import create_index


DATASET_PATH = PROJECT_ROOT / "data" / "processed" / "log_dataset.csv"


def main():
    print("Loading dataset...")

    df = pd.read_csv(DATASET_PATH)

    if df.empty:
        raise ValueError("Dataset is empty.")

    logs = df.to_dict(orient="records")

    texts = [
        create_log_text(log)
        for log in logs
    ]

    print(f"Creating embeddings for {len(texts)} logs...")

    embeddings = create_embeddings(texts)

    print("Building FAISS index...")

    create_index(embeddings)

    print("FAISS index created successfully.")
    print("Index path: vector_db/logs.index")


if __name__ == "__main__":
    main()