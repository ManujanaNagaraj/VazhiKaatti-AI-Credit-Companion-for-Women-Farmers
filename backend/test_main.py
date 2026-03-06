import pytest
from main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_register_farmer():
    """Test farmer registration"""
    farmer_data = {
        "name": "Test Farmer",
        "age": 35,
        "land_size": 2.5,
        "crop_type": "rice",
        "annual_income": 75000,
        "location": "Thanjavur",
        "education_level": "middle",
        "family_size": 4
    }
    response = client.post("/api/register", json=farmer_data)
    assert response.status_code == 200
    assert "farmer_id" in response.json()


def test_calculate_credit_score():
    """Test credit score calculation"""
    request_data = {
        "farmer_id": "TEST123",
        "answers": {
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
    }
    response = client.post("/api/calculate-credit-score", json=request_data)
    assert response.status_code == 200
    assert "credit_score" in response.json()
    assert "category" in response.json()


def test_get_schemes():
    """Test scheme matching"""
    response = client.get("/api/schemes/TEST123")
    assert response.status_code == 200
    assert "schemes" in response.json()


def test_officer_dashboard():
    """Test officer dashboard"""
    response = client.get("/api/officer/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_farmers" in data
    assert "pending_verifications" in data
