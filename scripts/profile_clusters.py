import pandas as pd

from backend.ml.clustering import load_clustering_model
from backend.ml.feature_engineering import extract_features


DATASET_PATH = "data/processed/log_dataset.csv"


def main():
    print("Loading dataset...")

    df = pd.read_csv(DATASET_PATH)

    df["timestamp"] = pd.to_datetime(
        df["timestamp"]
    )

    X = extract_features(df)

    model, scaler = load_clustering_model()

    cluster_labels = model.predict(
        scaler.transform(X)
    )

    df["cluster"] = cluster_labels

    print("\n===== CLUSTER PROFILES =====")

    for cluster_id in sorted(
        df["cluster"].unique()
    ):
        cluster_df = df[
            df["cluster"] == cluster_id
        ]

        print(
            f"\n--- Cluster {cluster_id} ---"
        )

        print(
            f"Logs: {len(cluster_df)}"
        )

        print(
            f"Anomaly rate: "
            f"{cluster_df['is_anomaly'].mean():.2%}"
        )

        print(
            f"Avg latency: "
            f"{cluster_df['latency_ms'].mean():.2f} ms"
        )

        print(
            f"Avg CPU: "
            f"{cluster_df['cpu_usage'].mean():.2f}%"
        )

        print(
            f"Avg memory: "
            f"{cluster_df['memory_usage'].mean():.2f}%"
        )

        print(
            f"Avg requests: "
            f"{cluster_df['request_count'].mean():.2f}"
        )

        print(
            f"Avg error rate: "
            f"{cluster_df['error_rate'].mean():.4f}"
        )

        print(
            f"Avg DB connections: "
            f"{cluster_df['db_connections'].mean():.2f}"
        )

        print("\nServices:")

        print(
            cluster_df["service"]
            .value_counts()
            .to_string()
        )

        print("\nLevels:")

        print(
            cluster_df["level"]
            .value_counts()
            .to_string()
        )

        print("\nAnomaly types:")

        print(
            cluster_df["anomaly_type"]
            .value_counts()
            .to_string()
        )


if __name__ == "__main__":
    main()