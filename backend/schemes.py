"""
VazhiKaatti - Government Schemes Data
Tamil Nadu government loan schemes for women farmers
"""

from typing import List, Dict

# Tamil Nadu Government Schemes Database
SCHEMES_DATABASE = [
    # Excellent Credit Score Schemes (81-100)
    {
        "name": "முதலமைச்சர் பெண் விவசாயிகள் கௌரவ திட்டம்",
        "name_en": "Chief Minister's Women Farmers Honor Scheme",
        "min_score": 81,
        "max_score": 100,
        "benefit_amount": "₹5,00,000 - ₹10,00,000",
        "interest_rate": "4% per annum",
        "description": "உயர் கடன் மதிப்பெண் கொண்ட பெண் விவசாயிகளுக்கான சிறப்பு கடன் திட்டம். எந்தவொரு பாதுகாப்பும் தேவையில்லை.",
        "description_en": "Special loan scheme for women farmers with excellent credit scores. No collateral required.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "நில பதிவுகள் (Land Records)",
            "வங்கி கணக்கு விவரங்கள் (Bank Account Details)",
            "பாஸ்போர்ட் புகைப்படம் (Passport Photo)"
        ],
        "apply_link": "https://tnagri.gov.in/schemes/cmwomenfarmer"
    },
    {
        "name": "தேசிய விவசாய வளர்ச்சி திட்டம் - பெண் பிரிவு",
        "name_en": "National Agriculture Development Scheme - Women Category",
        "min_score": 81,
        "max_score": 100,
        "benefit_amount": "₹3,00,000 - ₹7,00,000",
        "interest_rate": "5% per annum",
        "description": "நவீன விவசாய கருவிகள் மற்றும் தொழில்நுட்பத்திற்கான கடன். மானியம் 35% வரை.",
        "description_en": "Loan for modern agricultural equipment and technology. Subsidy up to 35%.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "பட்டா ஆவணம் (Patta Document)",
            "SHG உறுப்பினர் அட்டை (SHG Membership Card)",
            "வருமான சான்றிதழ் (Income Certificate)"
        ],
        "apply_link": "https://tnagri.gov.in/schemes/nadp-women"
    },
    {
        "name": "கிசான் கிரெடிட் கார்டு - மேம்படுத்தப்பட்ட",
        "name_en": "Kisan Credit Card - Premium",
        "min_score": 81,
        "max_score": 100,
        "benefit_amount": "₹2,00,000 - ₹5,00,000",
        "interest_rate": "4.5% per annum",
        "description": "விவசாய செயல்பாடுகளுக்கான நெகிழ்வான கடன் வசதி. உடனடி அனுமதி.",
        "description_en": "Flexible credit facility for agricultural operations. Instant approval.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "நில உடைமை ஆவணங்கள் (Land Ownership Documents)",
            "வங்கி பாஸ்புக் (Bank Passbook)"
        ],
        "apply_link": "https://pmkisan.gov.in/kcc-premium"
    },
    
    # Good Credit Score Schemes (61-80)
    {
        "name": "தமிழ்நாடு விவசாயிகள் நலன் கடன் திட்டம்",
        "name_en": "Tamil Nadu Farmers Welfare Loan Scheme",
        "min_score": 61,
        "max_score": 80,
        "benefit_amount": "₹1,50,000 - ₹4,00,000",
        "interest_rate": "6% per annum",
        "description": "நல்ல கடன் மதிப்பெண் கொண்ட விவசாயிகளுக்கான நியாயமான வட்டி கடன்.",
        "description_en": "Fair interest loan for farmers with good credit scores.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "நில பதிவுகள் (Land Records)",
            "பட்டா நகல் (Patta Copy)",
            "வங்கி கணக்கு விவரங்கள் (Bank Account Details)",
            "பாஸ்போர்ட் புகைப்படம் (Passport Photo)"
        ],
        "apply_link": "https://tnagri.gov.in/schemes/welfare-loan"
    },
    {
        "name": "விவசாய உள்கட்டமைப்பு மேம்பாட்டு கடன்",
        "name_en": "Agricultural Infrastructure Development Loan",
        "min_score": 61,
        "max_score": 80,
        "benefit_amount": "₹2,00,000 - ₹3,50,000",
        "interest_rate": "6.5% per annum",
        "description": "நீர்ப்பாசன வசதிகள், கிணறு மற்றும் பண்ணை கட்டுமானத்திற்கான கடன்.",
        "description_en": "Loan for irrigation facilities, well construction, and farm buildings.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "நில பதிவுகள் (Land Records)",
            "திட்ட மதிப்பீடு (Project Estimate)",
            "வருமான சான்றிதழ் (Income Certificate)"
        ],
        "apply_link": "https://tnagri.gov.in/schemes/infra-loan"
    },
    {
        "name": "கிசான் கிரெடிட் கார்டு - நிலையான",
        "name_en": "Kisan Credit Card - Standard",
        "min_score": 61,
        "max_score": 80,
        "benefit_amount": "₹1,00,000 - ₹3,00,000",
        "interest_rate": "7% per annum",
        "description": "பயிர் சாகுபடி மற்றும் பராமரிப்பு செலவுகளுக்கான கடன்.",
        "description_en": "Loan for crop cultivation and maintenance expenses.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "நில உடைமை ஆவணங்கள் (Land Ownership Documents)",
            "வங்கி பாஸ்புக் (Bank Passbook)"
        ],
        "apply_link": "https://pmkisan.gov.in/kcc-standard"
    },
    
    # Fair Credit Score Schemes (41-60)
    {
        "name": "சுய உதவி குழு மூலம் விவசாய கடன்",
        "name_en": "Agricultural Loan through Self-Help Groups",
        "min_score": 41,
        "max_score": 60,
        "benefit_amount": "₹75,000 - ₹2,00,000",
        "interest_rate": "8% per annum",
        "description": "SHG உறுப்பினர்களுக்கான குழு உத்தரவாத கடன். குறைந்த ஆவணங்கள் தேவை.",
        "description_en": "Group guaranteed loan for SHG members. Minimal documentation required.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "SHG உறுப்பினர் அட்டை (SHG Membership Card)",
            "குழு பரிந்துரை கடிதம் (Group Recommendation Letter)",
            "வங்கி கணக்கு விவரங்கள் (Bank Account Details)"
        ],
        "apply_link": "https://tncdw.gov.in/shg-agri-loan"
    },
    {
        "name": "சிறு விவசாயிகள் நலன் திட்டம்",
        "name_en": "Small Farmers Welfare Scheme",
        "min_score": 41,
        "max_score": 60,
        "benefit_amount": "₹50,000 - ₹1,50,000",
        "interest_rate": "8.5% per annum",
        "description": "சிறு மற்றும் குறு விவசாயிகளுக்கான சிறப்பு கடன் திட்டம். மானியம் 25% வரை.",
        "description_en": "Special loan scheme for small and marginal farmers. Subsidy up to 25%.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "நில பதிவுகள் (Land Records)",
            "சிறு விவசாயி சான்றிதழ் (Small Farmer Certificate)",
            "வங்கி கணக்கு விவரங்கள் (Bank Account Details)",
            "இரண்டு உத்தரவாததாரர்கள் (Two Guarantors)"
        ],
        "apply_link": "https://tnagri.gov.in/schemes/small-farmer"
    },
    {
        "name": "பயிர் கடன் - அடிப்படை திட்டம்",
        "name_en": "Crop Loan - Basic Scheme",
        "min_score": 41,
        "max_score": 60,
        "benefit_amount": "₹30,000 - ₹1,00,000",
        "interest_rate": "9% per annum",
        "description": "குறுகிய கால பயிர் சாகுபடி கடன். விதை, உரம் மற்றும் பூச்சிக்கொல்லிகளுக்கு.",
        "description_en": "Short-term crop cultivation loan. For seeds, fertilizers, and pesticides.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "நில பதிவுகள் (Land Records)",
            "வங்கி கணக்கு (Bank Account)",
            "உத்தரவாததாரர் (Guarantor)"
        ],
        "apply_link": "https://tnagri.gov.in/schemes/crop-loan-basic"
    },
    
    # Poor Credit Score Schemes (0-40)
    {
        "name": "முதன்மை விவசாயிகள் திட்டம்",
        "name_en": "First-Time Farmers Scheme",
        "min_score": 0,
        "max_score": 40,
        "benefit_amount": "₹25,000 - ₹75,000",
        "interest_rate": "10% per annum",
        "description": "புதிய விவசாயிகள் மற்றும் கடன் வரலாறு இல்லாதவர்களுக்கான ஆரம்ப கடன் திட்டம்.",
        "description_en": "Starter loan scheme for new farmers and those without credit history.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "நில பதிவுகள் (Land Records)",
            "கிராம அலுவலர் சான்றிதழ் (Village Officer Certificate)",
            "இரண்டு உத்தரவாததாரர்கள் (Two Guarantors)",
            "பாதுகாப்பு ஆவணங்கள் (Collateral Documents)"
        ],
        "apply_link": "https://tnagri.gov.in/schemes/firsttime-farmer"
    },
    {
        "name": "SHG நுண்கடன் திட்டம்",
        "name_en": "SHG Micro-Credit Scheme",
        "min_score": 0,
        "max_score": 40,
        "benefit_amount": "₹10,000 - ₹50,000",
        "interest_rate": "10.5% per annum",
        "description": "குழு உறுப்பினர்களுக்கான சிறிய அளவிலான கடன். பயிற்சி மற்றும் ஆதரவுடன்.",
        "description_en": "Small-scale loan for group members. With training and support.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "SHG உறுப்பினர் அட்டை (SHG Membership Card)",
            "குழு தீர்மானம் (Group Resolution)",
            "வங்கி கணக்கு (Bank Account)"
        ],
        "apply_link": "https://tncdw.gov.in/shg-microcredit"
    },
    {
        "name": "விவசாய திறன் மேம்பாட்டு கடன்",
        "name_en": "Agricultural Skill Development Loan",
        "min_score": 0,
        "max_score": 40,
        "benefit_amount": "₹15,000 - ₹60,000",
        "interest_rate": "11% per annum",
        "description": "பயிற்சி மற்றும் திறன் மேம்பாட்டுடன் கூடிய கடன் திட்டம். கல்வி ஆதரவு.",
        "description_en": "Loan scheme with training and skill development. Educational support.",
        "required_documents": [
            "ஆதார் அட்டை (Aadhaar Card)",
            "நில பதிவுகள் (Land Records)",
            "பயிற்சி பதிவு (Training Enrollment)",
            "உத்தரவாததாரர்கள் (Guarantors)",
            "பாதுகாப்பு (Collateral)"
        ],
        "apply_link": "https://tnagri.gov.in/schemes/skill-loan"
    }
]


def get_schemes_by_score(score: int, limit: int = 3) -> List[Dict]:
    """
    Get matching schemes based on credit score
    
    Args:
        score: Credit score (0-100)
        limit: Maximum number of schemes to return
    
    Returns:
        List of matching schemes
    """
    matching_schemes = [
        scheme for scheme in SCHEMES_DATABASE
        if scheme['min_score'] <= score <= scheme['max_score']
    ]
    
    # Sort by benefit amount (descending) and return top matches
    matching_schemes.sort(key=lambda x: x['min_score'], reverse=True)
    
    return matching_schemes[:limit]


def format_scheme_for_api(scheme: Dict) -> Dict:
    """
    Format scheme data for API response
    
    Args:
        scheme: Raw scheme data
    
    Returns:
        Formatted scheme data
    """
    return {
        "name": scheme['name'],
        "benefit_amount": scheme['benefit_amount'],
        "description": scheme['description'],
        "required_documents": scheme['required_documents'],
        "apply_link": scheme['apply_link']
    }
