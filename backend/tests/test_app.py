import importlib

import pytest


class FakePredictor:
    def __init__(self, is_trained=True):
        self.is_trained = is_trained
        self.training_samples = 42
        self.feature_names = ["goal_diff", "shot_diff"]
        self._models = [
            {"name": "Naive Bayes", "accuracy": 0.6, "precision": 0.61, "f1Score": 0.59},
            {"name": "Random Forest", "accuracy": 0.7, "precision": 0.71, "f1Score": 0.69},
            {
                "name": "Logistic Regression",
                "accuracy": 0.65,
                "precision": 0.66,
                "f1Score": 0.64,
            },
        ]
        self.last_predict_args = None
        self.raise_on_predict = False

    def get_model_performance(self):
        return self._models

    def predict(self, **kwargs):
        if self.raise_on_predict:
            raise RuntimeError("prediction failure")
        self.last_predict_args = kwargs
        return [
            {
                "modelName": "Naive Bayes",
                "outcome": "Home Win",
                "confidence": 75.0,
                "modelAccuracy": 0.6,
            }
        ]


@pytest.fixture
def app_module():
    return importlib.import_module("app")


@pytest.fixture
def client(app_module):
    return app_module.app.test_client()


def test_health_endpoint(client, app_module, monkeypatch):
    monkeypatch.setattr(app_module, "predictor", FakePredictor(is_trained=True))

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json() == {
        "status": "healthy",
        "models_trained": True,
        "model_count": 3,
    }


def test_models_endpoint_returns_500_when_untrained(client, app_module, monkeypatch):
    monkeypatch.setattr(app_module, "predictor", FakePredictor(is_trained=False))

    response = client.get("/api/models")

    assert response.status_code == 500
    assert response.get_json() == {"error": "Models not trained"}


def test_models_endpoint_returns_data(client, app_module, monkeypatch):
    fake_predictor = FakePredictor(is_trained=True)
    monkeypatch.setattr(app_module, "predictor", fake_predictor)

    response = client.get("/api/models")

    assert response.status_code == 200
    assert response.get_json() == {
        "models": fake_predictor.get_model_performance(),
        "training_samples": fake_predictor.training_samples,
        "features": fake_predictor.feature_names,
    }


def test_predict_endpoint_requires_all_fields(client, app_module, monkeypatch):
    monkeypatch.setattr(app_module, "predictor", FakePredictor(is_trained=True))
    payload = {
        "home_goals": 2,
        "home_shots": 15,
        "home_shots_on_target": 8,
        "home_red_cards": 0,
        "away_goals": 1,
        "away_shots": 10,
        "away_shots_on_target": 5,
    }

    response = client.post("/api/predict", json=payload)

    assert response.status_code == 400
    assert response.get_json() == {"error": "Missing field: away_red_cards"}


def test_predict_endpoint_returns_500_when_untrained(client, app_module, monkeypatch):
    monkeypatch.setattr(app_module, "predictor", FakePredictor(is_trained=False))

    response = client.post(
        "/api/predict",
        json={
            "home_goals": 2,
            "home_shots": 15,
            "home_shots_on_target": 8,
            "home_red_cards": 0,
            "away_goals": 1,
            "away_shots": 10,
            "away_shots_on_target": 5,
            "away_red_cards": 0,
        },
    )

    assert response.status_code == 500
    assert response.get_json() == {"error": "Models not trained"}


def test_predict_endpoint_successfully_converts_to_ints(client, app_module, monkeypatch):
    fake_predictor = FakePredictor(is_trained=True)
    monkeypatch.setattr(app_module, "predictor", fake_predictor)

    response = client.post(
        "/api/predict",
        json={
            "home_goals": "2",
            "home_shots": "15",
            "home_shots_on_target": "8",
            "home_red_cards": "0",
            "away_goals": "1",
            "away_shots": "10",
            "away_shots_on_target": "5",
            "away_red_cards": "0",
        },
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "success": True,
        "predictions": [
            {
                "modelName": "Naive Bayes",
                "outcome": "Home Win",
                "confidence": 75.0,
                "modelAccuracy": 0.6,
            }
        ],
    }
    assert fake_predictor.last_predict_args == {
        "home_goals": 2,
        "home_shots": 15,
        "home_shots_on_target": 8,
        "home_red_cards": 0,
        "away_goals": 1,
        "away_shots": 10,
        "away_shots_on_target": 5,
        "away_red_cards": 0,
    }


def test_predict_endpoint_handles_predictor_exceptions(client, app_module, monkeypatch):
    fake_predictor = FakePredictor(is_trained=True)
    fake_predictor.raise_on_predict = True
    monkeypatch.setattr(app_module, "predictor", fake_predictor)

    response = client.post(
        "/api/predict",
        json={
            "home_goals": 2,
            "home_shots": 15,
            "home_shots_on_target": 8,
            "home_red_cards": 0,
            "away_goals": 1,
            "away_shots": 10,
            "away_shots_on_target": 5,
            "away_red_cards": 0,
        },
    )

    assert response.status_code == 500
    assert response.get_json() == {"error": "prediction failure"}
