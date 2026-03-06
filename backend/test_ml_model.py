"""
VazhiKaatti - ML Model Tests
Test suite for credit scoring model for women farmers in Tamil Nadu
"""

import pytest
import os
from ml_model import CreditScoreModel


def test_credit_score_model_initialization():
    """Test model initialization"""
    model = CreditScoreModel()
    assert model is not None
    assert len(model.feature_names) == 10
    assert model.feature_names == [
        'years_of_farming', 'crop_type', 'annual_income_inr',
        'shg_member', 'pm_kisan_registered', 'has_bank_account',
        'existing_loans', 'land_area_acres', 'crop_insurance',
        'repayment_history'
    ]


def test_predict_score_excellent_farmer():
    """Test score prediction for excellent farmer profile"""
    model = CreditScoreModel()
    farmer_data = {
        "years_of_farming": 15,
        "crop_type": 2,  # Fruits
        "annual_income_inr": 250000,
        "shg_member": True,
        "pm_kisan_registered": True,
        "has_bank_account": True,
        "existing_loans": 0,
        "land_area_acres": 3.5,
        "crop_insurance": True,
        "repayment_history": 3  # Excellent
    }
    score = model.predict_score(farmer_data)
    assert score >= 0
    assert score <= 100
    assert score >= 70  # Expected high score


def test_predict_score_new_farmer():
    """Test score prediction for new farmer profile"""
    model = CreditScoreModel()
    farmer_data = {
        "years_of_farming": 2,
        "crop_type": 0,  # Rice
        "annual_income_inr": 50000,
        "shg_member": False,
        "pm_kisan_registered": False,
        "has_bank_account": True,
        "existing_loans": 1,
        "land_area_acres": 1.0,
        "crop_insurance": False,
        "repayment_history": 1  # Fair
    }
    score = model.predict_score(farmer_data)
    assert score >= 0
    assert score <= 100
    assert score <= 60  # Expected lower score


def test_predict_score_moderate_farmer():
    """Test score prediction for moderate farmer profile"""
    model = CreditScoreModel()
    farmer_data = {
        "years_of_farming": 7,
        "crop_type": 1,  # Vegetables
        "annual_income_inr": 120000,
        "shg_member": True,
        "pm_kisan_registered": True,
        "has_bank_account": True,
        "existing_loans": 1,
        "land_area_acres": 2.0,
        "crop_insurance": True,
        "repayment_history": 2  # Good
    }
    score = model.predict_score(farmer_data)
    assert score >= 0
    assert score <= 100
    assert 40 <= score <= 80  # Expected moderate score


def test_get_category():
    """Test category classification for new scoring system (0-100)"""
    model = CreditScoreModel()
    
    # Excellent category (80+)
    assert model.get_category(85) == "Excellent"
    assert model.get_category(100) == "Excellent"
    
    # Good category (60-79)
    assert model.get_category(70) == "Good"
    assert model.get_category(65) == "Good"
    
    # Fair category (40-59)
    assert model.get_category(50) == "Fair"
    assert model.get_category(45) == "Fair"
    
    # Needs Improvement category (<40)
    assert model.get_category(30) == "Needs Improvement"
    assert model.get_category(20) == "Needs Improvement"


def test_predict_score_with_boolean_conversion():
    """Test that boolean values are properly handled"""
    model = CreditScoreModel()
    farmer_data = {
        "years_of_farming": 10,
        "crop_type": 1,
        "annual_income_inr": 150000,
        "shg_member": 1,  # Using 1 instead of True
        "pm_kisan_registered": 1,
        "has_bank_account": 1,
        "existing_loans": 0,
        "land_area_acres": 2.5,
        "crop_insurance": 0,  # Using 0 instead of False
        "repayment_history": 2
    }
    score = model.predict_score(farmer_data)
    assert score >= 0
    assert score <= 100


def test_predict_score_edge_cases():
    """Test score prediction with edge case values"""
    model = CreditScoreModel()
    
    # Minimum values
    farmer_data_min = {
        "years_of_farming": 0,
        "crop_type": 0,
        "annual_income_inr": 0,
        "shg_member": False,
        "pm_kisan_registered": False,
        "has_bank_account": False,
        "existing_loans": 5,
        "land_area_acres": 0.1,
        "crop_insurance": False,
        "repayment_history": 0
    }
    score_min = model.predict_score(farmer_data_min)
    assert 0 <= score_min <= 100
    
    # Maximum values
    farmer_data_max = {
        "years_of_farming": 30,
        "crop_type": 3,
        "annual_income_inr": 500000,
        "shg_member": True,
        "pm_kisan_registered": True,
        "has_bank_account": True,
        "existing_loans": 0,
        "land_area_acres": 10.0,
        "crop_insurance": True,
        "repayment_history": 3
    }
    score_max = model.predict_score(farmer_data_max)
    assert 0 <= score_max <= 100


def test_model_files_exist():
    """Test that model files are created after training"""
    model = CreditScoreModel()
    # Model should be trained or loaded
    assert os.path.exists('models/credit_model.pkl')
    assert os.path.exists('models/scaler.pkl')


def test_feature_importance():
    """Test feature importance retrieval"""
    model = CreditScoreModel()
    importance = model.get_feature_importance()
    
    assert len(importance) == 10
    assert all(0 <= val <= 1 for val in importance.values())
    # Check that all features are present
    expected_features = set(model.feature_names)
    actual_features = set(importance.keys())
    assert expected_features == actual_features


def test_invalid_crop_type():
    """Test handling of invalid crop type"""
    model = CreditScoreModel()
    farmer_data = {
        "years_of_farming": 5,
        "crop_type": 4,  # Invalid crop type
        "annual_income_inr": 100000,
        "shg_member": True,
        "pm_kisan_registered": True,
        "has_bank_account": True,
        "existing_loans": 0,
        "land_area_acres": 2.0,
        "crop_insurance": True,
        "repayment_history": 2
    }
    # Should still return a valid score
    score = model.predict_score(farmer_data)
    assert 0 <= score <= 100


def test_invalid_repayment_history():
    """Test handling of invalid repayment history"""
    model = CreditScoreModel()
    farmer_data = {
        "years_of_farming": 5,
        "crop_type": 1,
        "annual_income_inr": 100000,
        "shg_member": True,
        "pm_kisan_registered": True,
        "has_bank_account": True,
        "existing_loans": 0,
        "land_area_acres": 2.0,
        "crop_insurance": True,
        "repayment_history": 4  # Invalid repayment history
    }
    # Should still return a valid score
    score = model.predict_score(farmer_data)
    assert 0 <= score <= 100
