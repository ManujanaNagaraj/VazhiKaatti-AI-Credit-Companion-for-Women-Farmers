"""
VazhiKaatti - Main Backend Server
AI Credit Companion for Women Farmers in Tamil Nadu
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import joblib
import os
from typing import List

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
from schemes import get_schemes_by_score, format_scheme_for_api

# Initialize FastAPI app
app = FastAPI(
    title="VazhiKaatti API",
    description="AI Credit Companion for Women Farmers in Tamil Nadu",
    version="2.0.0"
)

# CORS configuration - Allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Startup event
@app.on_event("startup")
async def startup_event():
    """Print startup message"""
    print("="*70)
    print("🌾 VazhiKaatti - AI Credit Companion for Women Farmers")
    print("="*70)
    print("🚀 Server starting...")
    print("📍 API Documentation: http://localhost:8000/docs")
    print("🌐 CORS enabled for: http://localhost:3000")
    print("✅ Ready to empower Tamil Nadu women farmers!")
    print("="*70)


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
            "match_schemes": "/match-schemes"
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
        
        # Tamil explanation
        tamil_explanation = f"உங்கள் கடன் மதிப்பெண்: {score}/100 - {tamil_grade}. இந்த மதிப்பெண் உங்கள் விவசாய அனுபவம், வருமானம் மற்றும் நிதி நடத்தையை அடிப்படையாகக் கொண்டது."
        
        # Get feature importance and determine top factors
        feature_importance = model.feature_importances_
        importance_dict = dict(zip(feature_names, feature_importance))
        sorted_features = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
        
        # Generate top 3 factors
        factors = []
        
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
    
    Returns top 3 matching schemes with:
    - Scheme name (in Tamil)
    - Benefit amount
    - Description
    - Required documents
    - Apply link
    """
    try:
        # Get matching schemes
        matching_schemes = get_schemes_by_score(score, limit=3)
        
        # Format schemes for API response
        formatted_schemes = [
            SchemeInfo(
                name=scheme['name'],
                benefit_amount=scheme['benefit_amount'],
                description=scheme['description'],
                required_documents=scheme['required_documents'],
                apply_link=scheme['apply_link']
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


if __name__ == "__main__":
    print("\n" + "="*70)
    print("Starting VazhiKaatti Backend Server...")
    print("="*70 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
