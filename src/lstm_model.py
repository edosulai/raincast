"""LSTM deep learning model definition and training for rainfall forecasting.

Academic Context: Skripsi S1 Informatika UPI YPTK Padang (2022) - Edo Sulaiman
Model: Single-layer Recurrent Neural Network (LSTM) for Short-Horizon Rain Forecasting
"""

from typing import Tuple, Optional, Dict, Any
import numpy as np


def build_thesis_lstm(
    unit_size: int = 1,
    batch_size: int = 1,
    n_features: int = 1,
    timestep: int = 2,
    learning_rate: float = 0.1,
    custom_init_weights: bool = True,
    dropout: float = 0.0
):
    """Construct sequential LSTM model matching the 2022 thesis architecture.

    Hyperparameter Baseline (Skripsi 2022):
        - Layer count: 1 Layer
        - Hidden units: 1 unit
        - Batch size: 1 (SGD update per sample timestep)
        - Direction: Backward propagation (go_backwards=True)
        - Optimizer: Stochastic Gradient Descent (SGD)
        - Learning Rate: 0.1
        - Epochs: 50
        - Initial Weights: Standard orthogonal normalized 0.5774 (1 / sqrt(3))

    Returns:
        Compiled tf.keras.models.Sequential model.
    """
    import tensorflow as tf

    model = tf.keras.models.Sequential(name="Raincast_LSTM_1Layer")

    initial_weights = None
    if custom_init_weights:
        # Initial weight matrices verified against manual thesis calculation
        # W (kernel): 2 inputs x 4 gates = (2, 4)
        # U (recurrent kernel): 1 unit x 4 gates = (1, 4)
        # b (bias): 4 gates = (4,)
        w_gate = np.full((timestep, 4), 0.5774, dtype=np.float32)
        u_gate = np.full((unit_size, 4), 0.5774, dtype=np.float32)
        b_gate = np.zeros((4,), dtype=np.float32)
        initial_weights = [w_gate, u_gate, b_gate]

    lstm_layer = tf.keras.layers.LSTM(
        units=unit_size,
        batch_input_shape=(batch_size, n_features, timestep),
        go_backwards=True,
        dropout=dropout,
        weights=initial_weights,
        name="lstm_layer"
    )

    model.add(lstm_layer)

    optimizer = tf.keras.optimizers.SGD(learning_rate=learning_rate)
    model.compile(
        optimizer=optimizer,
        loss="mean_squared_error",
        metrics=["mean_squared_error"]
    )
    return model


def train_model(
    model,
    x_train: np.ndarray,
    y_train: np.ndarray,
    epochs: int = 50,
    batch_size: int = 1,
    verbose: int = 1
) -> Dict[str, Any]:
    """Train the LSTM model on sequential training windows.

    Args:
        model: Compiled Keras LSTM model.
        x_train: Training input tensor of shape (N, n_features, timestep).
        y_train: Target values of shape (N,).
        epochs: Number of complete passes over the training dataset.
        batch_size: Size of training batches.
        verbose: Verbosity mode (0=silent, 1=progress bar, 2=one line per epoch).

    Returns:
        Training history dictionary.
    """
    import tensorflow as tf

    history = model.fit(
        x_train,
        y_train,
        shuffle=False,
        epochs=epochs,
        batch_size=batch_size,
        verbose=verbose
    )
    return history.history


def evaluate_forecast(
    y_true: np.ndarray,
    y_pred: np.ndarray
) -> Dict[str, float]:
    """Compute regression evaluation metrics (MSE and RMSE).

    Args:
        y_true: Ground truth target values (scaled or original mm).
        y_pred: Model predictions.

    Returns:
        Dictionary containing 'mse' and 'rmse'.
    """
    y_true = np.asarray(y_true).flatten()
    y_pred = np.asarray(y_pred).flatten()

    mse = float(np.mean((y_true - y_pred) ** 2))
    rmse = float(np.sqrt(mse))
    mae = float(np.mean(np.abs(y_true - y_pred)))

    return {
        "mse": mse,
        "rmse": rmse,
        "mae": mae
    }
