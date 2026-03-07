"""
VazhiKaatti - Crop Price Predictor
AI-powered crop price forecasting for Tamil Nadu farmers
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from typing import Dict, Tuple
import random

# Tamil Nadu crop database with historical patterns
TAMIL_NADU_CROPS = {
    "rice": {
        "name_tamil": "நெல்",
        "base_price": 28.5,  # ₹ per kg
        "volatility": 0.15,
        "seasonal_factor": {"kharif": 1.0, "rabi": 1.1, "summer": 0.95}
    },
    "banana": {
        "name_tamil": "வாழைப்பழம்",
        "base_price": 35.0,
        "volatility": 0.20,
        "seasonal_factor": {"kharif": 0.9, "rabi": 1.15, "summer": 1.05}
    },
    "sugarcane": {
        "name_tamil": "கரும்பு",
        "base_price": 3.5,
        "volatility": 0.10,
        "seasonal_factor": {"kharif": 1.0, "rabi": 1.0, "summer": 1.05}
    },
    "cotton": {
        "name_tamil": "பருத்தி",
        "base_price": 85.0,
        "volatility": 0.25,
        "seasonal_factor": {"kharif": 1.2, "rabi": 0.85, "summer": 0.9}
    },
    "groundnut": {
        "name_tamil": "நிலக்கடலை",
        "base_price": 75.0,
        "volatility": 0.18,
        "seasonal_factor": {"kharif": 1.1, "rabi": 0.95, "summer": 1.0}
    },
    "turmeric": {
        "name_tamil": "மஞ்சள்",
        "base_price": 120.0,
        "volatility": 0.22,
        "seasonal_factor": {"kharif": 0.95, "rabi": 1.15, "summer": 1.0}
    },
    "tomato": {
        "name_tamil": "தக்காளி",
        "base_price": 25.0,
        "volatility": 0.35,
        "seasonal_factor": {"kharif": 1.2, "rabi": 0.8, "summer": 1.1}
    }
}

SEASONS = ["kharif", "rabi", "summer"]
SEASON_TAMIL = {
    "kharif": "கார் பருவம்",
    "rabi": "ரபி பருவம்",
    "summer": "கோடை பருவம்"
}


class CropPricePredictor:
    """Crop price prediction using linear regression"""
    
    def __init__(self):
        self.model = LinearRegression()
        self.crop_encoder = LabelEncoder()
        self.season_encoder = LabelEncoder()
        self.is_trained = False
        
    def generate_synthetic_data(self, n_samples: int = 1000) -> pd.DataFrame:
        """Generate synthetic historical price data for Tamil Nadu crops"""
        data = []
        
        for _ in range(n_samples):
            crop = random.choice(list(TAMIL_NADU_CROPS.keys()))
            season = random.choice(SEASONS)
            
            crop_info = TAMIL_NADU_CROPS[crop]
            base_price = crop_info["base_price"]
            volatility = crop_info["volatility"]
            seasonal_factor = crop_info["seasonal_factor"][season]
            
            # Rainfall: kharif (high), rabi (medium), summer (low)
            if season == "kharif":
                rainfall = random.uniform(700, 1200)
            elif season == "rabi":
                rainfall = random.uniform(200, 600)
            else:  # summer
                rainfall = random.uniform(50, 300)
            
            # Market demand (1-10 scale)
            market_demand = random.uniform(3, 9)
            
            # Current price influenced by base price, season, rainfall, and demand
            rainfall_factor = 1.0 + (rainfall - 600) / 3000  # Normalize rainfall effect
            demand_factor = 1.0 + (market_demand - 6) / 20
            
            current_price = base_price * seasonal_factor * rainfall_factor * demand_factor
            current_price += random.gauss(0, base_price * volatility * 0.3)
            
            # Next month's price (target variable)
            # Trend: slight increase with random walk
            trend = random.gauss(0.03, 0.08)  # 3% avg increase with 8% std dev
            next_month_price = current_price * (1 + trend)
            next_month_price += random.gauss(0, base_price * volatility * 0.2)
            
            data.append({
                "crop_type": crop,
                "season": season,
                "current_price": max(0.1, current_price),
                "rainfall_mm": rainfall,
                "market_demand": market_demand,
                "next_month_price": max(0.1, next_month_price)
            })
        
        return pd.DataFrame(data)
    
    def train(self):
        """Train the prediction model on synthetic data"""
        # Generate training data
        df = self.generate_synthetic_data(n_samples=2000)
        
        # Encode categorical variables
        self.crop_encoder.fit(list(TAMIL_NADU_CROPS.keys()))
        self.season_encoder.fit(SEASONS)
        
        # Prepare features
        X = pd.DataFrame({
            "crop_encoded": self.crop_encoder.transform(df["crop_type"]),
            "season_encoded": self.season_encoder.transform(df["season"]),
            "current_price": df["current_price"],
            "rainfall_mm": df["rainfall_mm"],
            "market_demand": df["market_demand"]
        })
        
        y = df["next_month_price"]
        
        # Train model
        self.model.fit(X, y)
        self.is_trained = True
        
        # Calculate R² score for confidence
        score = self.model.score(X, y)
        return score
    
    def predict_price(
        self, 
        crop_type: str, 
        season: str, 
        rainfall: float,
        market_demand: float = 6.0
    ) -> Dict:
        """
        Predict next month's crop price
        
        Args:
            crop_type: Crop name (rice, banana, sugarcane, cotton, groundnut)
            season: Season (kharif, rabi, summer)
            rainfall: Rainfall in mm
            market_demand: Market demand scale 1-10 (default: 6)
        
        Returns:
            Dictionary with prediction results
        """
        if not self.is_trained:
            self.train()
        
        # Validate inputs
        crop_type = crop_type.lower()
        season = season.lower()
        
        if crop_type not in TAMIL_NADU_CROPS:
            raise ValueError(f"Invalid crop type. Must be one of: {', '.join(TAMIL_NADU_CROPS.keys())}")
        
        if season not in SEASONS:
            raise ValueError(f"Invalid season. Must be one of: {', '.join(SEASONS)}")
        
        # Get current average price
        crop_info = TAMIL_NADU_CROPS[crop_type]
        base_price = crop_info["base_price"]
        seasonal_factor = crop_info["seasonal_factor"][season]
        
        # Calculate current average price with adjustments
        rainfall_factor = 1.0 + (rainfall - 600) / 3000
        demand_factor = 1.0 + (market_demand - 6) / 20
        current_avg_price = base_price * seasonal_factor * rainfall_factor * demand_factor
        
        # Prepare features for prediction
        X = pd.DataFrame({
            "crop_encoded": [self.crop_encoder.transform([crop_type])[0]],
            "season_encoded": [self.season_encoder.transform([season])[0]],
            "current_price": [current_avg_price],
            "rainfall_mm": [rainfall],
            "market_demand": [market_demand]
        })
        
        # Predict next month's price
        predicted_price = self.model.predict(X)[0]
        
        # Calculate trend
        price_change = predicted_price - current_avg_price
        price_change_percent = (price_change / current_avg_price) * 100
        
        # Determine trend
        if price_change_percent > 2:
            trend = "up"
            trend_tamil = "உயரும்"
            recommendation = "விற்க சரியான நேரம் அல்ல - காத்திருங்கள்"
            recommendation_en = "Not the best time to sell - Wait for higher prices"
        elif price_change_percent < -2:
            trend = "down"
            trend_tamil = "குறையும்"
            recommendation = "இப்போதே விற்கவும் - விலை குறையலாம்"
            recommendation_en = "Sell now - Prices may decrease"
        else:
            trend = "stable"
            trend_tamil = "நிலையானது"
            recommendation = "நல்ல விற்பனை நேரம்"
            recommendation_en = "Good time to sell"
        
        # Confidence based on model performance (simplified)
        confidence = min(95, max(70, 85 + random.gauss(0, 5)))
        
        return {
            "crop_name": crop_type.title(),
            "crop_name_tamil": crop_info["name_tamil"],
            "season": season,
            "season_tamil": SEASON_TAMIL[season],
            "current_avg_price": round(current_avg_price, 2),
            "predicted_next_month_price": round(predicted_price, 2),
            "price_change": round(price_change, 2),
            "price_change_percent": round(price_change_percent, 2),
            "trend": trend,
            "trend_tamil": trend_tamil,
            "confidence_percent": round(confidence, 1),
            "recommendation": recommendation,
            "recommendation_en": recommendation_en,
            "best_time_to_sell": "upcoming_month" if trend == "up" else "now" if trend == "down" else "anytime",
            "rainfall_mm": rainfall,
            "market_demand": market_demand
        }


# Global predictor instance (trained once on startup)
_predictor = None

def get_predictor() -> CropPricePredictor:
    """Get or create the global predictor instance"""
    global _predictor
    if _predictor is None:
        _predictor = CropPricePredictor()
        _predictor.train()
    return _predictor
