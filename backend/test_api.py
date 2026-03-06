"""
VazhiKaatti - API Testing Script
Test all backend endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"


def print_header(title):
    """Print formatted header"""
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)


def test_root():
    """Test root endpoint"""
    print_header("TEST 1: Root Endpoint")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_verify_aadhaar_success():
    """Test Aadhaar verification with valid OTP"""
    print_header("TEST 2: Aadhaar Verification (Valid OTP)")
    
    data = {
        "aadhaar_number": "123456789012",
        "otp": "1234"
    }
    
    response = requests.post(f"{BASE_URL}/verify-aadhaar", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    return response.status_code == 200


def test_verify_aadhaar_failure():
    """Test Aadhaar verification with invalid OTP"""
    print_header("TEST 3: Aadhaar Verification (Invalid OTP)")
    
    data = {
        "aadhaar_number": "123456789012",
        "otp": "0000"
    }
    
    response = requests.post(f"{BASE_URL}/verify-aadhaar", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 400


def test_fetch_land_records():
    """Test land records fetching"""
    print_header("TEST 4: Fetch Land Records")
    
    data = {
        "survey_number": "TN-2024-1234"
    }
    
    response = requests.post(f"{BASE_URL}/fetch-land-records", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    return response.status_code == 200


def test_predict_score():
    """Test credit score prediction"""
    print_header("TEST 5: Predict Credit Score")
    
    data = {
        "years_of_farming": 8,
        "crop_type": 1,
        "annual_income_inr": 120000,
        "shg_member": True,
        "pm_kisan_registered": True,
        "has_bank_account": True,
        "existing_loans": 1,
        "land_area_acres": 2.5,
        "crop_insurance": True,
        "repayment_history": 2
    }
    
    response = requests.post(f"{BASE_URL}/predict-score", json=data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    else:
        print(f"Error: {response.json()}")
    
    return response.status_code == 200


def test_match_schemes_excellent():
    """Test scheme matching for excellent score"""
    print_header("TEST 6: Match Schemes (Excellent Score)")
    
    response = requests.get(f"{BASE_URL}/match-schemes?score=85")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    return response.status_code == 200


def test_match_schemes_good():
    """Test scheme matching for good score"""
    print_header("TEST 7: Match Schemes (Good Score)")
    
    response = requests.get(f"{BASE_URL}/match-schemes?score=70")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    return response.status_code == 200


def test_match_schemes_fair():
    """Test scheme matching for fair score"""
    print_header("TEST 8: Match Schemes (Fair Score)")
    
    response = requests.get(f"{BASE_URL}/match-schemes?score=50")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    return response.status_code == 200


def test_match_schemes_poor():
    """Test scheme matching for poor score"""
    print_header("TEST 9: Match Schemes (Poor Score)")
    
    response = requests.get(f"{BASE_URL}/match-schemes?score=25")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    return response.status_code == 200


def run_all_tests():
    """Run all API tests"""
    print("\n" + "="*70)
    print("🧪 VAZHIKAATTI API TESTING SUITE")
    print("="*70)
    print("\nℹ️  Make sure the backend server is running on http://localhost:8000")
    print("   Start with: python backend/main.py")
    print()
    
    tests = [
        ("Root Endpoint", test_root),
        ("Aadhaar Verify (Valid)", test_verify_aadhaar_success),
        ("Aadhaar Verify (Invalid)", test_verify_aadhaar_failure),
        ("Fetch Land Records", test_fetch_land_records),
        ("Predict Score", test_predict_score),
        ("Match Schemes (Excellent)", test_match_schemes_excellent),
        ("Match Schemes (Good)", test_match_schemes_good),
        ("Match Schemes (Fair)", test_match_schemes_fair),
        ("Match Schemes (Poor)", test_match_schemes_poor),
    ]
    
    results = []
    
    try:
        for test_name, test_func in tests:
            try:
                result = test_func()
                results.append((test_name, "✓ PASS" if result else "✗ FAIL"))
            except requests.exceptions.ConnectionError:
                print("\n❌ ERROR: Cannot connect to backend server!")
                print("   Please start the server with: python backend/main.py")
                return
            except Exception as e:
                results.append((test_name, f"✗ ERROR: {str(e)}"))
        
        # Print summary
        print_header("TEST SUMMARY")
        for test_name, result in results:
            print(f"{result:10s} {test_name}")
        
        passed = sum(1 for _, r in results if "PASS" in r)
        total = len(results)
        
        print(f"\n📊 Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("✅ All tests passed!")
        else:
            print(f"⚠️  {total - passed} test(s) failed")
        
        print("="*70 + "\n")
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Testing interrupted by user")


if __name__ == "__main__":
    run_all_tests()
