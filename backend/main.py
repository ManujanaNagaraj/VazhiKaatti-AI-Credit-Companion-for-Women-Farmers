"""
VazhiKaatti - Main Backend Server
AI Credit Companion for Women Farmers in Tamil Nadu
"""

from fastapi import FastAPI, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import joblib
import os
import json
from typing import List, Optional, Dict, Any

from models import (
    AadhaarVerifyRequest,
    AadhaarVerifyResponse,
    FarmerProfile,
    LandRecordRequest,
    LandRecordResponse,
    FarmerFeatures,
    PredictScoreResponse,
    ScoreFactor,
    SchemeInfo,
    MatchSchemesResponse
)
from crop_predictor import get_predictor
from weather_risk import get_weather_assessor

# Admin password for scheme management (in production, use environment variable)
ADMIN_PASSWORD = "vazhikaatti_admin_2026"
SCHEMES_FILE_PATH = os.path.join("data", "schemes.json")


def load_schemes() -> List[Dict]:
    """Load schemes from JSON file"""
    try:
        if not os.path.exists(SCHEMES_FILE_PATH):
            return []
        with open(SCHEMES_FILE_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading schemes: {e}")
        return []


def save_schemes(schemes: List[Dict]) -> bool:
    """Save schemes to JSON file"""
    try:
        os.makedirs(os.path.dirname(SCHEMES_FILE_PATH), exist_ok=True)
        with open(SCHEMES_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(schemes, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving schemes: {e}")
        return False


def verify_admin_password(password: Optional[str]) -> bool:
    """Verify admin password"""
    return password == ADMIN_PASSWORD


def get_schemes_by_score(score: int, limit: int = 3) -> List[Dict]:
    """Get matching schemes based on credit score - reads from JSON file"""
    schemes = load_schemes()
    matching_schemes = [
        scheme for scheme in schemes
        if scheme.get('min_score', 0) <= score <= scheme.get('max_score', 100)
    ]
    
    # Sort by min_score descending and return top matches
    matching_schemes.sort(key=lambda x: x.get('min_score', 0), reverse=True)
    return matching_schemes[:limit]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    print("="*70)
    print("🌾 VazhiKaatti - AI Credit Companion for Women Farmers")
    print("="*70)
    print("🚀 Server starting...")
    print("📍 API Documentation: http://localhost:8000/docs")
    print("🌐 CORS enabled for: http://localhost:3000")
    print("✅ Ready to empower Tamil Nadu women farmers!")
    print("="*70)
    yield
    # Shutdown
    print("\n" + "="*70)
    print("👋 VazhiKaatti server shutting down...")
    print("="*70)


# Initialize FastAPI app with lifespan
app = FastAPI(
    title="VazhiKaatti API",
    description="AI Credit Companion for Women Farmers in Tamil Nadu",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration - Allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "VazhiKaatti API - Empowering Women Farmers in Tamil Nadu",
        "version": "2.0.0",
        "status": "active",
        "endpoints": {
            "verify_aadhaar": "/verify-aadhaar",
            "fetch_land_records": "/fetch-land-records",
            "predict_score": "/predict-score",
            "match_schemes": "/match-schemes (auto-updates from JSON)",
            "admin_get_schemes": "/admin/all-schemes (requires password)",
            "admin_update_scheme": "/admin/update-scheme (requires password)"
        },
        "admin_info": {
            "password_header": "X-Admin-Password",
            "schemes_file": "data/schemes.json",
            "note": "Schemes auto-update without server restart!"
        }
    }


@app.post("/verify-aadhaar", response_model=AadhaarVerifyResponse)
async def verify_aadhaar(request: AadhaarVerifyRequest):
    """
    Verify Aadhaar with OTP
    
    Mock verification:
    - OTP "1234" returns success with farmer profile
    - Any other OTP returns 400 error
    """
    if request.otp == "1234":
        # Mock farmer profile data
        farmer = FarmerProfile(
            name="லட்சுமி குமரி",
            age=35,
            village="திருச்சி கிராமம்",
            district="திருச்சிராப்பள்ளி",
            photo_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Laxmi"
        )
        
        return AadhaarVerifyResponse(
            success=True,
            message="ஆதார் சரிபார்ப்பு வெற்றிகரமாக முடிந்தது (Aadhaar verified successfully)",
            farmer=farmer
        )
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP - தவறான OTP"
        )


@app.post("/fetch-land-records", response_model=LandRecordResponse)
async def fetch_land_records(request: LandRecordRequest):
    """
    Fetch land records by survey number
    
    Returns mock land record data
    """
    # Mock land record data based on survey number
    survey_num = request.survey_number
    
    # Generate deterministic mock data based on survey number
    land_records = {
        "land_area_acres": 2.5 + (len(survey_num) % 5),
        "crop_type": ["நெல் (Rice)", "காய்கறிகள் (Vegetables)", "பழங்கள் (Fruits)", "கலப்பு (Mixed)"][len(survey_num) % 4],
        "ownership_name": "லட்சுமி குமரி",
        "district": "திருச்சிராப்பள்ளி",
        "patta_number": f"TN-{survey_num}-2024"
    }
    
    return LandRecordResponse(**land_records)


@app.post("/predict-score", response_model=PredictScoreResponse)
async def predict_score(features: FarmerFeatures):
    """
    Predict credit score using ML model
    
    Loads the trained model and returns:
    - Credit score (0-100)
    - Grade classification
    - Tamil explanation
    - Top 3 contributing factors
    """
    try:
        # Load the trained model
        model_path = os.path.join("models", "credit_model.pkl")
        scaler_path = os.path.join("models", "scaler.pkl")
        
        if not os.path.exists(model_path):
            raise HTTPException(
                status_code=500,
                detail="Model file not found. Please train the model first."
            )
        
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        # Prepare features in correct order
        feature_names = [
            'years_of_farming', 'crop_type', 'annual_income_inr',
            'shg_member', 'pm_kisan_registered', 'has_bank_account',
            'existing_loans', 'land_area_acres', 'crop_insurance',
            'repayment_history'
        ]
        
        # Convert features to list
        feature_values = [
            features.years_of_farming,
            features.crop_type,
            features.annual_income_inr,
            int(features.shg_member),
            int(features.pm_kisan_registered),
            int(features.has_bank_account),
            features.existing_loans,
            features.land_area_acres,
            int(features.crop_insurance),
            features.repayment_history
        ]
        
        # Scale features
        scaled_features = scaler.transform([feature_values])
        
        # Predict score
        score = int(model.predict(scaled_features)[0])
        score = max(0, min(100, score))  # Clamp to 0-100
        
        # Get weather risk assessment (use district from farmer data if available)
        district = getattr(features, 'district', 'coimbatore')
        weather_assessor = get_weather_assessor()
        weather_risk = weather_assessor.assess_district_risk(district)
        
        # Apply weather risk adjustment to score
        original_score = score
        score = score + weather_risk['risk_score']
        score = max(0, min(100, score))  # Clamp to 0-100
        
        # Determine grade
        if score >= 81:
            grade = "Excellent"
            tamil_grade = "சிறந்தது"
        elif score >= 61:
            grade = "Good"
            tamil_grade = "நல்லது"
        elif score >= 41:
            grade = "Fair"
            tamil_grade = "சராசரி"
        else:
            grade = "Poor"
            tamil_grade = "மேம்படுத்த வேண்டும்"
        
        # Tamil explanation with weather risk
        weather_impact_text = ""
        if weather_risk['risk_score'] != 0:
            weather_impact_text = f" {weather_risk['impact_message']}."
        tamil_explanation = f"உங்கள் கடன் மதிப்பெண்: {score}/100 - {tamil_grade}. இந்த மதிப்பெண் உங்கள் விவசாய அனுபவம், வருமானம் மற்றும் நிதி நடத்தையை அடிப்படையாகக் கொண்டது.{weather_impact_text}"
        
        # Get feature importance and determine top factors
        feature_importance = model.feature_importances_
        importance_dict = dict(zip(feature_names, feature_importance))
        sorted_features = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
        
        # Generate factors (including weather risk)
        factors = []
        
        # Weather Risk Factor (if significant impact)
        if weather_risk['risk_score'] != 0:
            impact_type = "Positive" if weather_risk['risk_score'] > 0 else "Negative"
            weather_factor_text = f"வானிலை அபாயம்: {weather_risk['risk_type_tamil']} ({weather_risk['risk_level_tamil']})"
            factors.append(ScoreFactor(
                factor=f"Weather Risk: {weather_risk['risk_type'].title()} ({weather_risk['risk_level']})",
                impact=impact_type,
                tamil=weather_factor_text
            ))
        
        # Factor 1: Repayment History
        repayment_labels = ["மோசம்", "சராசரி", "நல்லது", "சிறந்தது"]
        if features.repayment_history >= 2:
            factors.append(ScoreFactor(
                factor="Excellent Repayment History",
                impact="Positive",
                tamil=f"நல்ல திருப்பிச் செலுத்தும் பதிவு ({repayment_labels[features.repayment_history]})"
            ))
        else:
            factors.append(ScoreFactor(
                factor="Repayment History Needs Improvement",
                impact="Negative",
                tamil=f"திருப்பிச் செலுத்தும் பதிவை மேம்படுத்த வேண்டும் ({repayment_labels[features.repayment_history]})"
            ))
        
        # Factor 2: SHG Membership
        if features.shg_member:
            factors.append(ScoreFactor(
                factor="SHG Member",
                impact="Positive",
                tamil="சுய உதவி குழு உறுப்பினர் - நல்ல தாக்கம்"
            ))
        else:
            factors.append(ScoreFactor(
                factor="Not an SHG Member",
                impact="Neutral",
                tamil="SHG உறுப்பினர் இல்லை - சேர பரிந்துரைக்கப்படுகிறது"
            ))
        
        # Factor 3: Annual Income
        if features.annual_income_inr >= 150000:
            factors.append(ScoreFactor(
                factor="Good Annual Income",
                impact="Positive",
                tamil=f"நல்ல ஆண்டு வருமானம் (₹{features.annual_income_inr:,.0f})"
            ))
        elif features.annual_income_inr >= 75000:
            factors.append(ScoreFactor(
                factor="Moderate Annual Income",
                impact="Neutral",
                tamil=f"சராசரி ஆண்டு வருமானம் (₹{features.annual_income_inr:,.0f})"
            ))
        else:
            factors.append(ScoreFactor(
                factor="Low Annual Income",
                impact="Negative",
                tamil=f"குறைந்த ஆண்டு வருமானம் (₹{features.annual_income_inr:,.0f})"
            ))
        
        return PredictScoreResponse(
            score=score,
            grade=grade,
            tamil_explanation=tamil_explanation,
            factors=factors
        )
        
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=500,
            detail="Model files not found. Please train the model using train_model.py"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error predicting score: {str(e)}"
        )


@app.get("/match-schemes", response_model=MatchSchemesResponse)
async def match_schemes(score: int = Query(..., ge=0, le=100, description="Credit score (0-100)")):
    """
    Get matching Tamil Nadu government schemes based on credit score
    
    Dynamically reads from schemes.json file - schemes updated without server restart!
    
    Returns top 3 matching schemes with:
    - Scheme name (in Tamil)
    - Benefit amount
    - Description
    - Required documents
    - Apply link
    """
    try:
        # Get matching schemes - reads fresh from JSON file every time
        matching_schemes = get_schemes_by_score(score, limit=3)
        
        # Format schemes for API response
        formatted_schemes = [
            SchemeInfo(
                name=scheme.get('name', ''),
                benefit_amount=scheme.get('benefit_amount', ''),
                description=scheme.get('description', ''),
                required_documents=scheme.get('required_documents', []),
                apply_link=scheme.get('apply_link', '')
            )
            for scheme in matching_schemes
        ]
        
        return MatchSchemesResponse(
            schemes=formatted_schemes,
            total_count=len(formatted_schemes)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching schemes: {str(e)}"
        )


@app.get("/admin/all-schemes")
async def get_all_schemes(x_admin_password: Optional[str] = Header(None)):
    """
    Get all schemes from schemes.json
    
    Protected endpoint - requires admin password in header
    Header: X-Admin-Password: vazhikaatti_admin_2026
    
    Returns:
    - All schemes with complete details
    - Total count
    """
    # Verify admin password
    if not verify_admin_password(x_admin_password):
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Invalid admin password. Use header 'X-Admin-Password'"
        )
    
    try:
        schemes = load_schemes()
        return {
            "success": True,
            "total_schemes": len(schemes),
            "schemes": schemes,
            "message": f"Successfully loaded {len(schemes)} schemes"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading schemes: {str(e)}"
        )


@app.post("/admin/update-scheme")
async def update_scheme(
    scheme_data: Dict[Any, Any],
    x_admin_password: Optional[str] = Header(None)
):
    """
    Add or update a scheme in schemes.json
    
    Protected endpoint - requires admin password in header
    Header: X-Admin-Password: vazhikaatti_admin_2026
    
    Body: Complete scheme object with fields:
    - id: Unique scheme identifier
    - name: Tamil name
    - name_en: English name
    - min_score: Minimum credit score
    - max_score: Maximum credit score
    - benefit_amount: Benefit amount string
    - interest_rate: Interest rate
    - description: Tamil description
    - description_en: English description
    - required_documents: List of documents
    - apply_link: Application URL
    
    Auto-updates schemes.json - no server restart needed!
    """
    # Verify admin password
    if not verify_admin_password(x_admin_password):
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Invalid admin password. Use header 'X-Admin-Password'"
        )
    
    # Validate required fields
    required_fields = ['id', 'name', 'min_score', 'max_score', 'benefit_amount', 'description']
    missing_fields = [field for field in required_fields if field not in scheme_data]
    
    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_fields)}"
        )
    
    try:
        # Load existing schemes
        schemes = load_schemes()
        
        # Check if scheme with this ID already exists
        scheme_id = scheme_data['id']
        existing_index = None
        for i, scheme in enumerate(schemes):
            if scheme.get('id') == scheme_id:
                existing_index = i
                break
        
        if existing_index is not None:
            # Update existing scheme
            schemes[existing_index] = scheme_data
            action = "updated"
        else:
            # Add new scheme
            schemes.append(scheme_data)
            action = "added"
        
        # Save to file
        if save_schemes(schemes):
            return {
                "success": True,
                "action": action,
                "scheme_id": scheme_id,
                "message": f"Scheme '{scheme_data.get('name', scheme_id)}' {action} successfully",
                "total_schemes": len(schemes)
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to save schemes to file"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating scheme: {str(e)}"
        )


@app.get("/weather-risk")
async def get_weather_risk(
    district: str = Query("coimbatore", description="Tamil Nadu district name")
):
    """
    Get 7-day weather forecast and farming risk assessment
    
    Uses Open-Meteo API (free, no API key required)
    
    Returns:
    - Risk level (Low/Medium/High)
    - Risk type (flood/drought/heat_stress/normal)
    - 7-day forecast summary
    - Farming advice in Tamil & English
    - Impact on credit score
    
    Example: /weather-risk?district=coimbatore
    """
    try:
        assessor = get_weather_assessor()
        risk_data = assessor.assess_district_risk(district)
        return risk_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching weather risk: {str(e)}"
        )


@app.get("/crop-price-prediction")
async def predict_crop_price(
    crop: str = Query(..., description="Crop type (rice, banana, sugarcane, cotton, groundnut, turmeric, tomato)"),
    season: str = Query(..., description="Season (kharif, rabi, summer)"),
    rainfall: float = Query(..., description="Expected rainfall in mm"),
    market_demand: float = Query(6.0, description="Market demand (1-10 scale, default 6)")
):
    """
    Predict next month's crop price using AI
    
    Returns:
    - Current average price in Tamil Nadu
    - Predicted next month price
    - Price trend (up/down/stable)
    - Confidence percentage
    - Best time to sell recommendation
    
    Example: /crop-price-prediction?crop=rice&season=kharif&rainfall=850
    """
    try:
        predictor = get_predictor()
        result = predictor.predict_price(
            crop_type=crop,
            season=season,
            rainfall=rainfall,
            market_demand=market_demand
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error predicting crop price: {str(e)}"
        )


if __name__ == "__main__":
    print("\n" + "="*70)
    print("Starting VazhiKaatti Backend Server...")
    print("="*70 + "\n")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
