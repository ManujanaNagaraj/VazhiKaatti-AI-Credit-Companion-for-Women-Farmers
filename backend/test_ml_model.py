import pytest
from ml_model import CreditScoreModel


def test_credit_score_model_initialization():
    """Test model initialization"""
    model = CreditScoreModel()
    assert model is not None
    assert len(model.feature_names) == 10


def test_predict_score():
    """Test score prediction"""
    model = CreditScoreModel()
    answers = {
        "land_size": 2.5,
        "annual_income": 75000,
        "age": 35,
        "education_level": "middle",
        "family_size": 4,
        "livestock_owned": 3,
        "years_farming": 12,
        "loan_history": "good",
        "savings_amount": 15000,
        "group_membership": 1
    }
    score = model.predict_score(answers)
    assert score >= 300
    assert score <= 900


def test_get_category():
    """Test category classification"""
    model = CreditScoreModel()
    assert model.get_category(800) == "Excellent"
    assert model.get_category(700) == "Good"
    assert model.get_category(600) == "Fair"
    assert model.get_category(500) == "Needs Improvement"


def test_encode_education():
    """Test education encoding"""
    model = CreditScoreModel()
    assert model.encode_education("none") == 0
    assert model.encode_education("primary") == 1
    assert model.encode_education("college") == 4


def test_encode_loan_history():
    """Test loan history encoding"""
    model = CreditScoreModel()
    assert model.encode_loan_history("none") == 0
    assert model.encode_loan_history("excellent") == 4
