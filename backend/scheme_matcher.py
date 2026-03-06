"""
VazhiKaatti - Government Scheme Matcher
Matches eligible government schemes based on farmer profile
"""

from typing import List, Dict
import json


class SchemeMatcher:
    """Match farmers with eligible government schemes"""
    
    def __init__(self):
        self.schemes = self.load_schemes()
    
    def load_schemes(self) -> List[Dict]:
        """Load available government schemes"""
        return [
            {
                "id": "PM-KISAN",
                "name": "Pradhan Mantri Kisan Samman Nidhi",
                "name_tamil": "பிரதான மந்திரி கிசான் சம்மன் நிதி",
                "description": "Direct income support of Rs. 6000/year to farmer families",
                "eligibility": {
                    "min_land": 0.0,
                    "max_land": 100.0,
                    "min_credit_score": 0
                },
                "benefits": "Rs. 6000 per year in 3 installments",
                "application_process": "Online through PM-KISAN portal",
                "documents_required": ["Aadhaar", "Land Records", "Bank Account"]
            },
            {
                "id": "KISAN-CREDIT",
                "name": "Kisan Credit Card (KCC)",
                "name_tamil": "கிசான் கிரெடிட் கார்டு",
                "description": "Credit facility for agricultural needs",
                "eligibility": {
                    "min_land": 0.5,
                    "max_land": 100.0,
                    "min_credit_score": 550
                },
                "benefits": "Credit up to Rs. 3 lakhs at subsidized interest",
                "application_process": "Through banks and cooperative societies",
                "documents_required": ["Aadhaar", "Land Documents", "Income Proof"]
            },
            {
                "id": "MAHILA-KISAN",
                "name": "Mahila Kisan Sashaktikaran Pariyojana",
                "name_tamil": "மகிளா கிசான் சக்திகரண பரியோஜனா",
                "description": "Women farmer empowerment program",
                "eligibility": {
                    "min_land": 0.0,
                    "max_land": 100.0,
                    "min_credit_score": 0,
                    "gender": "female"
                },
                "benefits": "Training, sustainable agriculture practices, market linkages",
                "application_process": "Through District Rural Development Agency",
                "documents_required": ["Aadhaar", "Farmer ID", "Self Declaration"]
            },
            {
                "id": "CROP-INSURANCE",
                "name": "Pradhan Mantri Fasal Bima Yojana",
                "name_tamil": "பிரதான மந்திரி பாசல் பீமா யோஜனா",
                "description": "Crop insurance for natural calamities",
                "eligibility": {
                    "min_land": 0.5,
                    "max_land": 100.0,
                    "min_credit_score": 0
                },
                "benefits": "Premium subsidy and compensation for crop loss",
                "application_process": "Through banks or online portal",
                "documents_required": ["Aadhaar", "Land Records", "Sowing Certificate"]
            },
            {
                "id": "SOIL-HEALTH",
                "name": "Soil Health Card Scheme",
                "name_tamil": "மண் ஆரோக்கிய அட்டை திட்டம்",
                "description": "Free soil testing and health card",
                "eligibility": {
                    "min_land": 0.1,
                    "max_land": 100.0,
                    "min_credit_score": 0
                },
                "benefits": "Free soil testing every 2 years",
                "application_process": "Through Agriculture Department",
                "documents_required": ["Aadhaar", "Land Records"]
            },
            {
                "id": "MICRO-IRRIGATION",
                "name": "Pradhan Mantri Krishi Sinchayee Yojana",
                "name_tamil": "பிரதான மந்திரி கிருஷி சிஞ்சாயீ யோஜனா",
                "description": "Subsidy for micro-irrigation systems",
                "eligibility": {
                    "min_land": 0.5,
                    "max_land": 100.0,
                    "min_credit_score": 500
                },
                "benefits": "Up to 90% subsidy for drip/sprinkler irrigation",
                "application_process": "Through Agriculture Department",
                "documents_required": ["Aadhaar", "Land Records", "Bank Account"]
            },
            {
                "id": "SHG-LOAN",
                "name": "Self Help Group Bank Linkage",
                "name_tamil": "சுய உதவி குழு வங்கி இணைப்பு",
                "description": "Collateral-free loans for SHG members",
                "eligibility": {
                    "min_land": 0.0,
                    "max_land": 100.0,
                    "min_credit_score": 450,
                    "shg_member": True
                },
                "benefits": "Loans up to Rs. 10 lakhs without collateral",
                "application_process": "Through SHG and NABARD",
                "documents_required": ["SHG Membership", "Aadhaar", "Group Resolution"]
            }
        ]
    
    def get_schemes(self, farmer_id: str, farmer_data: Dict = None) -> List[Dict]:
        """Get matching schemes for a farmer"""
        # In production, fetch farmer_data from database
        if farmer_data is None:
            farmer_data = self.get_default_farmer_data()
        
        eligible_schemes = []
        
        for scheme in self.schemes:
            if self.check_eligibility(farmer_data, scheme):
                eligible_schemes.append({
                    "scheme_id": scheme["id"],
                    "name": scheme["name"],
                    "name_tamil": scheme["name_tamil"],
                    "description": scheme["description"],
                    "benefits": scheme["benefits"],
                    "application_process": scheme["application_process"],
                    "documents_required": scheme["documents_required"],
                    "match_score": self.calculate_match_score(farmer_data, scheme)
                })
        
        # Sort by match score
        eligible_schemes.sort(key=lambda x: x["match_score"], reverse=True)
        
        return eligible_schemes
    
    def check_eligibility(self, farmer_data: Dict, scheme: Dict) -> bool:
        """Check if farmer is eligible for a scheme"""
        eligibility = scheme["eligibility"]
        
        # Check land size
        land_size = farmer_data.get("land_size", 0)
        if land_size < eligibility.get("min_land", 0):
            return False
        if land_size > eligibility.get("max_land", 100):
            return False
        
        # Check credit score
        credit_score = farmer_data.get("credit_score", 0)
        if credit_score < eligibility.get("min_credit_score", 0):
            return False
        
        # Check gender-specific schemes
        if "gender" in eligibility:
            if farmer_data.get("gender") != eligibility["gender"]:
                return False
        
        # Check SHG membership
        if "shg_member" in eligibility:
            if not farmer_data.get("shg_member", False):
                return False
        
        return True
    
    def calculate_match_score(self, farmer_data: Dict, scheme: Dict) -> float:
        """Calculate how well a scheme matches farmer's needs"""
        score = 50.0  # Base score
        
        # Higher credit score increases match
        credit_score = farmer_data.get("credit_score", 500)
        score += (credit_score - 500) / 10
        
        # Land ownership factor
        land_size = farmer_data.get("land_size", 0)
        if land_size > 2:
            score += 10
        
        # SHG membership bonus
        if farmer_data.get("shg_member", False):
            score += 15
        
        # Ensure score is between 0 and 100
        return max(0, min(100, score))
    
    def get_default_farmer_data(self) -> Dict:
        """Return default farmer data for testing"""
        return {
            "land_size": 2.5,
            "credit_score": 650,
            "gender": "female",
            "shg_member": True,
            "annual_income": 80000
        }
    
    def get_scheme_by_id(self, scheme_id: str) -> Dict:
        """Get specific scheme details"""
        for scheme in self.schemes:
            if scheme["id"] == scheme_id:
                return scheme
        return None
