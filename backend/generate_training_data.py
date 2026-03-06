"""
VazhiKaatti - Training Data Generator
Generates synthetic training data for women farmers credit scoring model
"""

import pandas as pd
import numpy as np
from typing import List, Dict

# Set random seed for reproducibility
np.random.seed(42)


def generate_farmer_data(n_samples: int = 500) -> pd.DataFrame:
    """
    Generate synthetic training data for women farmers in Tamil Nadu
    
    Args:
        n_samples: Number of data samples to generate
        
    Returns:
        DataFrame with farmer data and credit scores
    """
    
    print(f"Generating {n_samples} synthetic farmer records...")
    
    # Feature distributions based on realistic Tamil Nadu farmer profiles
    data = {
        'years_of_farming': np.random.randint(1, 40, n_samples),
        'crop_type': np.random.choice([0, 1, 2, 3], n_samples, p=[0.45, 0.25, 0.15, 0.15]),
        'annual_income_inr': np.random.lognormal(10.5, 0.8, n_samples),
        'shg_member': np.random.choice([0, 1], n_samples, p=[0.35, 0.65]),
        'pm_kisan_registered': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
        'has_bank_account': np.random.choice([0, 1], n_samples, p=[0.15, 0.85]),
        'existing_loans': np.random.choice([0, 1, 2, 3, 4], n_samples, p=[0.3, 0.3, 0.25, 0.1, 0.05]),
        'land_area_acres': np.random.exponential(2.0, n_samples),
        'crop_insurance': np.random.choice([0, 1], n_samples, p=[0.45, 0.55]),
        'repayment_history': np.random.choice([0, 1, 2, 3], n_samples, p=[0.15, 0.2, 0.35, 0.3])
    }
    
    df = pd.DataFrame(data)
    
    # Round and clip values to realistic ranges
    df['annual_income_inr'] = df['annual_income_inr'].clip(10000, 250000).round(2)
    df['land_area_acres'] = df['land_area_acres'].clip(0.5, 10.0).round(2)
    
    # Calculate credit score based on features
    df['credit_score'] = df.apply(calculate_credit_score, axis=1)
    
    print(f"✓ Generated {len(df)} records")
    print(f"Credit Score Range: {df['credit_score'].min()} - {df['credit_score'].max()}")
    print(f"Average Credit Score: {df['credit_score'].mean():.2f}")
    
    return df


def calculate_credit_score(row: pd.Series) -> int:
    """
    Calculate credit score (0-100) based on farmer features
    
    Scoring factors:
    - Years of farming experience: 0-15 points
    - Annual income: 0-20 points  
    - SHG membership: 0-15 points
    - Government scheme registration: 0-10 points
    - Bank account: 0-10 points
    - Loan management: 0-15 points
    - Land ownership: 0-10 points
    - Crop insurance: 0-5 points
    - Repayment history: 0-20 points (most important)
    """
    
    score = 0.0
    
    # Years of farming (0-15 points)
    # More experience = better score
    score += min(row['years_of_farming'] / 2.67, 15)
    
    # Annual income (0-20 points)
    # Higher income indicates better financial stability
    income_factor = (row['annual_income_inr'] - 10000) / (250000 - 10000)
    score += min(income_factor * 20, 20)
    
    # SHG membership (0-15 points)
    # Self-help group membership is highly valued
    if row['shg_member'] == 1:
        score += 15
    
    # PM-KISAN registration (0-10 points)
    # Government scheme awareness and access
    if row['pm_kisan_registered'] == 1:
        score += 10
    
    # Bank account (0-10 points)
    # Financial inclusion indicator
    if row['has_bank_account'] == 1:
        score += 10
    
    # Existing loans (0-15 points)
    # Penalize for too many loans, reward for manageable debt
    if row['existing_loans'] == 0:
        score += 10
    elif row['existing_loans'] == 1:
        score += 15
    elif row['existing_loans'] == 2:
        score += 8
    else:
        score += max(0, 5 - row['existing_loans'])
    
    # Land area (0-10 points)
    # More land = better collateral and income potential
    land_factor = min(row['land_area_acres'] / 5.0, 1.0)
    score += land_factor * 10
    
    # Crop insurance (0-5 points)
    # Risk management awareness
    if row['crop_insurance'] == 1:
        score += 5
    
    # Repayment history (0-20 points) - Most critical factor
    repayment_scores = {0: 0, 1: 5, 2: 12, 3: 20}
    score += repayment_scores[row['repayment_history']]
    
    # Add some random noise for variability
    noise = np.random.normal(0, 2)
    score = score + noise
    
    # Clip to 0-100 range and round
    return int(np.clip(score, 0, 100))


def get_feature_descriptions() -> Dict[str, str]:
    """Get human-readable descriptions of all features"""
    return {
        'years_of_farming': 'Number of years engaged in farming',
        'crop_type': 'Primary crop type (0=rice, 1=vegetables, 2=fruits, 3=mixed)',
        'annual_income_inr': 'Annual income from farming in Indian Rupees',
        'shg_member': 'Self-Help Group membership (0=No, 1=Yes)',
        'pm_kisan_registered': 'PM-KISAN scheme registration (0=No, 1=Yes)',
        'has_bank_account': 'Has bank account (0=No, 1=Yes)',
        'existing_loans': 'Number of existing loans',
        'land_area_acres': 'Total cultivable land area in acres',
        'crop_insurance': 'Has crop insurance (0=No, 1=Yes)',
        'repayment_history': 'Loan repayment history (0=none, 1=poor, 2=good, 3=excellent)',
        'credit_score': 'Calculated credit score (0-100)'
    }


def save_training_data(df: pd.DataFrame, filepath: str = 'data/training_data.csv'):
    """Save training data to CSV file"""
    df.to_csv(filepath, index=False)
    print(f"✓ Saved training data to {filepath}")


def print_data_statistics(df: pd.DataFrame):
    """Print statistical summary of the dataset"""
    print("\n" + "="*60)
    print("DATASET STATISTICS")
    print("="*60)
    
    print(f"\nTotal Records: {len(df)}")
    
    print("\nCROP TYPE DISTRIBUTION:")
    crop_names = {0: 'Rice', 1: 'Vegetables', 2: 'Fruits', 3: 'Mixed'}
    for crop_id, crop_name in crop_names.items():
        count = (df['crop_type'] == crop_id).sum()
        pct = (count / len(df)) * 100
        print(f"  {crop_name}: {count} ({pct:.1f}%)")
    
    print("\nFINANCIAL INDICATORS:")
    print(f"  SHG Members: {(df['shg_member']==1).sum()} ({(df['shg_member']==1).sum()/len(df)*100:.1f}%)")
    print(f"  PM-KISAN Registered: {(df['pm_kisan_registered']==1).sum()} ({(df['pm_kisan_registered']==1).sum()/len(df)*100:.1f}%)")
    print(f"  Has Bank Account: {(df['has_bank_account']==1).sum()} ({(df['has_bank_account']==1).sum()/len(df)*100:.1f}%)")
    print(f"  Has Crop Insurance: {(df['crop_insurance']==1).sum()} ({(df['crop_insurance']==1).sum()/len(df)*100:.1f}%)")
    
    print("\nNUMERICAL FEATURES:")
    print(f"  Annual Income: ₹{df['annual_income_inr'].mean():.2f} (avg) | ₹{df['annual_income_inr'].median():.2f} (median)")
    print(f"  Land Area: {df['land_area_acres'].mean():.2f} acres (avg) | {df['land_area_acres'].median():.2f} acres (median)")
    print(f"  Farming Experience: {df['years_of_farming'].mean():.1f} years (avg)")
    print(f"  Existing Loans: {df['existing_loans'].mean():.2f} (avg)")
    
    print("\nCREDIT SCORE DISTRIBUTION:")
    print(f"  Minimum: {df['credit_score'].min()}")
    print(f"  Maximum: {df['credit_score'].max()}")
    print(f"  Mean: {df['credit_score'].mean():.2f}")
    print(f"  Median: {df['credit_score'].median():.2f}")
    print(f"  Std Dev: {df['credit_score'].std():.2f}")
    
    # Credit score categories
    excellent = (df['credit_score'] >= 75).sum()
    good = ((df['credit_score'] >= 50) & (df['credit_score'] < 75)).sum()
    fair = ((df['credit_score'] >= 25) & (df['credit_score'] < 50)).sum()
    poor = (df['credit_score'] < 25).sum()
    
    print("\nCREDIT CATEGORIES:")
    print(f"  Excellent (75-100): {excellent} ({excellent/len(df)*100:.1f}%)")
    print(f"  Good (50-74): {good} ({good/len(df)*100:.1f}%)")
    print(f"  Fair (25-49): {fair} ({fair/len(df)*100:.1f}%)")
    print(f"  Poor (0-24): {poor} ({poor/len(df)*100:.1f}%)")
    
    print("="*60 + "\n")


if __name__ == "__main__":
    print("VazhiKaatti - Training Data Generator")
    print("Generating synthetic data for women farmer credit scoring\n")
    
    # Generate data
    df = generate_farmer_data(n_samples=500)
    
    # Print statistics
    print_data_statistics(df)
    
    # Print feature descriptions
    print("FEATURE DESCRIPTIONS:")
    for feature, description in get_feature_descriptions().items():
        print(f"  {feature}: {description}")
    print()
    
    # Save to CSV
    save_training_data(df)
    
    print("\n✓ Data generation complete!")
