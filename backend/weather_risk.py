"""
VazhiKaatti - Weather-Based Farming Risk Assessment
Uses Open-Meteo API (free, no API key required) for weather forecasting
"""

import requests
from typing import Dict, List, Tuple
from datetime import datetime

# Tamil Nadu district coordinates (latitude, longitude)
DISTRICT_COORDINATES = {
    "coimbatore": (11.0168, 76.9558),
    "chennai": (13.0827, 80.2707),
    "madurai": (9.9252, 78.1198),
    "salem": (11.6643, 78.1460),
    "tiruchirappalli": (10.7905, 78.7047),
    "tirunelveli": (8.7139, 77.7567),
    "erode": (11.3410, 77.7172),
    "vellore": (12.9165, 79.1325),
    "thanjavur": (10.7870, 79.1378),
    "dindigul": (10.3624, 77.9519),
    "kanchipuram": (12.8342, 79.7036),
    "tiruppur": (11.1075, 77.3398),
    "karur": (10.9601, 78.0766),
    "namakkal": (11.2189, 78.1677),
    "pudukkottai": (10.3833, 78.8000),
    "ramanathapuram": (9.3647, 78.8378),
    "sivaganga": (9.8433, 78.4809),
    "theni": (10.0104, 77.4777),
    "thoothukudi": (8.7642, 78.1348),
    "tiruvallur": (13.1434, 79.9097),
    "tiruvannamalai": (12.2253, 79.0747),
    "villupuram": (11.9401, 79.4861),
    "virudhunagar": (9.5810, 77.9624),
    "cuddalore": (11.7480, 79.7714),
    "kanyakumari": (8.0883, 77.5385),
    "krishnagiri": (12.5186, 78.2137),
    "nagapattinam": (10.7672, 79.8449),
    "perambalur": (11.2324, 78.8798),
    "ariyalur": (11.1401, 79.0782),
    "nilgiris": (11.4102, 76.6950),
    "dharmapuri": (12.1211, 78.1582),
    "tirupattur": (12.4963, 78.5723),
    "ranipet": (12.9249, 79.3313),
    "kallakurichi": (11.7384, 78.9594),
    "chengalpattu": (12.6819, 79.9864),
    "tenkasi": (8.9604, 77.3152),
    "mayiladuthurai": (11.1023, 79.6531),
}

# Default to Coimbatore if district not found
DEFAULT_COORDINATES = (11.0168, 76.9558)

# Risk thresholds
FLOOD_RAIN_THRESHOLD = 50  # mm per day
DROUGHT_RAIN_THRESHOLD = 5  # mm per day
HIGH_TEMP_THRESHOLD = 38  # °C

# Tamil translations
RISK_LEVELS_TAMIL = {
    "Low": "குறைவு",
    "Medium": "நடுத்தர",
    "High": "அதிக"
}

RISK_TYPES_TAMIL = {
    "flood": "வெள்ளம்",
    "drought": "வறட்சி",
    "normal": "இயல்பு",
    "heat_stress": "வெப்ப அழுத்தம்"
}


class WeatherRiskAssessor:
    """Assess farming risks based on weather forecast"""
    
    def __init__(self):
        self.base_url = "https://api.open-meteo.com/v1/forecast"
    
    def get_coordinates(self, district: str) -> Tuple[float, float]:
        """Get coordinates for a district"""
        district_lower = district.lower().strip()
        return DISTRICT_COORDINATES.get(district_lower, DEFAULT_COORDINATES)
    
    def fetch_weather_forecast(self, district: str = "coimbatore") -> Dict:
        """
        Fetch 7-day weather forecast from Open-Meteo API
        
        Args:
            district: Tamil Nadu district name (default: coimbatore)
        
        Returns:
            Dictionary with daily weather data
        """
        lat, lon = self.get_coordinates(district)
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": "precipitation_sum,temperature_2m_max,temperature_2m_min",
            "timezone": "Asia/Kolkata",
            "forecast_days": 7
        }
        
        try:
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching weather data: {e}")
            return None
    
    def calculate_risk(self, weather_data: Dict) -> Dict:
        """
        Calculate farming risk based on weather forecast
        
        Args:
            weather_data: Weather forecast from Open-Meteo API
        
        Returns:
            Dictionary with risk assessment
        """
        if not weather_data or 'daily' not in weather_data:
            return self._default_risk_response()
        
        daily = weather_data['daily']
        precipitation = daily.get('precipitation_sum', [])
        temp_max = daily.get('temperature_2m_max', [])
        temp_min = daily.get('temperature_2m_min', [])
        dates = daily.get('time', [])
        
        if not precipitation or not temp_max:
            return self._default_risk_response()
        
        # Calculate average and max values
        avg_rain = sum(precipitation) / len(precipitation)
        max_rain = max(precipitation)
        avg_temp_max = sum(temp_max) / len(temp_max)
        max_temp = max(temp_max)
        
        # Count risk days
        flood_days = sum(1 for rain in precipitation if rain > FLOOD_RAIN_THRESHOLD)
        drought_days = sum(1 for i, rain in enumerate(precipitation) 
                          if rain < DROUGHT_RAIN_THRESHOLD and temp_max[i] > HIGH_TEMP_THRESHOLD)
        heat_stress_days = sum(1 for temp in temp_max if temp > HIGH_TEMP_THRESHOLD)
        
        # Determine risk level and type
        risk_level = "Low"
        risk_type = "normal"
        risk_score = 0
        
        if flood_days >= 2 or max_rain > FLOOD_RAIN_THRESHOLD * 1.5:
            risk_level = "High"
            risk_type = "flood"
            risk_score = -5  # Reduce credit score
            advice = "கனமழை எச்சரிக்கை! வடிகால் வசதிகளை சரிபார்க்கவும். பயிர்களை பாதுகாக்கவும்."
            advice_en = "Heavy rainfall alert! Check drainage systems. Protect crops from waterlogging."
            
        elif drought_days >= 3:
            risk_level = "High"
            risk_type = "drought"
            risk_score = -5  # Reduce credit score
            advice = "வறட்சி அபாயம்! நீர்ப்பாசன வசதிகளை தயார் செய்யவும். நீர் சேமிப்பு முக்கியம்."
            advice_en = "Drought risk! Prepare irrigation systems. Water conservation is critical."
            
        elif heat_stress_days >= 4:
            risk_level = "Medium"
            risk_type = "heat_stress"
            risk_score = -2  # Small reduction
            advice = "அதிக வெப்பம் எதிர்பார்க்கப்படுகிறது. பயிர்களுக்கு தண்ணீர் கொடுக்கவும்."
            advice_en = "High temperatures expected. Ensure adequate watering of crops."
            
        elif avg_rain > 10 and avg_temp_max < 35:
            risk_level = "Low"
            risk_type = "normal"
            risk_score = 3  # Boost credit score
            advice = "நல்ல வானிலை நிலவுகிறது! விவசாயத்திற்கு சாதகமான சூழல்."
            advice_en = "Favorable weather conditions! Good environment for farming."
            
        else:
            risk_level = "Low"
            risk_type = "normal"
            risk_score = 0  # No impact
            advice = "சாதாரண வானிலை நிலைமை. வழக்கமான விவசாய நடவடிக்கைகளை தொடரவும்."
            advice_en = "Normal weather conditions. Continue regular farming activities."
        
        # Calculate impact on credit score
        if risk_score > 0:
            impact_message = f"நல்ல வானிலை காரணமாக +{risk_score} புள்ளிகள்"
            impact_message_en = f"+{risk_score} points for favorable weather"
        elif risk_score < 0:
            impact_message = f"வானிலை அபாயம் காரணமாக {risk_score} புள்ளிகள்"
            impact_message_en = f"{risk_score} points due to weather risk"
        else:
            impact_message = "வானிலை தாக்கம் இல்லை"
            impact_message_en = "No weather impact"
        
        # Build forecast summary
        forecast_summary = []
        for i in range(min(7, len(dates))):
            forecast_summary.append({
                "date": dates[i],
                "precipitation_mm": round(precipitation[i], 1),
                "temp_max_c": round(temp_max[i], 1),
                "temp_min_c": round(temp_min[i], 1) if i < len(temp_min) else None
            })
        
        return {
            "risk_level": risk_level,
            "risk_level_tamil": RISK_LEVELS_TAMIL[risk_level],
            "risk_type": risk_type,
            "risk_type_tamil": RISK_TYPES_TAMIL[risk_type],
            "risk_score": risk_score,
            "advice": advice,
            "advice_en": advice_en,
            "impact_on_credit_score": risk_score,
            "impact_message": impact_message,
            "impact_message_en": impact_message_en,
            "forecast_summary": forecast_summary,
            "statistics": {
                "avg_rain_mm": round(avg_rain, 1),
                "max_rain_mm": round(max_rain, 1),
                "avg_temp_max_c": round(avg_temp_max, 1),
                "max_temp_c": round(max_temp, 1),
                "flood_risk_days": flood_days,
                "drought_risk_days": drought_days,
                "heat_stress_days": heat_stress_days
            }
        }
    
    def _default_risk_response(self) -> Dict:
        """Return default risk response when weather data unavailable"""
        return {
            "risk_level": "Low",
            "risk_level_tamil": "குறைவு",
            "risk_type": "normal",
            "risk_type_tamil": "இயல்பு",
            "risk_score": 0,
            "advice": "வானிலை தரவு கிடைக்கவில்லை. வழக்கமான விவசாய நடவடிக்கைகளை தொடரவும்.",
            "advice_en": "Weather data unavailable. Continue regular farming activities.",
            "impact_on_credit_score": 0,
            "impact_message": "வானிலை தாக்கம் இல்லை",
            "impact_message_en": "No weather impact",
            "forecast_summary": [],
            "statistics": {
                "avg_rain_mm": 0,
                "max_rain_mm": 0,
                "avg_temp_max_c": 0,
                "max_temp_c": 0,
                "flood_risk_days": 0,
                "drought_risk_days": 0,
                "heat_stress_days": 0
            }
        }
    
    def assess_district_risk(self, district: str = "coimbatore") -> Dict:
        """
        Complete risk assessment for a district
        
        Args:
            district: Tamil Nadu district name
        
        Returns:
            Full risk assessment with forecast and recommendations
        """
        weather_data = self.fetch_weather_forecast(district)
        risk_assessment = self.calculate_risk(weather_data)
        risk_assessment['district'] = district.title()
        return risk_assessment


# Global assessor instance
_assessor = None

def get_weather_assessor() -> WeatherRiskAssessor:
    """Get or create the global weather assessor instance"""
    global _assessor
    if _assessor is None:
        _assessor = WeatherRiskAssessor()
    return _assessor
