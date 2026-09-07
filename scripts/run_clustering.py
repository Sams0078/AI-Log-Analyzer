import pandas as pd
from sklearn.metrics import silhouette_score

from backend.ml.clustering import train_clustering_model
from backend.ml.feature_engineering import extract_features


DATASET_PATH = "data/processed/log_dataset.csv"


def main():
    print("Loading dataset...")

    df = pd.read_csv(DATASET_PATH)

    df["timestamp"] = pd.to_datetime(
        df["timestamp"]
    )

    print(
        f"Total logs: {len(df)}"
    )

    # ---------------------------------
    # Feature Engineering
    # ---------------------------------

    X = extract_features(df)

    print(
        f"Features used: {X.shape[1]}"
    )

    # ---------------------------------
    # Test different K values
    # ---------------------------------

    print(
        "\nTesting cluster counts..."
    )

    best_k = None
    best_score = -1

    for k in range(2, 9):
        model, scaler = train_clustering_model(
            X,
            n_clusters=k,
        )

        X_scaled = scaler.transform(X)

        score = silhouette_score(
            X_scaled,
            model.labels_,
        )

        inertia = model.inertia_

        print(
            f"K={k} | "
            f"Silhouette={score:.4f} | "
            f"Inertia={inertia:.2f}"
        )

        if score > best_score:
            best_score = score
            best_k = k

    # ---------------------------------
    # Train final model
    # ---------------------------------

    print(
        f"\nBest K: {best_k}"
    )

    print(
        f"Best Silhouette Score: "
        f"{best_score:.4f}"
    )

    print(
        "\nTraining final clustering model..."
    )

    model, scaler = train_clustering_model(
        X,
        n_clusters=best_k,
    )

    cluster_labels = model.labels_

    # ---------------------------------
    # Cluster distribution
    # ---------------------------------

    print(
        "\nCluster Distribution:"
    )

    distribution = (
        pd.Series(cluster_labels)
        .value_counts()
        .sort_index()
    )

    for cluster_id, count in distribution.items():
        percentage = (
            count / len(cluster_labels)
        ) * 100

        print(
            f"Cluster {cluster_id}: "
            f"{count} logs "
            f"({percentage:.2f}%)"
        )

    # ---------------------------------
    # Saved model
    # ---------------------------------

    print(
        "\nClustering model saved:"
        "\nmodel/clustering/kmeans.pkl"
    )

    print(
        "Scaler saved:"
        "\nmodel/clustering/scaler.pkl"
    )


if __name__ == "__main__":
    main()