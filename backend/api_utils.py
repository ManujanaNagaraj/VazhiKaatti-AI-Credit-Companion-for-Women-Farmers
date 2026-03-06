"""
VazhiKaatti - API Utilities
Helper functions for API operations
"""

from typing import Dict, Any, List
import re


def validate_aadhaar_number(aadhaar: str) -> bool:
    """
    Validate Aadhaar number format
    
    Args:
        aadhaar: Aadhaar number string
    
    Returns:
        True if valid, False otherwise
    """
    # Remove spaces and hyphens
    aadhaar = aadhaar.replace(" ", "").replace("-", "")
    
    # Check if exactly 12 digits
    if not re.match(r'^\d{12}$', aadhaar):
        return False
    
    # Aadhaar cannot start with 0 or 1
    if aadhaar[0] in ['0', '1']:
        return False
    
    return True


def format_aadhaar_display(aadhaar: str) -> str:
    """
    Format Aadhaar number for display (XXXX XXXX 1234)
    
    Args:
        aadhaar: Aadhaar number string
    
    Returns:
        Formatted Aadhaar string
    """
    aadhaar = aadhaar.replace(" ", "").replace("-", "")
    
    if len(aadhaar) != 12:
        return aadhaar
    
    # Mask first 8 digits
    return f"XXXX XXXX {aadhaar[-4:]}"


def calculate_loan_eligibility(score: int, annual_income: float) -> Dict[str, Any]:
    """
    Calculate loan eligibility based on score and income
    
    Args:
        score: Credit score (0-100)
        annual_income: Annual income in INR
    
    Returns:
        Dictionary with eligibility details
    """
    # Base loan amount based on score
    if score >= 81:
        max_loan_multiplier = 5.0
        interest_rate = 4.0
    elif score >= 61:
        max_loan_multiplier = 3.5
        interest_rate = 6.0
    elif score >= 41:
        max_loan_multiplier = 2.0
        interest_rate = 8.0
    else:
        max_loan_multiplier = 1.0
        interest_rate = 10.0
    
    max_loan = annual_income * max_loan_multiplier
    
    return {
        "eligible": score >= 20,
        "max_loan_amount": max_loan,
        "interest_rate": interest_rate,
        "tenure_months": 60 if score >= 61 else 36,
        "collateral_required": score < 61,
        "guarantor_required": score < 41
    }


def get_tamil_score_message(score: int) -> str:
    """
    Get Tamil message based on score
    
    Args:
        score: Credit score (0-100)
    
    Returns:
        Tamil message string
    """
    if score >= 81:
        return f"வாழ்த்துக்கள்! உங்கள் கடன் மதிப்பெண் {score} - மிகச்சிறந்தது. நீங்கள் சிறப்பு கடன் திட்டங்களுக்கு தகுதியுடையவர்."
    elif score >= 61:
        return f"நல்லது! உங்கள் கடன் மதிப்பெண் {score}. நீங்கள் பல கடன் திட்டங்களுக்கு விண்ணப்பிக்கலாம்."
    elif score >= 41:
        return f"உங்கள் கடன் மதிப்பெண் {score}. சில அடிப்படை கடன் திட்டங்கள் கிடைக்கும். SHG மூலம் விண்ணப்பிக்க பரிந்துரைக்கப்படுகிறது."
    else:
        return f"உங்கள் கடன் மதிப்பெண் {score}. உங்கள் நிதி நடத்தையை மேம்படுத்த வேண்டும். SHG சேர்ந்து பயிற்சி பெறவும்."


def get_improvement_tips(features: Dict[str, Any]) -> List[str]:
    """
    Get personalized improvement tips based on farmer features
    
    Args:
        features: Farmer feature dictionary
    
    Returns:
        List of Tamil improvement tips
    """
    tips = []
    
    # Check SHG membership
    if not features.get('shg_member', False):
        tips.append("சுய உதவி குழுவில் சேருங்கள் - இது உங்கள் மதிப்பெண்ணை 10-15 புள்ளிகள் அதிகரிக்கும்")
    
    # Check PM-KISAN registration
    if not features.get('pm_kisan_registered', False):
        tips.append("PM-KISAN திட்டத்தில் பதிவு செய்யுங்கள் - இலவச பதிவு மற்றும் ஆண்டு ரூ.6000 உதவி")
    
    # Check bank account
    if not features.get('has_bank_account', False):
        tips.append("வங்கி கணக்கு திறங்கள் - நிதி சேர்க்கைக்கு அவசியம்")
    
    # Check crop insurance
    if not features.get('crop_insurance', False):
        tips.append("பயிர் காப்பீடு எடுங்கள் - இயற்கை பேரிடரிலிருந்து பாதுகாப்பு")
    
    # Check existing loans
    if features.get('existing_loans', 0) > 2:
        tips.append("தற்போதுள்ள கடன்களை திருப்பிச் செலுத்த முன்னுரிமை கொடுங்கள்")
    
    # Check repayment history
    if features.get('repayment_history', 0) < 2:
        tips.append("சரியான நேரத்தில் கடன் திருப்பிச் செலுத்துங்கள் - இது மிக முக்கியம்")
    
    # Check farming experience
    if features.get('years_of_farming', 0) < 5:
        tips.append("விவசாய பயிற்சி திட்டங்களில் பங்கேற்பு - உங்கள் திறன்களை மேம்படுத்த")
    
    # Check income
    if features.get('annual_income_inr', 0) < 100000:
        tips.append("கூடுதல் வருமான ஆதாரங்களை ஆராயுங்கள் - கால்நடை வளர்ப்பு அல்லது தோட்டக்கலை")
    
    return tips[:5]  # Return top 5 tips


def validate_survey_number(survey_number: str) -> bool:
    """
    Validate survey number format
    
    Args:
        survey_number: Survey number string
    
    Returns:
        True if valid format, False otherwise
    """
    # Basic format check - can be enhanced based on actual TN format
    if not survey_number or len(survey_number) < 5:
        return False
    
    return True


def format_currency_inr(amount: float) -> str:
    """
    Format amount in Indian currency format
    
    Args:
        amount: Amount in rupees
    
    Returns:
        Formatted string (e.g., "₹1,20,000")
    """
    # Indian number system: 1,00,00,000
    amount_str = f"{amount:,.0f}"
    
    # Add rupee symbol
    return f"₹{amount_str}"


def get_crop_type_tamil(crop_type: int) -> str:
    """
    Get Tamil name for crop type
    
    Args:
        crop_type: Crop type code (0-3)
    
    Returns:
        Tamil crop name
    """
    crop_types = {
        0: "நெல் (Rice)",
        1: "காய்கறிகள் (Vegetables)",
        2: "பழங்கள் (Fruits)",
        3: "கலப்பு (Mixed)"
    }
    return crop_types.get(crop_type, "அறியப்படாத (Unknown)")


def get_repayment_history_tamil(history: int) -> str:
    """
    Get Tamil description for repayment history
    
    Args:
        history: Repayment history code (0-3)
    
    Returns:
        Tamil description
    """
    histories = {
        0: "மோசம் (Poor)",
        1: "சராசரி (Fair)",
        2: "நல்லது (Good)",
        3: "சிறந்தது (Excellent)"
    }
    return histories.get(history, "அறியப்படாத (Unknown)")


def sanitize_input(text: str, max_length: int = 100) -> str:
    """
    Sanitize user input
    
    Args:
        text: Input text
        max_length: Maximum allowed length
    
    Returns:
        Sanitized text
    """
    if not text:
        return ""
    
    # Remove extra whitespace
    text = " ".join(text.split())
    
    # Truncate to max length
    if len(text) > max_length:
        text = text[:max_length]
    
    return text.strip()
