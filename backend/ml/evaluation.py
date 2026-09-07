from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
)


def evaluate_model(y_true, y_pred, anomaly_scores=None):
    results = {
        "precision": precision_score(
            y_true,
            y_pred,
            zero_division=0,
        ),
        "recall": recall_score(
            y_true,
            y_pred,
            zero_division=0,
        ),
        "f1_score": f1_score(
            y_true,
            y_pred,
            zero_division=0,
        ),
        "confusion_matrix": confusion_matrix(
            y_true,
            y_pred,
        ).tolist(),
        "classification_report": classification_report(
            y_true,
            y_pred,
            zero_division=0,
        ),
    }

    if anomaly_scores is not None and len(set(y_true)) > 1:
        results["roc_auc"] = roc_auc_score(
            y_true,
            anomaly_scores,
        )

        results["pr_auc"] = average_precision_score(
            y_true,
            anomaly_scores,
        )

    return results