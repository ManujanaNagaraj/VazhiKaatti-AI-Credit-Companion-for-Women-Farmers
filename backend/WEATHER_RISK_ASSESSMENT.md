# Weather-Based Farming Risk Assessment - VazhiKaatti

## Overview
AI-powered weather risk assessment using free Open-Meteo API to help farmers make informed decisions and adjust credit scores based on environmental factors.

## Features

### 🌦️ Real-Time Weather Forecasting
- **7-day forecast** for all Tamil Nadu districts
- **Free API**: Open-Meteo (no API key required)
- **Data Points**: Precipitation, temperature (max/min)
- **Auto-refresh**: Updates on every API call

### 📊 Risk Assessment Categories
| Risk Level | Icon | Criteria | Credit Impact |
|------------|------|----------|---------------|
| **High** | 🔴 | Flood (>50mm rain) or Drought | -5 points |
| **Medium** | 🟡 | Heat stress (>38°C, 4+ days) | -2 points |
| **Low** | 🟢 | Favorable conditions | +3 points |

### 🌧️ Risk Types
1. **Flood (வெள்ளம்)**: Heavy rainfall >50mm/day or 2+ flood risk days
2. **Drought (வறட்சி)**: <5mm rain + >38°C temperature for 3+ days
3. **Heat Stress (வெப்ப அழுத்தம்)**: High temperature >38°C for 4+ days
4. **Normal (இயல்பு)**: Favorable weather conditions

## Backend Implementation

### File: `backend/weather_risk.py`

**Key Components:**

#### 1. WeatherRiskAssessor Class
```python
from weather_risk import get_weather_assessor

assessor = get_weather_assessor()
risk_data = assessor.assess_district_risk('coimbatore')
```

#### 2. District Coverage
**38 Tamil Nadu Districts Supported:**
- Coimbatore, Chennai, Madurai, Salem, Tiruchirappalli
- Tirunelveli, Erode, Vellore, Thanjavur, Dindigul
- Kanchipuram, Tiruppur, Karur, Namakkal, Pudukkottai
- And 23 more districts (see DISTRICT_COORDINATES in weather_risk.py)

#### 3. Risk Calculation Algorithm
```python
# Thresholds
FLOOD_RAIN_THRESHOLD = 50  # mm per day
DROUGHT_RAIN_THRESHOLD = 5  # mm per day
HIGH_TEMP_THRESHOLD = 38  # °C

# Risk Scoring
High Risk (Flood/Drought) → -5 credit score points
Medium Risk (Heat Stress) → -2 credit score points
Low Risk (Favorable) → +3 credit score points
Normal → 0 impact
```

### API Endpoints

#### 1. GET `/weather-risk`
Standalone weather risk assessment endpoint.

**Query Parameters:**
- `district`: Tamil Nadu district name (default: coimbatore)

**Example Request:**
```bash
curl "http://localhost:8000/weather-risk?district=coimbatore"
```

**Example Response:**
```json
{
  "risk_level": "Low",
  "risk_level_tamil": "குறைவு",
  "risk_type": "normal",
  "risk_type_tamil": "இயல்பு",
  "risk_score": 3,
  "advice": "நல்ல வானிலை நிலவுகிறது! விவசாயத்திற்கு சாதகமான சூழல்.",
  "advice_en": "Favorable weather conditions! Good environment for farming.",
  "impact_on_credit_score": 3,
  "impact_message": "நல்ல வானிலை காரணமாக +3 புள்ளிகள்",
  "impact_message_en": "+3 points for favorable weather",
  "forecast_summary": [
    {
      "date": "2026-03-07",
      "precipitation_mm": 2.3,
      "temp_max_c": 32.5,
      "temp_min_c": 22.1
    },
    // ... 6 more days
  ],
  "statistics": {
    "avg_rain_mm": 5.2,
    "max_rain_mm": 12.4,
    "avg_temp_max_c": 33.1,
    "max_temp_c": 35.2,
    "flood_risk_days": 0,
    "drought_risk_days": 0,
    "heat_stress_days": 0
  },
  "district": "Coimbatore"
}
```

#### 2. POST `/predict-score` (Enhanced)
Integrated weather risk into credit score prediction.

**New Behavior:**
- Fetches weather data for farmer's district
- Adjusts credit score based on weather risk:
  - High Risk → -5 points
  - Low Risk → +3 points
  - Medium Risk → -2 points
- Adds weather risk factor to score explanation

**Enhanced Response:**
```json
{
  "score": 78,  // Adjusted with weather impact
  "grade": "Good",
  "tamil_explanation": "உங்கள் கடன் மதிப்பெண்: 78/100 - நல்லது. ... நல்ல வானிலை காரணமாக +3 புள்ளிகள்.",
  "factors": [
    {
      "factor": "Weather Risk: normal (Low)",
      "impact": "Positive",
      "tamil": "வானிலை அபாயம்: இயல்பு (குறைவு)"
    },
    // ... other factors
  ]
}
```

## Frontend Implementation

### File: `frontend/src/pages/FarmerProfile.jsx`

**New Card Added:** "Weather Risk Assessment / வானிலை அபாய மதிப்பீடு"

**Features:**
1. **Risk Badge**: 🟢 Low / 🟡 Medium / 🔴 High
2. **Risk Type Display**: வெள்ளம் (Flood), வறட்சி (Drought), etc.
3. **Bilingual Advice**: Tamil + English farming recommendations
4. **Credit Score Impact**: Shows how weather affects credit score
5. **7-Day Forecast**: Visual summary with temp & precipitation
6. **Statistics Dashboard**: Avg rain, max temp, risk days

**State Management:**
```javascript
const [weatherRisk, setWeatherRisk] = useState(null);
const [fetchingWeather, setFetchingWeather] = useState(false);

// Fetches weather risk on component load
useEffect(() => {
  fetchWeatherRisk(farmerData.district);
}, []);
```

**Visual Design:**
- Risk-based color coding:
  - High Risk: Red background (#FFE5E5), red text (#C0392B)
  - Medium Risk: Yellow background (#FFF9E6), gold text (#D4A017)
  - Low Risk: Green background (#D4F1DD), green text (#2D6A4F)
- Icons: ⚠️ AlertTriangle (High), ☁️ Cloud (Medium), 🌧️ CloudRain (Low)
- Responsive grid layout for forecast cards

### Constants Updated

**File:** `frontend/src/constants.js`

```javascript
export const API_ENDPOINTS = {
  // ... existing endpoints
  WEATHER_RISK: `${API_BASE_URL}/weather-risk`,
};
```

## Open-Meteo API Integration

### API Details
- **URL**: https://api.open-meteo.com/v1/forecast
- **Cost**: Completely FREE, no API key required
- **Rate Limit**: 10,000 requests/day (generous for small apps)
- **Coverage**: Global weather data
- **Update Frequency**: Hourly updates

### Request Parameters
```javascript
{
  latitude: 11.0168,              // Coimbatore
  longitude: 76.9558,
  daily: "precipitation_sum,temperature_2m_max,temperature_2m_min",
  timezone: "Asia/Kolkata",
  forecast_days: 7
}
```

### Response Structure
```json
{
  "daily": {
    "time": ["2026-03-07", "2026-03-08", ...],
    "precipitation_sum": [2.3, 5.1, 0.0, ...],
    "temperature_2m_max": [32.5, 33.2, 34.1, ...],
    "temperature_2m_min": [22.1, 23.0, 21.8, ...]
  }
}
```

## Credit Score Impact Logic

### Integration in `/predict-score`

**Flow:**
1. Farmer submits profile data
2. ML model predicts base credit score
3. **Weather risk assessment runs:**
   - Fetches 7-day forecast for farmer's district
   - Calculates risk level (High/Medium/Low)
   - Computes risk score adjustment
4. **Score adjustment applied:**
   ```python
   original_score = 75
   weather_risk_score = +3  # Favorable weather
   final_score = 78
   ```
5. Weather risk factor added to explanation
6. Response includes weather impact message

**Example Scenario:**

| Base Score | Weather Condition | Risk | Adjustment | Final Score |
|------------|-------------------|------|------------|-------------|
| 75 | Heavy rain forecast | High | -5 | 70 |
| 75 | Heat stress expected | Medium | -2 | 73 |
| 75 | Favorable conditions | Low | +3 | 78 |
| 75 | Normal weather | Normal | 0 | 75 |

## Testing the Feature

### 1. Backend API Testing

**Test weather risk endpoint:**
```bash
# Coimbatore
curl "http://localhost:8000/weather-risk?district=coimbatore"

# Chennai
curl "http://localhost:8000/weather-risk?district=chennai"

# Madurai
curl "http://localhost:8000/weather-risk?district=madurai"
```

**Test credit score with weather integration:**
```bash
curl -X POST "http://localhost:8000/predict-score" \
  -H "Content-Type: application/json" \
  -d '{
    "years_of_farming": 5,
    "crop_type": 2,
    "annual_income_inr": 120000,
    "shg_member": true,
    "pm_kisan_registered": true,
    "has_bank_account": true,
    "existing_loans": 1,
    "land_area_acres": 2.5,
    "crop_insurance": true,
    "repayment_history": 3,
    "district": "coimbatore"
  }'
```

### 2. Frontend Testing

**Steps:**
1. Start backend: `cd backend && uvicorn main:app --reload --port 8000`
2. Start frontend: `cd frontend && npm start`
3. Navigate to Farmer Profile page
4. Scroll to **"Weather Risk Assessment"** card
5. Verify:
   - ✅ Risk badge shows correct color (🟢/🟡/🔴)
   - ✅ Tamil advice displays correctly
   - ✅ 7-day forecast grid renders
   - ✅ Credit score impact shows
   - ✅ Statistics display properly

### 3. Automated Test Script

**Python test script:**
```python
# backend/test_weather_risk.py
import requests

districts = ["coimbatore", "chennai", "madurai", "salem"]

for district in districts:
    response = requests.get(
        f"http://localhost:8000/weather-risk?district={district}"
    )
    data = response.json()
    print(f"{district.title()}: {data['risk_level']} - {data['risk_type']}")
```

## Risk Assessment Examples

### Scenario 1: Monsoon Season (High Rain)
```json
{
  "risk_level": "High",
  "risk_type": "flood",
  "advice": "கனமழை எச்சரிக்கை! வடிகால் வசதிகளை சரிபார்க்கவும்.",
  "advice_en": "Heavy rainfall alert! Check drainage systems.",
  "impact_on_credit_score": -5,
  "statistics": {
    "max_rain_mm": 85.2,
    "flood_risk_days": 3
  }
}
```

**Impact:** Credit score reduced by 5 points due to flood risk.

### Scenario 2: Summer (Heat Stress)
```json
{
  "risk_level": "Medium",
  "risk_type": "heat_stress",
  "advice": "அதிக வெப்பம் எதிர்பார்க்கப்படுகிறது. பயிர்களுக்கு தண்ணீர் கொடுக்கவும்.",
  "advice_en": "High temperatures expected. Ensure adequate watering of crops.",
  "impact_on_credit_score": -2,
  "statistics": {
    "max_temp_c": 41.5,
    "heat_stress_days": 5
  }
}
```

**Impact:** Credit score reduced by 2 points due to heat stress.

### Scenario 3: Ideal Conditions
```json
{
  "risk_level": "Low",
  "risk_type": "normal",
  "advice": "நல்ல வானிலை நிலவுகிறது! விவசாயத்திற்கு சாதகமான சூழல்.",
  "advice_en": "Favorable weather conditions! Good environment for farming.",
  "impact_on_credit_score": 3,
  "statistics": {
    "avg_rain_mm": 12.3,
    "avg_temp_max_c": 32.1
  }
}
```

**Impact:** Credit score boosted by 3 points for favorable weather.

## Benefits

### For Farmers
✅ **Proactive Risk Management**: 7-day weather forecast helps plan farming activities
✅ **Fair Credit Assessment**: Weather factors considered in creditworthiness
✅ **Bilingual Support**: Advice in Tamil and English
✅ **Actionable Insights**: Specific recommendations based on weather patterns

### For Lenders
✅ **Environmental Risk Factor**: Credit scores adjusted for weather-related risks
✅ **Data-Driven Decisions**: Real weather data from reliable API
✅ **Risk Mitigation**: Identify high-risk periods for lending

### For Platform
✅ **Free API**: No cost for weather data
✅ **38 Districts**: Complete Tamil Nadu coverage
✅ **Auto-Updates**: No manual data entry required
✅ **Scalable**: API handles high request volumes

## Future Enhancements

### Potential Improvements
1. **Historical Weather Analysis**: Compare with past 5-year patterns
2. **Crop-Specific Risks**: Tailor advice for rice, cotton, sugarcane, etc.
3. **SMS Alerts**: Send weather warnings via text message
4. **Insurance Integration**: Auto-suggest crop insurance during high-risk periods
5. **Multi-language**: Support Hindi, Telugu, Kannada
6. **Weather Visualization**: Charts for temperature and rainfall trends

### Advanced Features
- **Satellite Imagery**: Integrate NASA/ISRO satellite data
- **Soil Moisture API**: Add soil condition monitoring
- **Pest Warning**: Weather-based pest outbreak predictions
- **Yield Forecasting**: Estimate crop yield based on weather patterns
- **Government Alerts**: Integrate IMD (India Meteorological Department) warnings

## Troubleshooting

### "Weather data unavailable" error
**Cause:** Open-Meteo API request failed
**Solution:** 
1. Check internet connection
2. Verify district name is spelled correctly
3. API might be temporarily down - retry after 5 minutes

### Credit score not adjusting
**Cause:** Weather risk assessment not integrated properly
**Solution:**
1. Verify `from weather_risk import get_weather_assessor` in main.py
2. Check backend logs for weather API errors
3. Ensure district field is being passed in FarmerFeatures

### Frontend not displaying weather card
**Cause:** API endpoint not responding
**Solution:**
```bash
# Test endpoint directly
curl "http://localhost:8000/weather-risk?district=coimbatore"

# Check backend is running
cd backend && uvicorn main:app --reload --port 8000
```

### Wrong district coordinates
**Cause:** District name mismatch
**Solution:** Check `DISTRICT_COORDINATES` dict in weather_risk.py. District names must be lowercase.

## Dependencies

### Backend
```txt
requests  # HTTP requests to Open-Meteo API
```

### Frontend
```txt
axios         # API calls
lucide-react  # Weather icons (CloudRain, Cloud, AlertTriangle)
```

## Files Created/Modified

✅ **Created:**
- `backend/weather_risk.py` (300+ lines) - Weather risk assessment engine
- `backend/WEATHER_RISK_ASSESSMENT.md` (this file) - Documentation

✅ **Modified:**
- `backend/main.py` - Added weather_risk import, `/weather-risk` endpoint, integrated into `/predict-score`
- `frontend/src/pages/FarmerProfile.jsx` - Added WeatherRiskCard component
- `frontend/src/constants.js` - Added WEATHER_RISK endpoint

## API Security

**Current:** Public endpoint (no authentication)

**Production Recommendations:**
- Add rate limiting (max 100 requests/hour per farmer)
- Cache weather data (refresh every 6 hours)
- Require valid farmer session token
- Log all weather risk assessments for analytics

## License & Credits

**Built for:** VazhiKaatti (வழிகாட்டி) - AI Credit Companion for Tamil Nadu Women Farmers

**Weather Data:** Open-Meteo API (https://open-meteo.com)
- License: CC BY 4.0 (attribution required)
- Attribution: "Weather data provided by Open-Meteo.com"

**District Coordinates:** Based on Tamil Nadu government geographical data
