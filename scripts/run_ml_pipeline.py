import pandas as pd

from backend.ml.anomaly_detection import (
    get_anomaly_scores,
    find_best_threshold,
    predict_with_threshold,
    save_threshold,
    train_anomaly_model,
)
from backend.ml.evaluation import evaluate_model
from backend.ml.feature_engineering import extract_features


DATASET_PATH = "data/processed/log_dataset.csv"


def temporal_three_way_split(
    df,
    train_size=0.70,
    validation_size=0.15,
):
    df = df.sort_values("timestamp").reset_index(drop=True)

    total = len(df)

    train_end = int(total * train_size)
    validation_end = int(
        total * (train_size + validation_size)
    )

    train_df = df.iloc[:train_end].copy()

    validation_df = df.iloc[
        train_end:validation_end
    ].copy()

    test_df = df.iloc[
        validation_end:
    ].copy()

    return (
        train_df,
        validation_df,
        test_df,
    )


def main():
    print("Loading dataset...")

    df = pd.read_csv(DATASET_PATH)

    df["timestamp"] = pd.to_datetime(
        df["timestamp"]
    )

    print(
        f"Total logs: {len(df)}"
    )

    print(
        f"Total anomalies: "
        f"{df['is_anomaly'].sum()}"
    )

    # ---------------------------------
    # Temporal Train / Validation / Test
    # ---------------------------------

    train_df, validation_df, test_df = (
        temporal_three_way_split(df)
    )

    print("\nDataset split:")

    print(
        f"Training   : {len(train_df)}"
    )

    print(
        f"Validation : {len(validation_df)}"
    )

    print(
        f"Testing    : {len(test_df)}"
    )

    # ---------------------------------
    # Feature Engineering
    # ---------------------------------

    X_train = extract_features(
        train_df
    )

    X_validation = extract_features(
        validation_df
    )

    X_test = extract_features(
        test_df
    )

    y_validation = (
        validation_df["is_anomaly"]
        .astype(int)
        .values
    )

    y_test = (
        test_df["is_anomaly"]
        .astype(int)
        .values
    )

    # ---------------------------------
    # Train Model
    # ---------------------------------

    print(
        "\nTraining Isolation Forest..."
    )

    model = train_anomaly_model(
        X_train
    )

    print(
        "Training completed."
    )

    # ---------------------------------
    # Validation Scores
    # ---------------------------------

    validation_scores = (
        get_anomaly_scores(
            model,
            X_validation,
        )
    )

    # ---------------------------------
    # Find Best Threshold
    # ---------------------------------

    threshold, validation_f1 = (
        find_best_threshold(
            y_validation,
            validation_scores,
        )
    )

    print(
        f"\nBest validation threshold: "
        f"{threshold:.6f}"
    )

    print(
        f"Best validation F1: "
        f"{validation_f1:.4f}"
    )

    # ---------------------------------
    # Save Validated Threshold
    # ---------------------------------

    save_threshold(
        threshold
    )

    print(
        "Threshold saved: "
        "model/anomaly/threshold.json"
    )

    # ---------------------------------
    # Validation Evaluation
    # ---------------------------------

    validation_predictions = (
        predict_with_threshold(
            validation_scores,
            threshold,
        )
    )

    validation_results = evaluate_model(
        y_validation,
        validation_predictions,
        validation_scores,
    )

    print(
        "\n===== VALIDATION ====="
    )

    print(
        f"Precision : "
        f"{validation_results['precision']:.4f}"
    )

    print(
        f"Recall    : "
        f"{validation_results['recall']:.4f}"
    )

    print(
        f"F1 Score  : "
        f"{validation_results['f1_score']:.4f}"
    )

    # ---------------------------------
    # Final Test
    # ---------------------------------

    test_scores = get_anomaly_scores(
        model,
        X_test,
    )

    test_predictions = (
        predict_with_threshold(
            test_scores,
            threshold,
        )
    )

    test_results = evaluate_model(
        y_test,
        test_predictions,
        test_scores,
    )

    print(
        "\n===== FINAL TEST ====="
    )

    print(
        f"Precision : "
        f"{test_results['precision']:.4f}"
    )

    print(
        f"Recall    : "
        f"{test_results['recall']:.4f}"
    )

    print(
        f"F1 Score  : "
        f"{test_results['f1_score']:.4f}"
    )

    if "roc_auc" in test_results:
        print(
            f"ROC-AUC   : "
            f"{test_results['roc_auc']:.4f}"
        )

    if "pr_auc" in test_results:
        print(
            f"PR-AUC    : "
            f"{test_results['pr_auc']:.4f}"
        )

    # ---------------------------------
    # Confusion Matrix
    # ---------------------------------

    print(
        "\nConfusion Matrix:"
    )

    print(
        test_results["confusion_matrix"]
    )

    # ---------------------------------
    # Classification Report
    # ---------------------------------

    print(
        "\nClassification Report:"
    )

    print(
        test_results[
            "classification_report"
        ]
    )

    # ---------------------------------
    # Saved Artifacts
    # ---------------------------------

    print(
        "\nModel saved:"
        "\nmodel/anomaly/isolation_forest.pkl"
    )

    print(
        "Threshold saved:"
        "\nmodel/anomaly/threshold.json"
    )


if __name__ == "__main__":
    main()