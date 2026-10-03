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
    # Apply ML threshold
    # ---------------------------------

    anomaly_predictions = predict_with_threshold(
        anomaly_scores,
        threshold,
    )

    # ---------------------------------
    # Load clustering model
    # ---------------------------------

    clustering_model, scaler = load_clustering_model()

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
    # Build incident candidates
    #
    # ML anomalies remain anomalies.
    # ERROR logs are also surfaced as
    # incident candidates for E2E
    # investigation.
    # ---------------------------------

    incident_candidates = []

    for log in analyzed_logs:

        if (
            log["is_anomaly"] == 1
            or str(log.get("level", "")).upper() == "ERROR"
        ):
            incident_candidates.append(log)

    # ---------------------------------
    # Group incident candidates
    # ---------------------------------

    incidents = group_anomalies_into_incidents(
        incident_candidates
    )

    # ---------------------------------
    # Final response
    # ---------------------------------

    return {
        "logs": analyzed_logs,
        "incidents": incidents,
    }