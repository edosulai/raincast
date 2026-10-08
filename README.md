# Raincast — Deep Learning Rainfall Forecasting (LSTM)

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://www.tensorflow.org/)
[![Status](https://img.shields.io/badge/Status-Completed%20Research-success.svg)]()

> **Archived Academic Research Artifact (2022)**  
> Undergraduate Thesis Project in Computer Science (Informatics Engineering) — Universitas Putra Indonesia YPTK Padang.  
> **Author:** Edo Sulaiman

---

## 1. Project Overview & Research Context

**Raincast** is a time-series deep learning research project designed to forecast daily precipitation (rainfall depth in mm) for the tropical region of **Padang Pariaman, West Sumatra, Indonesia**. 

Due to the complex topographical characteristics between the Indian Ocean and the Bukit Barisan mountain range, rainfall in this region exhibits extreme non-linearity and seasonal stochasticity. This research evaluates the capability of **Long Short-Term Memory (LSTM)** recurrent neural networks to capture long-term temporal dependencies in meteorological observations and deliver short-horizon rainfall projections (up to 4 days ahead) for agricultural planning and disaster mitigation.

---

## 2. Dataset & Preprocessing Pipeline

- **Data Source:** Official observation records from the **BMKG Sicincin Climatology Station** (Stasiun Klimatologi Padang Pariaman).
- **Temporal Range:** 36 continuous years (**1985 – 2021**).
- **Primary Feature:** Daily precipitation depth (`rr`, measured in mm).
- **Data Preprocessing Protocol (`src/data_preprocessing.py`):**
  1. **Missing & Anomaly Code Imputation:** BMKG error codes (`8888` for unmeasured, `9999` for missing/damaged sensor, `2555` for calibration errors) are filtered and interpolated using forward/backward temporal linear interpolation.
  2. **Min-Max Feature Scaling:** Data is mapped to the $[0, 1]$ interval to stabilize gradient propagation in LSTM recurrent gates:
     $$x_{\text{norm}} = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$$
  3. **Sliding Window 3D Tensor Structuring:** The sequential series is transformed into input-output tensor pairs $(X, y)$ with dimension `[samples, time_steps, features]`.
  4. **Dataset Partitioning:** 90% training partition (1985–2017) and 10% test evaluation partition (2018–2021).

---

## 3. Neural Architecture & Implementation Details

```
       Input Layer: (Batch Size, Time Steps = 4, Features = 1)
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │        LSTM Recurrent Hidden Layer           │
        │    - 1 Hidden Unit with Sigmoid & Tanh Gates │
        │    - Orthogonal Weight Initialization        │
        │    - Activation: tanh | Recurrent: sigmoid   │
        └──────────────────────────────────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │             Dense Output Layer               │
        │   - 1 Linear Unit (Single-step / Multi-step) │
        └──────────────────────────────────────────────┘
                               │
                               ▼
           Output: Next-Day / 4-Day Rainfall Depth (mm)
```

- **Mathematical Architecture (`src/lstm_model.py`):**
  - **Forget Gate:** $f_t = \sigma(W_f x_t + U_f h_{t-1} + b_f)$
  - **Input Gate:** $i_t = \sigma(W_i x_t + U_i h_{t-1} + b_i)$
  - **Candidate State:** $\tilde{C}_t = \tanh(W_c x_t + U_c h_{t-1} + b_c)$
  - **Cell State Update:** $C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t$
  - **Output Gate:** $o_t = \sigma(W_o x_t + U_o h_{t-1} + b_o)$
  - **Hidden State:** $h_t = o_t \odot \tanh(C_t)$
- **Optimizer:** Stochastic Gradient Descent (SGD) with learning rate $\alpha = 0.01$ and momentum tuning.
- **Loss Function:** Mean Squared Error (MSE).

---

## 4. Experimental Results

The model was validated against historical extreme weather occurrences and baseline statistical regression:

| Evaluation Metric | Test Set Score | Research Note |
| :--- | :--- | :--- |
| **Mean Squared Error (MSE)** | **0.0312** | Normalized scale $[0, 1]$ |
| **Root Mean Squared Error (RMSE)** | **0.1766** | Error standard deviation |
| **Mean Absolute Error (MAE)** | **0.0841** | Average absolute residual |
| **Forecast Horizon** | **Up to 4 Days** | Short-term projection |

---

## 5. Repository Structure

```text
raincast/
├── src/                               # Clean extracted Python research package
│   ├── __init__.py
│   ├── data_preprocessing.py          # BMKG data parser, cleaning & sliding window tensor
│   ├── lstm_model.py                  # Core LSTM neural network & metric evaluations
│   └── run_experiment.py              # CLI runnable inference test & verification
├── thesis_docs/                       # Academic thesis artifacts & references
│   ├── Assets/Jupyter Notebook/       # Original exploratory experiments & model training
│   ├── Jurnal/BIBLIOGRAPHY.md         # Reference bibliography index (190+ indexed papers)
│   └── Laporan/                       # Thesis documentation chapters & reports
├── proyeksi.sql                       # Database schema definition
├── requirements.txt                   # Cross-platform dependencies (clean UTF-8)
└── README.md                          # Comprehensive technical documentation
```

---

## 6. Getting Started

### Installation
Clone the repository and install dependencies in a Python 3.8+ virtual environment:
```bash
git clone https://github.com/edosulai/raincast.git
cd raincast
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Running Inference & Verification
To test the pipeline and inspect predicted rainfall projections:
```bash
python3 src/run_experiment.py
```

---

## 7. License & Citation

This repository is maintained for educational, archival, and research reference.  
Original dataset rights belong to **Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)** Indonesia.
