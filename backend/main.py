"""
VazhiKaatti - Main Backend Server
AI Credit Companion for Women Farmers
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn

from ml_model import CreditScoreModel
from scheme_matcher import SchemeMatcher
from verify import VerificationService

app = FastAPI(title="VazhiKaatti API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
credit_model = CreditScoreModel()
scheme_matcher = SchemeMatcher()
verify_service = VerificationService()


class FarmerData(BaseModel):
    name: str
    age: int
    land_size: float
    crop_type: str
    annual_income: float
    location: str
    education_level: str
    family_size: int


class CreditScoreRequest(BaseModel):
    farmer_id: str
    answers: dict


@app.get("/")
async def root():
    return {"message": "VazhiKaatti API - Empowering Women Farmers"}


@app.post("/api/register")
async def register_farmer(farmer: FarmerData):
    """Register a new farmer"""
    try:
        farmer_id = verify_service.register_farmer(farmer.dict())
        return {"farmer_id": farmer_id, "status": "registered"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/calculate-credit-score")
async def calculate_credit_score(request: CreditScoreRequest):
    """Calculate credit score based on farmer answers"""
    try:
        score = credit_model.predict_score(request.answers)
        return {
            "farmer_id": request.farmer_id,
            "credit_score": score,
            "category": credit_model.get_category(score)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/schemes/{farmer_id}")
async def get_matching_schemes(farmer_id: str):
    """Get matching government schemes for farmer"""
    try:
        schemes = scheme_matcher.get_schemes(farmer_id)
        return {"schemes": schemes}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/api/verify-document")
async def verify_document(farmer_id: str, document_type: str, document_data: str):
    """Verify farmer documents"""
    try:
        result = verify_service.verify(farmer_id, document_type, document_data)
        return {"verified": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/officer/dashboard")
async def get_officer_dashboard():
    """Get officer dashboard data"""
    try:
        stats = {
            "total_farmers": 1250,
            "pending_verifications": 45,
            "approved_this_month": 89,
            "average_credit_score": 672
        }
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
