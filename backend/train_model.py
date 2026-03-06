"""
VazhiKaatti - Model Training Script
Train the credit scoring model and save to disk
"""

import os
import sys
from ml_model import CreditScoreModel


def main():
    """Train and save the model"""
    print("="*70)
    print("VAZHIKAATTI - MODEL TRAINING")
    print("Credit Scoring Model for Women Farmers in Tamil Nadu")
    print("="*70)
    print()
    
    # Initialize model
    print("Initializing model...")
    model = CreditScoreModel()
    
    # Train model (or load if already trained)
    print("Training model...")
    print()
    model.load_or_train_model()
    
    # Display feature importance
    print()
    print("="*70)
    print("FEATURE IMPORTANCE")
    print("="*70)
    model.print_feature_importance()
    
    # Test prediction
    print()
    print("="*70)
    print("TESTING MODEL WITH SAMPLE FARMER")
    print("="*70)
    
    sample_farmer = {
        "years_of_farming": 8,
        "crop_type": 1,  # Vegetables
        "annual_income_inr": 120000,
        "shg_member": True,
        "pm_kisan_registered": True,
        "has_bank_account": True,
        "existing_loans": 1,
        "land_area_acres": 2.5,
        "crop_insurance": True,
        "repayment_history": 2  # Good
    }
    
    print("\nSample Farmer Profile:")
    print("-"*70)
    print(f"  Years of Farming: {sample_farmer['years_of_farming']}")
    print(f"  Crop Type: {['Rice', 'Vegetables', 'Fruits', 'Mixed'][sample_farmer['crop_type']]}")
    print(f"  Annual Income: ₹{sample_farmer['annual_income_inr']:,}")
    print(f"  SHG Member: {'Yes' if sample_farmer['shg_member'] else 'No'}")
    print(f"  PM-KISAN Registered: {'Yes' if sample_farmer['pm_kisan_registered'] else 'No'}")
    print(f"  Has Bank Account: {'Yes' if sample_farmer['has_bank_account'] else 'No'}")
    print(f"  Existing Loans: {sample_farmer['existing_loans']}")
    print(f"  Land Area: {sample_farmer['land_area_acres']} acres")
    print(f"  Crop Insurance: {'Yes' if sample_farmer['crop_insurance'] else 'No'}")
    print(f"  Repayment History: {['Poor', 'Fair', 'Good', 'Excellent'][sample_farmer['repayment_history']]}")
    print("-"*70)
    
    score = model.predict_score(sample_farmer)
    category = model.get_category(score)
    
    print(f"\nPredicted Credit Score: {score}")
    print(f"Credit Category: {category}")
    print()
    
    # Verify model files exist
    print("="*70)
    print("VERIFICATION")
    print("="*70)
    
    model_file = 'models/credit_model.pkl'
    scaler_file = 'models/scaler.pkl'
    
    if os.path.exists(model_file):
        size_mb = os.path.getsize(model_file) / (1024 * 1024)
        print(f"✓ Model saved: {model_file} ({size_mb:.2f} MB)")
    else:
        print(f"✗ Model NOT found: {model_file}")
        
    if os.path.exists(scaler_file):
        size_mb = os.path.getsize(scaler_file) / (1024 * 1024)
        print(f"✓ Scaler saved: {scaler_file} ({size_mb:.2f} MB)")
    else:
        print(f"✗ Scaler NOT found: {scaler_file}")
    
    print()
    print("="*70)
    print("✓ MODEL TRAINING COMPLETE")
    print("="*70)
    print()


if __name__ == "__main__":
    main()
