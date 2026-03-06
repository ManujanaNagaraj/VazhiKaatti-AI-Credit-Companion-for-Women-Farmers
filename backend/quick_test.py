"""Quick server test to verify all endpoints are working"""
import requests
import json

print("Testing VazhiKaatti API endpoints...\n")

try:
    # Test 1: Root endpoint
    print("1. Testing root endpoint...")
    r = requests.get("http://localhost:8000/")
    print(f"   ✓ Status: {r.status_code}")
    print(f"   Response: {r.json()['message']}\n")
    
    # Test 2: Verify Aadhaar
    print("2. Testing Aadhaar verification...")
    r = requests.post("http://localhost:8000/verify-aadhaar", json={
        "aadhaar_number": "123456789012",
        "otp": "1234"
    })
    print(f"   ✓ Status: {r.status_code}")
    print(f"   Farmer: {r.json()['farmer']['name']}\n")
    
    # Test 3: Fetch land records
    print("3. Testing land records...")
    r = requests.post("http://localhost:8000/fetch-land-records", json={
        "survey_number": "TN-2024-1234"
    })
    print(f"   ✓ Status: {r.status_code}")
    print(f"   Land area: {r.json()['land_area_acres']} acres\n")
    
    # Test 4: Match schemes
    print("4. Testing scheme matching...")
    r = requests.get("http://localhost:8000/match-schemes?score=70")
    print(f"   ✓ Status: {r.status_code}")
    print(f"   Schemes found: {r.json()['total_count']}\n")
    
    print("="*50)
    print("✅ ALL ENDPOINTS WORKING!")
    print("="*50)
    print("\n🌐 Visit http://localhost:8000/docs for API documentation")
    
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to server. Make sure it's running on http://localhost:8000")
except Exception as e:
    print(f"❌ Error: {e}")
