
# Raincast (Archived)

Archived academic project for rainfall forecasting using an LSTM-based deep learning approach.

## Status

- Archived reference project
- Built as a final-year university thesis artifact (2022)
- Kept public as historical learning material

## Project Summary

Raincast explores time-series rainfall prediction for the Padang Pariaman region using Long Short-Term Memory (LSTM). The project was created to evaluate whether recurrent neural networks can provide practical short-horizon rainfall projections for decision support.

## Scope

- Historical dataset: BMKG Sicincin station data (1985-2021)
- Feature focus: rainfall (`rr`)
- Data split: 90% training / 10% testing
- Forecast horizon in the thesis implementation: up to 4 days

## Tech Stack

- Python
- TensorFlow / Keras
- Django
- MySQL

## Reported Result (Thesis)

- Mean Squared Error (MSE): **0.03** on the reported experiment setup

## Repository Structure

```text
dataset/
models/
rainfall_predictor/
manage.py
README.md
```

## Context

This repository reflects an academic phase of my engineering journey. Most current production work is focused on frontend architecture, full-stack systems, and AI-integrated workflows in private company/client environments.
