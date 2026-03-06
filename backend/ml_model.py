"""
VazhiKaatti - ML Model for Credit Score Prediction
Trained on agricultural and socio-economic factors
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os


class CreditScoreModel:
    """Credit score prediction model for women farmers"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'land_size', 'annual_income', 'age', 'education_level',
            'family_size', 'livestock_owned', 'years_farming',
            'loan_history', 'savings_amount', 'group_membership'
        ]
        self.load_or_train_model()
    
    def load_or_train_model(self):
        """Load existing model or train new one"""
        model_path = 'models/credit_model.pkl'
        
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            print("Model loaded successfully")
        else:
            print("Training new model...")
            self.train_model()
    
    def train_model(self):
        """Train the credit score prediction model"""
        # Load training data
        data_path = 'data/training_data.csv'
        
        if not os.path.exists(data_path):
            print("Warning: Training data not found. Using default model.")
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
            return
        
        df = pd.read_csv(data_path)
        X = df[self.feature_names]
        y = df['credit_score']
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.model.fit(X_scaled, y)
        
        # Save model
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, 'models/credit_model.pkl')
        print("Model trained and saved successfully")
    
    def predict_score(self, answers: dict) -> int:
        """Predict credit score from farmer answers"""
        # Extract features from answers
        features = self.extract_features(answers)
        
        # Convert to array
        feature_array = np.array([features])
        
        # Scale features
        if self.model is not None:
            feature_scaled = self.scaler.transform(feature_array)
            score = self.model.predict(feature_scaled)[0]
        else:
            # Fallback calculation
            score = self.calculate_basic_score(features)
        
        # Ensure score is between 300 and 900
        score = max(300, min(900, int(score)))
        
        return score
    
    def extract_features(self, answers: dict) -> list:
        """Extract numerical features from answers"""
        return [
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
        histories = {
            'none': 0,
            'poor': 1,
            'fair': 2,
            'good': 3,
            'excellent': 4
        }
        return histories.get(history, 0)
    
    def calculate_basic_score(self, features: list) -> float:
        """Basic fallback credit score calculation"""
        base_score = 500
        
        # Land size factor
        base_score += min(features[0] * 20, 100)
        
        # Income factor
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
