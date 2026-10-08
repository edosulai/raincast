"""Data preprocessing pipeline for BMKG Sicincin rainfall dataset.

Academic Context: Skripsi S1 Informatika UPI YPTK Padang (2022) - Edo Sulaiman
Dataset: Stasiun Klimatologi Sicincin Padang Pariaman (1985-2021)
"""

from typing import List, Tuple, Optional
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler


# BMKG special status codes representing missing/invalid observations
BMKG_NA_CODES = [8888, 9999, 2555]


def load_climate_data(
    filepath: str,
    feature_cols: Optional[List[str]] = None,
    time_col: str = "tanggal"
) -> pd.DataFrame:
    """Load BMKG climate CSV and replace status codes with NaN.

    Args:
        filepath: Path to CSV dataset (e.g. 1985-2021.csv).
        feature_cols: Specific columns to load. If None, loads all columns.
        time_col: Name of datetime column.

    Returns:
        DataFrame with replaced NaN values and parsed datetime index/column.
    """
    cols_to_use = None
    if feature_cols:
        cols_to_use = [time_col] + [c for c in feature_cols if c != time_col]

    df = pd.read_csv(filepath, usecols=cols_to_use)
    df.replace(to_replace=BMKG_NA_CODES, value=np.nan, inplace=True)
    df[time_col] = pd.to_datetime(df[time_col])
    return df


def preprocess_data(
    df: pd.DataFrame,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    time_col: str = "tanggal",
    feature_col: str = "rr"
) -> pd.DataFrame:
    """Filter date slice and perform linear interpolation on missing values.

    Args:
        df: Raw BMKG DataFrame.
        start_date: Starting observation date (YYYY-MM-DD).
        end_date: Ending observation date (YYYY-MM-DD).
        time_col: Name of datetime column.
        feature_col: Target rainfall column ('rr').

    Returns:
        Cleaned DataFrame with interpolated missing values.
    """
    cleaned = df.copy()

    if start_date and end_date:
        mask = (cleaned[time_col] >= pd.to_datetime(start_date)) & (
            cleaned[time_col] <= pd.to_datetime(end_date)
        )
        cleaned = cleaned.loc[mask].reset_index(drop=True)

    # Linear interpolation for continuous physical climate measurements
    cleaned[feature_col] = cleaned[feature_col].interpolate(method="linear")
    cleaned.dropna(subset=[feature_col], inplace=True)
    return cleaned


def create_sliding_windows(
    dataset: np.ndarray,
    timestep: int = 2
) -> Tuple[np.ndarray, np.ndarray]:
    """Transform sequential time-series vector into (X, y) sliding window pairs.

    For timestep=2 and sequence [x0, x1, x2, x3]:
        X[0] = [x0, x1], y[0] = x2
        X[1] = [x1, x2], y[1] = x3

    Args:
        dataset: 2D array of scaled shape (N, num_features).
        timestep: Lookback sequence window size.

    Returns:
        X: Feature tensor with shape (samples, num_features, timestep).
        y: Target array with shape (samples,).
    """
    data_x, data_y = [], []
    for i in range(len(dataset) - timestep):
        data_x.append(dataset[i : i + timestep, 0])
        data_y.append(dataset[i + timestep, 0])

    x_arr = np.array(data_x)
    y_arr = np.array(data_y)

    # Reshape to (batch_size, n_features, timesteps) to match thesis backwards LSTM
    if x_arr.ndim == 2:
        x_arr = np.reshape(x_arr, (x_arr.shape[0], 1, x_arr.shape[1]))

    return x_arr, y_arr


def prepare_dataset_for_experiment(
    csv_path: str,
    start_date: str = "2004-10-16",
    end_date: str = "2004-12-14",
    timestep: int = 2,
    train_ratio: float = 0.9,
    feature_col: str = "rr"
) -> dict:
    """Complete preprocessing pipeline matching the 2022 thesis specification.

    Thesis Configuration:
        - Range: 16 October 2004 - 14 December 2004 (60 rows)
        - Train/Test Split: 90% training (54 rows), 10% testing (6 rows)
        - Timestep: 2 lookback days
        - Feature: rr (rainfall in mm)

    Returns:
        Dictionary containing X_train, y_train, X_test, y_test, scaler, and metadata.
    """
    raw_df = load_climate_data(csv_path, feature_cols=[feature_col])
    clean_df = preprocess_data(
        raw_df, start_date=start_date, end_date=end_date, feature_col=feature_col
    )

    feature_values = clean_df[[feature_col]].values.astype(np.float32)

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_values = scaler.fit_transform(feature_values)

    train_size = int(len(scaled_values) * train_ratio)
    train_set = scaled_values[:train_size]
    test_set = scaled_values[train_size:]

    x_train, y_train = create_sliding_windows(train_set, timestep=timestep)
    x_test, y_test = create_sliding_windows(test_set, timestep=timestep)

    return {
        "x_train": x_train,
        "y_train": y_train,
        "x_test": x_test,
        "y_test": y_test,
        "scaler": scaler,
        "dates_train": clean_df["tanggal"].iloc[:train_size].tolist(),
        "dates_test": clean_df["tanggal"].iloc[train_size:].tolist(),
        "feature_values": feature_values,
        "scaled_values": scaled_values,
        "df": clean_df
    }
