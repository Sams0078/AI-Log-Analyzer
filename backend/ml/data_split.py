import pandas as pd


def temporal_train_test_split(
    df: pd.DataFrame,
    test_size: float = 0.2,
):
    if len(df) < 2:
        raise ValueError("At least 2 records are required.")

    df = df.sort_values("timestamp").reset_index(drop=True)

    split_index = int(len(df) * (1 - test_size))

    if split_index <= 0 or split_index >= len(df):
        raise ValueError("Invalid train/test split.")

    train_df = df.iloc[:split_index].copy()
    test_df = df.iloc[split_index:].copy()

    return train_df, test_df