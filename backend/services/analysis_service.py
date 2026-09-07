import pandas as pd

from backend.ml.anomaly_detection import (
    get_anomaly_scores,
    load_anomaly_model,
    load_threshold,
    predict_with_threshold,
)

from backend.ml.clustering import (
    load_clustering_model,
)

from backend.ml.feature_engineering import (
    extract_features,
)

from backend.services.incident_service import (
    group_anomalies_into_incidents,
)


def analyze_logs(logs):
    """
    Complete log analysis pipeline.

    Steps:
    1. Feature extraction
    2. Anomaly detection
    3. Cluster assignment
    4. Incident grouping
    """

    if not logs:
        return {
            "logs": [],
            "incidents": [],
        }

    # ---------------------------------
    # Convert logs to DataFrame
    # ---------------------------------

    df = pd.DataFrame(logs)

    # ---------------------------------
    # Extract features
    # ---------------------------------

    features = extract_features(df)

    # ---------------------------------
    # Load anomaly model
    # ---------------------------------

    anomaly_model = load_anomaly_model()

    # ---------------------------------
    # Load saved validation threshold
    # ---------------------------------

    threshold = load_threshold()

    # ---------------------------------
    # Generate anomaly scores
    # ---------------------------------

    anomaly_scores = get_anomaly_scores(
        anomaly_model,
        features,
    )

    # ---------------------------------
    # Apply threshold
    # ---------------------------------

    anomaly_predictions = (
        predict_with_threshold(
            anomaly_scores,
            threshold,
        )
    )

    # ---------------------------------
    # Load clustering model
    # ---------------------------------

    clustering_model, scaler = (
        load_clustering_model()
    )

    # ---------------------------------
    # Predict clusters
    # ---------------------------------

    cluster_labels = clustering_model.predict(
        scaler.transform(features)
    )

    # ---------------------------------
    # Build analyzed logs
    # ---------------------------------

    analyzed_logs = []

    for index, log in enumerate(logs):

        analyzed_log = {
            **log,

            "anomaly_score": float(
                anomaly_scores[index]
            ),

            "is_anomaly": int(
                anomaly_predictions[index]
            ),

            "cluster": int(
                cluster_labels[index]
            ),
        }

        analyzed_logs.append(
            analyzed_log
        )

    # ---------------------------------
    # Group anomalies into incidents
    # ---------------------------------

    incidents = (
        group_anomalies_into_incidents(
            analyzed_logs
        )
    )

    # ---------------------------------
    # Final response
    # ---------------------------------

    return {
        "logs": analyzed_logs,
        "incidents": incidents,
    }