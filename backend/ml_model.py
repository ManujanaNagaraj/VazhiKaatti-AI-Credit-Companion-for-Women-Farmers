"""
VazhiKaatti - ML Model for Credit Score Prediction
Trained on agricultural and socio-economic factors specific to Tamil Nadu women farmers
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import joblib
import os
from typing import Dict, Tuple


class CreditScoreModel:
    """Credit score prediction model for women farmers in Tamil Nadu"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'years_of_farming',
            'crop_type',
            'annual_income_inr',
            'shg_member',
            'pm_kisan_registered',
            'has_bank_account',
            'existing_loans',
            'land_area_acres',
            'crop_insurance',
            'repayment_history'
        ]
        self.accuracy = None
        self.load_or_train_model()
    
    def load_or_train_model(self):
        """Load existing model or train new one"""
        model_path = 'models/credit_model.pkl'
        scaler_path = 'models/scaler.pkl'
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
            print("✓ Model and scaler loaded successfully")
        else:
            print("Training new model...")
            self.train_model()
    
    def train_model(self) -> Tuple[float, str]:
        """
        Train the credit score prediction model using RandomForestClassifier
        
        Returns:
            Tuple of (accuracy_score, classification_report)
        """
        # Load training data
        data_path = 'data/training_data.csv'
        
        if not os.path.exists(data_path):
            print("ERROR: Training data not found at", data_path)
           plit data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=None
        )
        
        print(f"Training set: {len(X_train)} samples")
        print(f"Testing set: {len(X_test)} samples")
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest Classifier
        print("\nTraining RandomForestClassifier...")
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1,
            verbose=0
        )
        
        self.model.fit(X_train_scaled, y_train)
        print("✓ Model training complete")
        
        # Evaluate model
        y_pred = self.model.farmer_data: dict) -> int:
        """
        Predict credit score from farmer data
        
        Args:
            farmer_data: Dictionary containing farmer features
            
        Returns:
            Credit score between 0 and 100
            
        Example:
            farmer_data = {
                'years_of_farming': 15,
                'crop_type': 0,
                'annual_income_inr': 75000,
                'shg_member': 1,
                'pm_kisan_registered': 1,
                'has_bank_account': 1,
                'existing_loans': 1,
                'land_area_acres': 2.5,
                'crop_insurance': 1,
        get_feature_importance(self) -> Dict[str, float]:
        """
        Get feature importance scores from the trained model
        
        Returns:
            Dictionary mapping feature names to importance scores
        """
        if self.model is None:
            return {}
        
        importance_dict = dict(zip(self.feature_names, self.model.feature_importances_))
        # Sort by importance
        importance_dict = dict(sorted(importance_dict.items(), key=lambda x: x[1], reverse=True))
        
        return importance_dict
    
    def print_feature_importance(self):
        """Print feature importance in a formatted way"""
        importance = self.get_feature_importance()
        
        if not importance:
            print("No feature importance available")
            return
        
        print(f"\n{'='*60}")
        print("FEATURE IMPORTANCE")
        print(f"{'='*60}")
        
        for i, (feature, score) in enumerate(importance.items(), 1):
            bar_length = int(score * 50)
            bar = '█' * bar_length
            print(f"{i}. {feature:25s} {score:.4f} {bar}")
        
        print(f"{'='*60}\n")
            float(answers.get('land_size', 2.0)),
            float(answers.get('annual_income', 50000)),
            int(answers.get('age', 35)),
            self.encode_education(answers.get('education_level', 'primary')),
            int(answers.get('family_size', 4)),
            int(answers.get('livestock_owned', 2)),
            int(answers.get('years_farming', 10)),
            self.encode_loan_history(answers.get('loan_history', 'none')),
            float(answers.get('savings_amount', 10000)),
            int(answers.get('group_membership', 1))
        ]
    
    def encode_education(self, level: str) -> int:
        """Encode education level"""
        levels = {
            'none': 0,
            'primary': 1,
            'middle': 2,
            'high_school': 3,
            'college': 4
        }
        return levels.get(level, 1)
    
    def encode_loan_history(self, history: str) -> int:
        """Encode loan repayment history"""
        his
        Get credit category based on score
        
        Args:
            score: Credit score (0-100)
            
        Returns:
            Category string
        """
        if score >= 75:
            return "Excellent"
        elif score >= 50:
            return "Good"
        elif score >= 25:
            return "Fair"
        else:
            return "Poor"


def main():
    """Main function to train and save the model"""
    print("="*60)
    print("VazhiKaatti - Credit Scoring Model Training")
    print("="*60)
    print()
    
    # Create and train model
    model = CreditScoreModel()
    
    # Print feature importance
    if model.model is not None:
        model.print_feature_importance()
    
    # Test prediction
    print("Testing model with sample farmer data...\n")
    
    sample_farmer = {
        'years_of_farming': 15,
        'crop_type': 0,  # Rice
        'annual_income_inr': 75000,
        'shg_member': 1,
        'pm_kisan_registered': 1,
        'has_bank_account': 1,
        'existing_loans': 1,
        'land_area_acres': 2.5,
        'crop_insurance': 1,
        'repayment_history': 3  # Excellent
    }
    
    predicted_score = model.predict_score(sample_farmer)
    category = model.get_category(predicted_score)
    
    print("Sample Farmer Profile:")
    print("-" * 40)
    for key, value in sample_farmer.items():
        print(f"  {key}: {value}")
    print("-" * 40)
    print(f"Predicted Credit Score: {predicted_score}/100")
    print(f"Category: {category}")
    print()
    print("="*60)
    print("✓ Model training and testing complete!")
    print("="*60)


if __name__ == "__main__":
    main(
        base_score += min(features[1] / 10000, 150)
        
        # Education factor
        base_score += features[3] * 20
        
        # Loan history factor
        base_score += features[7] * 30
        
        # Group membership factor
        base_score += features[9] * 40
        
        return base_score
    
    def get_category(self, score: int) -> str:
        """Get credit category based on score"""
        if score >= 750:
            return "Excellent"
        elif score >= 650:
            return "Good"
        elif score >= 550:
            return "Fair"
        else:
            return "Needs Improvement"
    
    def get_feature_importance(self):
        """Get feature importance scores"""
        if self.model is None:
            return {}
        
        importance = self.model.feature_importances_
        return dict(zip(self.feature_names, importance))
