"""
Test script for Crop Price Prediction API
Tests all 7 supported crops across different seasons
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_crop_prediction(crop, season, rainfall):
    """Test crop price prediction endpoint"""
    url = f"{BASE_URL}/crop-price-prediction"
    params = {
        "crop": crop,
        "season": season,
        "rainfall": rainfall
    }
    
    try:
        print(f"\n{'='*70}")
        print(f"Testing: {crop.upper()} | Season: {season} | Rainfall: {rainfall}mm")
        print('='*70)
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"✅ Crop: {data['crop_name']} ({data['crop_name_tamil']})")
            print(f"📅 Season: {data['season']} ({data['season_tamil']})")
            print(f"💰 Current Avg Price: ₹{data['current_avg_price']}/kg")
            print(f"🔮 Predicted Price (Next Month): ₹{data['predicted_next_month_price']}/kg")
            
            # Trend indicator
            trend_emoji = "📈" if data['trend'] == 'up' else "📉" if data['trend'] == 'down' else "➡️"
            print(f"{trend_emoji} Trend: {data['trend'].upper()} ({data['price_change_percent']:+.2f}%)")
            
            print(f"📊 Confidence: {data['confidence_percent']}%")
            print(f"\n💡 Recommendation (Tamil):")
            print(f"   {data['recommendation']}")
            print(f"💡 Recommendation (English):")
            print(f"   {data['recommendation_en']}")
            print(f"\n⏰ Best Time to Sell: {data['best_time_to_sell']}")
            
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


def main():
    print("="*70)
    print("🌾 VazhiKaatti - Crop Price Prediction API Test")
    print("="*70)
    
    # Test cases: (crop, season, rainfall)
    test_cases = [
        ("rice", "kharif", 850),
        ("banana", "summer", 150),
        ("sugarcane", "rabi", 400),
        ("cotton", "kharif", 950),
        ("groundnut", "rabi", 350),
        ("turmeric", "kharif", 800),
        ("tomato", "summer", 200),
    ]
    
    results = []
    for crop, season, rainfall in test_cases:
        success = test_crop_prediction(crop, season, rainfall)
        results.append((crop, success))
    
    # Summary
    print("\n" + "="*70)
    print("📋 TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for crop, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {crop.title()}")
    
    print(f"\n{'='*70}")
    print(f"Results: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    print("="*70)
    
    if passed == total:
        print("🎉 All tests passed! Crop Price Prediction API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check backend server and error messages above.")


if __name__ == "__main__":
    main()
