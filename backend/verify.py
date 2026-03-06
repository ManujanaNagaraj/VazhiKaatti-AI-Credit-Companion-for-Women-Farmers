"""
VazhiKaatti - Document Verification Service
Handles farmer registration and document verification
"""

import uuid
from datetime import datetime
from typing import Dict, Optional
import hashlib
import json


class VerificationService:
    """Service for farmer verification and registration"""
    
    def __init__(self):
        # In production, use a database
        self.farmers_db = {}
        self.verification_db = {}
    
    def register_farmer(self, farmer_data: Dict) -> str:
        """Register a new farmer"""
        # Generate unique farmer ID
        farmer_id = self.generate_farmer_id(farmer_data)
        
        # Store farmer data
        self.farmers_db[farmer_id] = {
            **farmer_data,
            "farmer_id": farmer_id,
            "registered_at": datetime.now().isoformat(),
            "verification_status": "pending",
            "documents_verified": []
        }
        
        return farmer_id
    
    def generate_farmer_id(self, farmer_data: Dict) -> str:
        """Generate unique farmer ID"""
        # In production, use a more robust ID generation
        unique_string = f"{farmer_data['name']}_{farmer_data.get('location', '')}_{datetime.now()}"
        hash_obj = hashlib.md5(unique_string.encode())
        return f"FMR{hash_obj.hexdigest()[:8].upper()}"
    
    def verify(self, farmer_id: str, document_type: str, document_data: str) -> bool:
        """Verify farmer document"""
        if farmer_id not in self.farmers_db:
            raise ValueError("Farmer not found")
        
        # Perform verification based on document type
        verification_result = self.verify_document(document_type, document_data)
        
        # Store verification result
        verification_id = str(uuid.uuid4())
        self.verification_db[verification_id] = {
            "farmer_id": farmer_id,
            "document_type": document_type,
            "verified": verification_result,
            "verified_at": datetime.now().isoformat()
        }
        
        # Update farmer record
        if verification_result:
            if "documents_verified" not in self.farmers_db[farmer_id]:
                self.farmers_db[farmer_id]["documents_verified"] = []
            self.farmers_db[farmer_id]["documents_verified"].append(document_type)
            
            # Check if all required documents are verified
            self.update_verification_status(farmer_id)
        
        return verification_result
    
    def verify_document(self, document_type: str, document_data: str) -> bool:
        """Verify specific document type"""
        # Placeholder verification logic
        # In production, integrate with government APIs
        
        if document_type == "aadhaar":
            return self.verify_aadhaar(document_data)
        elif document_type == "land_records":
            return self.verify_land_records(document_data)
        elif document_type == "bank_account":
            return self.verify_bank_account(document_data)
        elif document_type == "farmer_id":
            return self.verify_farmer_id_card(document_data)
        else:
            return False
    
    def verify_aadhaar(self, aadhaar_number: str) -> bool:
        """Verify Aadhaar number"""
        # Placeholder: Basic format validation
        if not aadhaar_number or len(aadhaar_number) != 12:
            return False
        if not aadhaar_number.isdigit():
            return False
        
        # In production: Call UIDAI API for verification
        return True
    
    def verify_land_records(self, land_data: str) -> bool:
        """Verify land ownership records"""
        # Placeholder verification
        # In production: Integrate with land records database
        
        try:
            land_info = json.loads(land_data)
            if "survey_number" in land_info and "village" in land_info:
                return True
        except:
            pass
        
        return False
    
    def verify_bank_account(self, account_data: str) -> bool:
        """Verify bank account"""
        # Placeholder verification
        # In production: Penny drop verification or bank API
        
        try:
            account_info = json.loads(account_data)
            if "account_number" in account_info and "ifsc" in account_info:
                return len(account_info["ifsc"]) == 11
        except:
            pass
        
        return False
    
    def verify_farmer_id_card(self, farmer_id_data: str) -> bool:
        """Verify government-issued farmer ID"""
        # Placeholder verification
        return len(farmer_id_data) > 5
    
    def update_verification_status(self, farmer_id: str):
        """Update overall verification status"""
        required_documents = ["aadhaar", "land_records", "bank_account"]
        verified_documents = self.farmers_db[farmer_id].get("documents_verified", [])
        
        if all(doc in verified_documents for doc in required_documents):
            self.farmers_db[farmer_id]["verification_status"] = "verified"
        elif len(verified_documents) > 0:
            self.farmers_db[farmer_id]["verification_status"] = "partial"
        else:
            self.farmers_db[farmer_id]["verification_status"] = "pending"
    
    def get_verification_status(self, farmer_id: str) -> Dict:
        """Get verification status for a farmer"""
        if farmer_id not in self.farmers_db:
            raise ValueError("Farmer not found")
        
        farmer = self.farmers_db[farmer_id]
        return {
            "farmer_id": farmer_id,
            "verification_status": farmer.get("verification_status", "pending"),
            "documents_verified": farmer.get("documents_verified", []),
            "registered_at": farmer.get("registered_at")
        }
    
    def get_pending_verifications(self) -> list:
        """Get list of pending verifications for officer dashboard"""
        pending = []
        
        for farmer_id, farmer in self.farmers_db.items():
            if farmer.get("verification_status") in ["pending", "partial"]:
                pending.append({
                    "farmer_id": farmer_id,
                    "name": farmer.get("name"),
                    "status": farmer.get("verification_status"),
                    "registered_at": farmer.get("registered_at")
                })
        
        return pending
