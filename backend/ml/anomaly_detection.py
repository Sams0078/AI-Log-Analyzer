from pathlib import Path
import json

import joblib
import numpy as np
from sklearn.ensemble import IsolationForest


MODEL_PATH = Path("model/anomaly/isolation_forest.pkl")
THRESHOLD_PATH = Path("model/anomaly/threshold.json")


def train_anomaly_model(X_train):
    model = IsolationForest(
        n_estimators=200,
        contamination="auto",
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train)

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(
        model,
        MODEL_PATH,
    )

    return model


def get_anomaly_scores(model, X):
    """
    Higher score = more anomalous.
    """
    return -model.decision_function(X)


def calculate_threshold(
    train_scores,
    contamination=0.15,
):
    """
    Learn anomaly threshold from training scores.
    """
    scores = np.asarray(train_scores)

    if scores.size == 0:
        raise ValueError(
            "Cannot calculate threshold from empty scores."
        )

    if not 0 < contamination < 1:
        raise ValueError(
            "Contamination must be between 0 and 1."
        )

    threshold = np.quantile(
        scores,
        1 - contamination,
    )

    return float(threshold)


def predict_with_threshold(
    scores,
    threshold,
):
    """
    Convert anomaly scores into binary predictions.

    1 = anomaly
    0 = normal
    """
    scores = np.asarray(scores)

    return (
        scores >= threshold
    ).astype(int)


def load_anomaly_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found: {MODEL_PATH}"
        )

    return joblib.load(MODEL_PATH)


def find_best_threshold(
    y_true,
    scores,
):
    """
    Find the threshold that maximizes F1
    on validation data.
    """
    from sklearn.metrics import f1_score

    scores = np.asarray(scores)
    y_true = np.asarray(y_true)

    best_threshold = None
    best_f1 = -1

    for threshold in np.unique(scores):
        predictions = (
            scores >= threshold
        ).astype(int)

        f1 = f1_score(
            y_true,
            predictions,
            zero_division=0,
        )

        if f1 > best_f1:
            best_f1 = f1
            best_threshold = threshold

    return (
        float(best_threshold),
        float(best_f1),
    )


def save_threshold(threshold):
    """
    Save the validated anomaly threshold.
    """
    THRESHOLD_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(
        THRESHOLD_PATH,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            {"threshold": float(threshold)},
            file,
            indent=4,
        )


def load_threshold():
    """
    Load the validated anomaly threshold.
    """
    if not THRESHOLD_PATH.exists():
        raise FileNotFoundError(
            f"Threshold not found: {THRESHOLD_PATH}"
        )

    with open(
        THRESHOLD_PATH,
        "r",
        encoding="utf-8",
    ) as file:
        data = json.load(file)

    return float(data["threshold"])