"""
VazhiKaatti - API Models
Pydantic models for request/response validation
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class AadhaarVerifyRequest(BaseModel):
    """Aadhaar verification request"""
    aadhaar_number: str = Field(..., min_length=12, max_length=12, description="12-digit Aadhaar number")
    otp: str = Field(..., min_length=4, max_length=6, description="OTP for verification")


class FarmerProfile(BaseModel):
    """Farmer profile response from Aadhaar verification"""
    name: str
    age: int
    village: str
    district: str
    photo_url: str


class AadhaarVerifyResponse(BaseModel):
    """Aadhaar verification response"""
    success: bool
    message: str
    farmer: Optional[FarmerProfile] = None


class LandRecordRequest(BaseModel):
    """Land record fetch request"""
    survey_number: str = Field(..., description="Survey number of the land")


class LandRecordResponse(BaseModel):
    """Land record fetch response"""
    land_area_acres: float
    crop_type: str
    ownership_name: str
    district: str
    patta_number: str


class FarmerFeatures(BaseModel):
    """Farmer features for credit score prediction"""
    years_of_farming: float = Field(..., ge=0, le=50, description="Years of farming experience")
    crop_type: int = Field(..., ge=0, le=3, description="0=Rice, 1=Vegetables, 2=Fruits, 3=Mixed")
    annual_income_inr: float = Field(..., ge=0, description="Annual income in INR")
    shg_member: bool = Field(..., description="Member of Self-Help Group")
    pm_kisan_registered: bool = Field(..., description="Registered under PM-KISAN")
    has_bank_account: bool = Field(..., description="Has a bank account")
    existing_loans: int = Field(..., ge=0, le=5, description="Number of existing loans")
    land_area_acres: float = Field(..., ge=0, le=20, description="Land area in acres")
    crop_insurance: bool = Field(..., description="Has crop insurance")
    repayment_history: int = Field(..., ge=0, le=3, description="0=Poor, 1=Fair, 2=Good, 3=Excellent")


class ScoreFactor(BaseModel):
    """Factor contributing to credit score"""
    factor: str
    impact: str
    tamil: str


class PredictScoreResponse(BaseModel):
    """Credit score prediction response"""
    score: int
    grade: str
    tamil_explanation: str
    factors: List[ScoreFactor]


class SchemeInfo(BaseModel):
    """Government scheme information"""
    name: str
    benefit_amount: str
    description: str
    required_documents: List[str]
    apply_link: str


class MatchSchemesResponse(BaseModel):
    """Matching schemes response"""
    schemes: List[SchemeInfo]
    total_count: int
