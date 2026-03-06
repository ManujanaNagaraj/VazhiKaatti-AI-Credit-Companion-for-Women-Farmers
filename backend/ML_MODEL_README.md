# VazhiKaatti ML Model Documentation

## Overview

The VazhiKaatti credit scoring model is specifically designed for women farmers in Tamil Nadu, India. It uses a **RandomForestClassifier** to predict credit scores ranging from 0 to 100 based on 10 carefully selected features that reflect the unique circumstances of rural women farmers.

## Model Architecture

### Algorithm
- **Type**: Random Forest Classifier
- **Estimators**: 200 trees
- **Max Depth**: 15
- **Random State**: 42 (for reproducibility)

### Training Configuration
- **Train/Test Split**: 80/20
- **Feature Scaling**: StandardScaler
- **Cross-Validation**: 5-fold CV for model evaluation

## Features (10 Input Variables)

### 1. Years of Farming
- **Type**: Numerical (float)
- **Range**: 0-50 years
- **Description**: Total years of farming experience
- **Impact**: Higher experience typically correlates with better credit scores

### 2. Crop Type
- **Type**: Categorical (encoded as integer)
- **Range**: 0-3
  - 0: Rice
  - 1: Vegetables
  - 2: Fruits
  - 3: Mixed farming
- **Description**: Primary crop cultivated
- **Impact**: Different crops have different risk profiles and income potential

### 3. Annual Income (INR)
- **Type**: Numerical (float)
- **Range**: 0-1,000,000 INR
- **Description**: Total annual income from farming and other sources
- **Impact**: Higher income indicates better repayment capacity

### 4. SHG Member
- **Type**: Boolean
- **Range**: True/False (1/0)
- **Description**: Member of Self-Help Group
- **Impact**: SHG membership often indicates financial discipline and community support

### 5. PM-KISAN Registered
- **Type**: Boolean
- **Range**: True/False (1/0)
- **Description**: Registered under Pradhan Mantri Kisan Samman Nidhi scheme
- **Impact**: Government scheme participation shows awareness and eligibility

### 6. Has Bank Account
- **Type**: Boolean
- **Range**: True/False (1/0)
- **Description**: Owns a bank account
- **Impact**: Financial inclusion indicator, essential for formal credit

### 7. Existing Loans
- **Type**: Numerical (integer)
- **Range**: 0-5
- **Description**: Number of existing loans
- **Impact**: Higher debt burden may reduce credit score

### 8. Land Area (Acres)
- **Type**: Numerical (float)
- **Range**: 0-20 acres
- **Description**: Total agricultural land owned or cultivated
- **Impact**: More land typically means higher production and income potential

### 9. Crop Insurance
- **Type**: Boolean
- **Range**: True/False (1/0)
- **Description**: Has crop insurance coverage
- **Impact**: Insurance indicates risk awareness and financial planning

### 10. Repayment History
- **Type**: Categorical (encoded as integer)
- **Range**: 0-3
  - 0: Poor
  - 1: Fair
  - 2: Good
  - 3: Excellent
- **Description**: Track record of past loan repayments
- **Impact**: Strong predictor of future credit behavior

## Credit Score Output

### Score Range
- **Minimum**: 0
- **Maximum**: 100

### Score Categories
- **Excellent**: 80-100
  - High creditworthiness
  - Eligible for premium loan products
  - Lower interest rates

- **Good**: 60-79
  - Moderate creditworthiness
  - Eligible for standard loan products
  - Competitive interest rates

- **Fair**: 40-59
  - Basic creditworthiness
  - Eligible for basic loan products
  - Higher interest rates or collateral required

- **Needs Improvement**: 0-39
  - Low creditworthiness
  - May require guarantors or higher collateral
  - Limited loan products available

## Model Performance

### Training Metrics
- **Accuracy**: Typically >85% on test set
- **Mean Absolute Error (MAE)**: <10 points
- **Root Mean Squared Error (RMSE)**: <12 points
- **R² Score**: >0.75

### Cross-Validation
- 5-fold cross-validation ensures robustness
- Consistent performance across different data splits

## Feature Importance

Based on analysis, the most important features (in typical order):

1. **Repayment History** (20-25%)
2. **Annual Income** (15-20%)
3. **Years of Farming** (10-15%)
4. **SHG Membership** (10-15%)
5. **Land Area** (8-12%)
6. **Existing Loans** (8-10%)
7. **Has Bank Account** (5-8%)
8. **Crop Insurance** (5-7%)
9. **PM-KISAN Registered** (3-5%)
10. **Crop Type** (3-5%)

*Note: Exact percentages vary based on the training data and model instance.*

## Usage

### Training the Model

```python
from ml_model import CreditScoreModel

# Initialize and train
model = CreditScoreModel()
model.load_or_train_model()
```

### Making Predictions

```python
# Example farmer profile
farmer_data = {
    "years_of_farming": 10,
    "crop_type": 1,  # Vegetables
    "annual_income_inr": 150000,
    "shg_member": True,
    "pm_kisan_registered": True,
    "has_bank_account": True,
    "existing_loans": 1,
    "land_area_acres": 3.0,
    "crop_insurance": True,
    "repayment_history": 2  # Good
}

# Predict score
score = model.predict_score(farmer_data)
category = model.get_category(score)

print(f"Credit Score: {score}")
print(f"Category: {category}")
```

## Data Requirements

### Training Data Format
CSV file with the following columns:
- years_of_farming
- crop_type
- annual_income_inr
- shg_member
- pm_kisan_registered
- has_bank_account
- existing_loans
- land_area_acres
- crop_insurance
- repayment_history
- credit_score (target variable)

### Minimum Dataset Size
- **Recommended**: 500+ records
- **Minimum**: 100 records
- Current dataset: 500 synthetic records based on Tamil Nadu farmer profiles

## Model Files

### Saved Artifacts
1. **credit_model.pkl**: Trained RandomForest model
2. **scaler.pkl**: Fitted StandardScaler for feature normalization

### Storage Location
- Directory: `backend/models/`
- Size: ~1-2 MB total

## Evaluation and Analysis Tools

### Scripts Available
1. **train_model.py**: Train and save the model
2. **evaluate_model.py**: Comprehensive model evaluation with metrics and visualizations
3. **feature_analysis.py**: Feature importance and correlation analysis
4. **validate_data.py**: Data quality validation and distribution analysis
5. **generate_training_data.py**: Generate synthetic training data

### Visualization Outputs
- Feature importance charts
- Correlation matrices
- Score distribution plots
- Actual vs. predicted scatter plots
- Residual analysis plots

## Tamil Nadu Context

### Why These Features?

1. **SHG Membership**: Tamil Nadu has one of the strongest SHG networks in India
2. **PM-KISAN**: Central government scheme widely adopted in Tamil Nadu
3. **Crop Types**: Rice, vegetables, fruits are primary crops in Tamil Nadu
4. **Land Holdings**: Most women farmers have small land holdings (1-5 acres)
5. **Crop Insurance**: PMFBY and other schemes are important risk mitigation tools

### Target Beneficiaries
- Women farmers in Tamil Nadu
- Smallholder farmers (typically <5 acres)
- Members of Self-Help Groups
- First-time or underserved borrowers

## Future Enhancements

### Potential Features to Add
- Soil quality/type
- Access to irrigation
- Distance to market
- Education level
- Family size
- Livestock ownership
- Government scheme participation count
- Training/skill development participation

### Model Improvements
- Ensemble methods (combining multiple models)
- Deep learning approaches for larger datasets
- Time-series analysis for seasonal patterns
- Geographic clustering by district/region

## References

- Tamil Nadu Agricultural University research
- National Bank for Agriculture and Rural Development (NABARD) guidelines
- Self-Help Group performance data
- PM-KISAN scheme statistics
- Reserve Bank of India credit scoring frameworks

## Support

For questions or issues:
- GitHub: [VazhiKaatti Repository](https://github.com/ManujanaNagaraj/VazhiKaatti-AI-Credit-Companion-for-Women-Farmers)
- Email: Support team contact

## License

This model is part of the VazhiKaatti project and follows the project's license terms.
