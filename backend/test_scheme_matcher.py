import pytest
from scheme_matcher import SchemeMatcher


def test_scheme_matcher_initialization():
    """Test scheme matcher initialization"""
    matcher = SchemeMatcher()
    assert matcher is not None
    assert len(matcher.schemes) > 0


def test_get_schemes():
    """Test getting matching schemes"""
    matcher = SchemeMatcher()
    farmer_data = {
        "land_size": 2.5,
        "credit_score": 680,
        "gender": "female",
        "shg_member": True,
        "annual_income": 75000
    }
    schemes = matcher.get_schemes("TEST123", farmer_data)
    assert len(schemes) > 0
    assert all("scheme_id" in s for s in schemes)
    assert all("match_score" in s for s in schemes)


def test_check_eligibility():
    """Test eligibility checking"""
    matcher = SchemeMatcher()
    farmer_data = {
        "land_size": 2.5,
        "credit_score": 680,
        "gender": "female"
    }
    scheme = matcher.schemes[0]
    result = matcher.check_eligibility(farmer_data, scheme)
    assert isinstance(result, bool)


def test_calculate_match_score():
    """Test match score calculation"""
    matcher = SchemeMatcher()
    farmer_data = {
        "land_size": 2.5,
        "credit_score": 680,
        "shg_member": True,
        "annual_income": 75000
    }
    scheme = matcher.schemes[0]
    score = matcher.calculate_match_score(farmer_data, scheme)
    assert score >= 0
    assert score <= 100


def test_get_scheme_by_id():
    """Test getting scheme by ID"""
    matcher = SchemeMatcher()
    scheme = matcher.get_scheme_by_id("PM-KISAN")
    assert scheme is not None
    assert scheme["id"] == "PM-KISAN"
