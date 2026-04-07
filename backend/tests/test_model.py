import pytest

from model import FootballPredictor


def test_extract_features_handles_zero_shots():
    predictor = FootballPredictor()

    features = predictor._extract_features([1, 0, 0, 0, 0, 0, 1, 0])

    assert features == [1, 0, 0.0, 0.0, 0.0, -1]


@pytest.mark.parametrize(
    ("home_goals", "away_goals", "expected"),
    [(2, 1, "Home Win"), (1, 2, "Away Win"), (1, 1, "Draw")],
)
def test_get_outcome(home_goals, away_goals, expected):
    predictor = FootballPredictor()

    assert predictor._get_outcome(home_goals, away_goals) == expected


def test_train_sets_model_state_and_performance():
    predictor = FootballPredictor()

    predictor.train()

    assert predictor.is_trained is True
    assert predictor.training_samples > 0
    assert set(predictor.model_scores.keys()) == set(predictor.models.keys())

    performance = predictor.get_model_performance()
    assert len(performance) == len(predictor.models)
    for model_metrics in performance:
        assert {"name", "accuracy", "precision", "f1Score"} <= set(model_metrics.keys())
        assert 0 <= model_metrics["accuracy"] <= 1


def test_predict_requires_training_first():
    predictor = FootballPredictor()

    with pytest.raises(ValueError, match="Models not trained"):
        predictor.predict(
            home_goals=2,
            home_shots=15,
            home_shots_on_target=8,
            home_red_cards=0,
            away_goals=1,
            away_shots=10,
            away_shots_on_target=5,
            away_red_cards=0,
        )


def test_predict_returns_sorted_predictions():
    predictor = FootballPredictor()
    predictor.train()

    predictions = predictor.predict(
        home_goals=2,
        home_shots=15,
        home_shots_on_target=8,
        home_red_cards=0,
        away_goals=1,
        away_shots=10,
        away_shots_on_target=5,
        away_red_cards=0,
    )

    assert len(predictions) == len(predictor.models)
    confidences = [prediction["confidence"] for prediction in predictions]
    assert confidences == sorted(confidences, reverse=True)
    for prediction in predictions:
        assert {"modelName", "outcome", "confidence", "modelAccuracy"} <= set(prediction.keys())
        assert prediction["outcome"] in predictor.classes
