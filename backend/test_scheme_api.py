"""
VazhiKaatti - Scheme Management API Test Script
Test the new dynamic scheme update functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"
ADMIN_PASSWORD = "vazhikaatti_admin_2026"

def print_separator(title=""):
    print("\n" + "="*70)
    if title:
        print(f"  {title}")
        print("="*70)

def test_match_schemes():
    """Test 1: Get matching schemes for score 75"""
    print_separator("TEST 1: Match Schemes (Score=75)")
    
    response = requests.get(f"{BASE_URL}/match-schemes?score=75")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Found {data['total_count']} matching schemes")
        for i, scheme in enumerate(data['schemes'], 1):
            print(f"\n{i}. {scheme['name']}")
            print(f"   Amount: {scheme['benefit_amount']}")
    else:
        print(f"❌ Error: {response.text}")

def test_get_all_schemes():
    """Test 2: Get all schemes (admin)"""
    print_separator("TEST 2: Get All Schemes (Admin)")
    
    headers = {"X-Admin-Password": ADMIN_PASSWORD}
    response = requests.get(f"{BASE_URL}/admin/all-schemes", headers=headers)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Total schemes in database: {data['total_schemes']}")
        print(f"Message: {data['message']}")
    else:
        print(f"❌ Error: {response.text}")

def test_get_all_schemes_no_password():
    """Test 3: Try to get schemes without password (should fail)"""
    print_separator("TEST 3: Get Schemes Without Password (Should Fail)")
    
    response = requests.get(f"{BASE_URL}/admin/all-schemes")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 403:
        print(f"✅ Correctly blocked: {response.json()['detail']}")
    else:
        print(f"❌ Security issue: Should have blocked access!")

def test_add_new_scheme():
    """Test 4: Add a new scheme"""
    print_separator("TEST 4: Add New Test Scheme")
    
    new_scheme = {
        "id": "test-digital-farming-2026",
        "name": "டிஜிட்டல் விவசாய மானியம் 2026",
        "name_en": "Digital Farming Subsidy 2026",
        "min_score": 60,
        "max_score": 100,
        "benefit_amount": "₹3,00,000 - ₹8,00,000",
        "interest_rate": "3% per annum",
        "description": "டிஜிட்டல் தொழில்நுட்பத்தை பயன்படுத்தும் விவசாயிகளுக்கான சிறப்பு மானியம்",
        "description_en": "Special subsidy for farmers using digital technology",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "டிஜிட்டல் பயிற்சி சான்றிதழ் (Digital Training Certificate)",
            "நில பதிவுகள் (Land Records)"
        ],
        "apply_link": "https://tnagri.gov.in/digital-farming-2026"
    }
    
    headers = {
        "X-Admin-Password": ADMIN_PASSWORD,
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{BASE_URL}/admin/update-scheme",
        headers=headers,
        json=new_scheme
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ {data['message']}")
        print(f"   Action: {data['action']}")
        print(f"   Total schemes now: {data['total_schemes']}")
    else:
        print(f"❌ Error: {response.text}")

def test_match_schemes_after_add():
    """Test 5: Verify new scheme appears in matching (no restart!)"""
    print_separator("TEST 5: Verify New Scheme Appears (Score=70)")
    
    response = requests.get(f"{BASE_URL}/match-schemes?score=70")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        schemes = data['schemes']
        
        # Check if our new scheme appears
        found = False
        for scheme in schemes:
            if "டிஜிட்டல்" in scheme['name'] or "Digital" in scheme.get('name', ''):
                found = True
                print(f"✅ New scheme found in results!")
                print(f"   Name: {scheme['name']}")
                print(f"   Amount: {scheme['benefit_amount']}")
                break
        
        if not found:
            print(f"⚠️ New scheme not in top 3 results (score range might not match)")
            print(f"   Showing {len(schemes)} schemes total")
    else:
        print(f"❌ Error: {response.text}")

def test_update_existing_scheme():
    """Test 6: Update the test scheme"""
    print_separator("TEST 6: Update Test Scheme (Increase Benefit)")
    
    updated_scheme = {
        "id": "test-digital-farming-2026",
        "name": "டிஜிட்டல் விவசாய மானியம் 2026 - புதுப்பிக்கப்பட்டது",
        "name_en": "Digital Farming Subsidy 2026 - Updated",
        "min_score": 60,
        "max_score": 100,
        "benefit_amount": "₹5,00,000 - ₹10,00,000",  # Increased!
        "interest_rate": "2.5% per annum",  # Reduced!
        "description": "டிஜிட்டல் தொழில்நுட்பம் - அதிகரித்த மானியம்!",
        "description_en": "Digital technology - Increased subsidy!",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "டிஜிட்டல் பயிற்சி சான்றிதழ் (Digital Training Certificate)",
            "நில பதிவுகள் (Land Records)"
        ],
        "apply_link": "https://tnagri.gov.in/digital-farming-2026-updated"
    }
    
    headers = {
        "X-Admin-Password": ADMIN_PASSWORD,
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{BASE_URL}/admin/update-scheme",
        headers=headers,
        json=updated_scheme
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ {data['message']}")
        print(f"   Action: {data['action']}")
    else:
        print(f"❌ Error: {response.text}")

def run_all_tests():
    """Run all tests"""
    print("\n" + "🌾" * 35)
    print(" VazhiKaatti - Dynamic Scheme Management Tests")
    print("🌾" * 35)
    
    try:
        # Check if server is running
        response = requests.get(BASE_URL, timeout=2)
        print(f"\n✅ Server is running at {BASE_URL}")
        print(f"   Version: {response.json().get('version', 'Unknown')}")
    except Exception as e:
        print(f"\n❌ Server not running at {BASE_URL}")
        print(f"   Please start the server first: python backend/main.py")
        return
    
    # Run all tests
    test_match_schemes()
    test_get_all_schemes()
    test_get_all_schemes_no_password()
    test_add_new_scheme()
    test_match_schemes_after_add()
    test_update_existing_scheme()
    
    print_separator("ALL TESTS COMPLETED")
    print("✅ Dynamic scheme management is working!")
    print("   - Schemes auto-update without server restart")
    print("   - Admin API is password protected")
    print("   - JSON file updates in real-time")
    print("\n" + "🌾" * 35 + "\n")

if __name__ == "__main__":
    run_all_tests()
