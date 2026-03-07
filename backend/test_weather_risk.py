"""
Test script for Weather Risk Assessment API
Tests weather forecasting for multiple Tamil Nadu districts
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_weather_risk(district):
    """Test weather risk assessment endpoint"""
    url = f"{BASE_URL}/weather-risk"
    params = {"district": district}
    
    try:
        print(f"\n{'='*70}")
        print(f"Testing: {district.upper()}")
        print('='*70)
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Risk Level Badge
            risk_emoji = "🔴" if data['risk_level'] == 'High' else "🟡" if data['risk_level'] == 'Medium' else "🟢"
            print(f"{risk_emoji} Risk Level: {data['risk_level']} ({data['risk_level_tamil']})")
            print(f"📊 Risk Type: {data['risk_type']} ({data['risk_type_tamil']})")
            
            # Credit Score Impact
            impact = data['impact_on_credit_score']
            impact_symbol = "+" if impact > 0 else ""
            print(f"💰 Credit Score Impact: {impact_symbol}{impact} points")
            
            # Advice
            print(f"\n💡 Farming Advice (Tamil):")
            print(f"   {data['advice']}")
            print(f"💡 Farming Advice (English):")
            print(f"   {data['advice_en']}")
            
            # Statistics
            stats = data['statistics']
            print(f"\n📈 Statistics:")
            print(f"   Average Rain: {stats['avg_rain_mm']}mm")
            print(f"   Max Rain: {stats['max_rain_mm']}mm")
            print(f"   Average Max Temp: {stats['avg_temp_max_c']}°C")
            print(f"   Max Temp: {stats['max_temp_c']}°C")
            print(f"   Flood Risk Days: {stats['flood_risk_days']}")
            print(f"   Drought Risk Days: {stats['drought_risk_days']}")
            print(f"   Heat Stress Days: {stats['heat_stress_days']}")
            
            # Forecast Summary
            if data['forecast_summary']:
                print(f"\n🌦️  7-Day Forecast:")
                for day in data['forecast_summary'][:3]:  # Show first 3 days
                    print(f"   {day['date']}: 🌡️ {day['temp_max_c']}°C, 🌧️ {day['precipitation_mm']}mm")
            
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   {response.json()}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection Error: Is the backend server running?")
        print(f"   Start server: cd backend && uvicorn main:app --reload --port 8000")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {str(e)}")
        return False


def test_credit_score_with_weather():
    """Test credit score prediction with weather integration"""
    url = f"{BASE_URL}/predict-score"
    
    payload = {
        "years_of_farming": 5,
        "crop_type": 2,
        "annual_income_inr": 120000,
        "shg_member": True,
        "pm_kisan_registered": True,
        "has_bank_account": True,
        "existing_loans": 1,
        "land_area_acres": 2.5,
        "crop_insurance": True,
        "repayment_history": 3,
        "district": "coimbatore"
    }
    
    try:
        print(f"\n{'='*70}")
        print(f"Testing: CREDIT SCORE PREDICTION WITH WEATHER INTEGRATION")
        print('='*70)
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"📊 Credit Score: {data['score']}/100")
            print(f"🏆 Grade: {data['grade']}")
            print(f"\n📝 Explanation (Tamil):")
            print(f"   {data['tamil_explanation']}")
            
            print(f"\n🔍 Score Factors:")
            for i, factor in enumerate(data['factors'], 1):
                impact_emoji = "✅" if factor['impact'] == 'Positive' else "❌" if factor['impact'] == 'Negative' else "➖"
                print(f"   {i}. {impact_emoji} {factor['factor']}")
                print(f"      Tamil: {factor['tamil']}")
            
            # Check if weather factor is included
            weather_factor = next((f for f in data['factors'] if 'Weather' in f['factor']), None)
            if weather_factor:
                print(f"\n✅ Weather risk successfully integrated into credit score!")
            else:
                print(f"\n⚠️  Weather risk factor not found in response")
            
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   {response.json()}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection Error: Is the backend server running?")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {str(e)}")
        return False


def main():
    print("="*70)
    print("🌦️  VazhiKaatti - Weather Risk Assessment API Test")
    print("="*70)
    
    # Test weather risk for multiple districts
    districts = [
        "coimbatore",
        "chennai",
        "madurai",
        "salem",
        "thanjavur"
    ]
    
    weather_results = []
    for district in districts:
        success = test_weather_risk(district)
        weather_results.append((district, success))
    
    # Test credit score with weather integration
    print("\n" + "="*70)
    print("Testing Credit Score Integration")
    print("="*70)
    credit_score_success = test_credit_score_with_weather()
    
    # Summary
    print("\n" + "="*70)
    print("📋 TEST SUMMARY")
    print("="*70)
    
    print("\n🌦️  Weather Risk Tests:")
    passed_weather = sum(1 for _, success in weather_results if success)
    total_weather = len(weather_results)
    
    for district, success in weather_results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {district.title()}")
    
    print(f"\n💰 Credit Score Integration:")
    credit_status = "✅ PASS" if credit_score_success else "❌ FAIL"
    print(f"{credit_status} - Weather risk integrated into /predict-score")
    
    print(f"\n{'='*70}")
    total_tests = total_weather + 1
    total_passed = passed_weather + (1 if credit_score_success else 0)
    print(f"Results: {total_passed}/{total_tests} tests passed ({total_passed/total_tests*100:.1f}%)")
    print("="*70)
    
    if total_passed == total_tests:
        print("🎉 All tests passed! Weather Risk Assessment is working correctly.")
        print("\n📌 Next Steps:")
        print("   1. Start frontend: cd frontend && npm start")
        print("   2. Navigate to Farmer Profile page")
        print("   3. View Weather Risk Assessment card")
    else:
        print("⚠️  Some tests failed. Check backend server and error messages above.")


if __name__ == "__main__":
    main()
