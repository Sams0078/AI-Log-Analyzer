import joblib
from pathlib import Path

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


MODEL_PATH = Path("model/clustering/kmeans.pkl")
SCALER_PATH = Path("model/clustering/scaler.pkl")


def train_clustering_model(
    X,
    n_clusters=5,
):
    """
    Train a KMeans clustering model.

    Scaling is important because our features
    have different numeric ranges.
    """

    scaler = StandardScaler()

    X_scaled = scaler.fit_transform(X)

    model = KMeans(
        n_clusters=n_clusters,
        random_state=42,
        n_init=10,
    )

    model.fit(X_scaled)

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(
        model,
        MODEL_PATH,
    )

    joblib.dump(
        scaler,
        SCALER_PATH,
    )

    return model, scaler


def predict_clusters(
    model,
    scaler,
    X,
):
    """
    Assign each log to a cluster.
    """

    X_scaled = scaler.transform(X)

    return model.predict(
        X_scaled
    )


def load_clustering_model():
    """
    Load saved KMeans model and scaler.
    """

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Clustering model not found: {MODEL_PATH}"
        )

    if not SCALER_PATH.exists():
        raise FileNotFoundError(
            f"Scaler not found: {SCALER_PATH}"
        )

    model = joblib.load(
        MODEL_PATH
    )

    scaler = joblib.load(
        SCALER_PATH
    )

    return model, scaler