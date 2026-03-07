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
            print("Generating sample training data...")
            self.generate_sample_data()
        
        # Load data
        print(f"Loading training data from {data_path}")
        data = pd.read_csv(data_path)
        
        print(f"Total samples: {len(data)}")
        
        # Prepare features and target
        X = data[self.feature_names].values
        y = data['credit_score'].values
        
        # Split data into training and testing sets
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
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred)
        
        print(f"\nModel Accuracy: {accuracy:.2%}")
        print("\nClassification Report:")
        print(report)
        
        self.accuracy = accuracy
        
        # Save model and scaler
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, 'models/credit_model.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
        print("\n✓ Model and scaler saved successfully")
        
        return accuracy, report
    
    def generate_sample_data(self):
        """Generate sample training data if not exists"""
        import random
        import numpy as np
        
        os.makedirs('data', exist_ok=True)
        
        print("Generating 1000 sample records...")
        
        records = []
        for _ in range(1000):
            years_farming = random.randint(1, 30)
            crop_type = random.randint(0, 3)
            annual_income = random.randint(20000, 300000)
            shg_member = random.randint(0, 1)
            pm_kisan = random.randint(0, 1)
            bank_account = random.randint(0, 1)
            existing_loans = random.randint(0, 3)
            land_area = round(random.uniform(0.5, 10.0), 2)
            crop_insurance = random.randint(0, 1)
            repayment_history = random.randint(0, 3)
            
            # Calculate score based on factors
            score = 30  # Base score
            score += min(years_farming * 2, 40)
            score += min(annual_income / 3000, 20)
            score += shg_member * 10
            score += pm_kisan * 5
            score += bank_account * 5
            score -= existing_loans * 5
            score += min(land_area * 3, 15)
            score += crop_insurance * 5
            score += repayment_history * 10
            score = max(0, min(100, int(score)))
            
            records.append({
                'years_of_farming': years_farming,
                'crop_type': crop_type,
                'annual_income_inr': annual_income,
                'shg_member': shg_member,
                'pm_kisan_registered': pm_kisan,
                'has_bank_account': bank_account,
                'existing_loans': existing_loans,
                'land_area_acres': land_area,
                'crop_insurance': crop_insurance,
                'repayment_history': repayment_history,
                'credit_score': score
            })
        
        df = pd.DataFrame(records)
        df.to_csv('data/training_data.csv', index=False)
        print("✓ Sample data generated")
    
    def predict_score(self, farmer_data: dict) -> int:
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
                'repayment_history': 3
            }
        """
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        # Prepare features in correct order
        features = np.array([[
            farmer_data.get('years_of_farming', 0),
            farmer_data.get('crop_type', 0),
            farmer_data.get('annual_income_inr', 0),
            int(farmer_data.get('shg_member', 0)),
            int(farmer_data.get('pm_kisan_registered', 0)),
            int(farmer_data.get('has_bank_account', 0)),
            farmer_data.get('existing_loans', 0),
            farmer_data.get('land_area_acres', 0),
            int(farmer_data.get('crop_insurance', 0)),
            farmer_data.get('repayment_history', 0)
        ]])
        
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        # Predict
        score = int(self.model.predict(features_scaled)[0])
        
        # Ensure score is in valid range
        score = max(0, min(100, score))
        
        return score
    
    def get_feature_importance(self) -> Dict[str, float]:
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
    
    def get_category(self, score: int) -> str:
        """
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
    main()
