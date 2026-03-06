# VazhiKaatti ML Quick Start Guide

## Prerequisites

1. Python 3.8 or higher
2. pip package manager
3. Virtual environment (recommended)

## Installation

### 1. Create Virtual Environment (Optional but Recommended)

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Quick Start Scripts

### 1. Generate Training Data

Generate 500 synthetic farmer records for training:

```bash
python generate_training_data.py
```

**Output:**
- Creates `data/training_data.csv` with 500 records
- Displays data statistics and distribution

### 2. Validate Data Quality

Check data quality and completeness:

```bash
python validate_data.py
```

**Output:**
- Structure validation
- Range validation
- Quality checks (missing values, duplicates, outliers)
- Distribution analysis
- Creates `data/validation_report.txt`

### 3. Train the Model

Train and save the credit scoring model:

```bash
python train_model.py
```

**Output:**
- Trains RandomForestClassifier
- Displays model accuracy and feature importance
- Saves `models/credit_model.pkl` and `models/scaler.pkl`
- Shows sample prediction

### 4. Evaluate Model Performance

Comprehensive model evaluation with metrics and visualizations:

```bash
python evaluate_model.py
```

**Output:**
- Classification and regression metrics
- Cross-validation scores
- Feature importance analysis
- Creates 4 visualization charts:
  - `models/evaluation/actual_vs_predicted.png`
  - `models/evaluation/residual_plot.png`
  - `models/evaluation/error_distribution.png`
  - `models/evaluation/score_distribution.png`
- Creates `models/evaluation/evaluation_report.txt`

### 5. Analyze Features

Detailed feature analysis and correlations:

```bash
python feature_analysis.py
```

**Output:**
- Feature importance ranking
- Correlation analysis
- Categorical feature analysis (crop types, boolean fields)
- Numerical relationships
- Creates visualization charts in `models/analysis/`:
  - `feature_importance.png`
  - `correlation_matrix.png`
  - `crop_type_analysis.png`
  - `boolean_features_analysis.png`
  - `numerical_relationships.png`
- Creates `models/analysis/feature_analysis_report.txt`

### 6. Compare ML Models

Compare different algorithms to find the best model:

```bash
python compare_models.py
```

**Output:**
- Compares 6 different ML algorithms:
  - Random Forest (200 trees)
  - Random Forest (100 trees)
  - Gradient Boosting
  - Decision Tree
  - Linear Regression
  - Support Vector Regression
- Displays MAE, RMSE, R² scores
- Shows training and prediction times
- Creates `models/model_comparison.csv`

## Complete Workflow

Run all steps in sequence:

```bash
# 1. Generate data
python generate_training_data.py

# 2. Validate data
python validate_data.py

# 3. Train model
python train_model.py

# 4. Evaluate model
python evaluate_model.py

# 5. Analyze features
python feature_analysis.py

# 6. Compare models (optional)
python compare_models.py
```

## Using the Model

### Python Code

```python
from ml_model import CreditScoreModel

# Initialize model
model = CreditScoreModel()

# Prepare farmer data
farmer_data = {
    "years_of_farming": 8,
    "crop_type": 1,  # 0=Rice, 1=Vegetables, 2=Fruits, 3=Mixed
    "annual_income_inr": 120000,
    "shg_member": True,
    "pm_kisan_registered": True,
    "has_bank_account": True,
    "existing_loans": 1,
    "land_area_acres": 2.5,
    "crop_insurance": True,
    "repayment_history": 2  # 0=Poor, 1=Fair, 2=Good, 3=Excellent
}

# Get prediction
score = model.predict_score(farmer_data)
category = model.get_category(score)

print(f"Credit Score: {score}/100")
print(f"Category: {category}")
```

### API Endpoint

```python
# Start FastAPI server
uvicorn main:app --reload

# Then access:
# POST http://localhost:8000/api/calculate-credit-score
# Body: farmer_data JSON
```

## Testing

Run unit tests:

```bash
pytest test_ml_model.py -v
```

**Tests include:**
- Model initialization
- Score prediction for different farmer profiles
- Category classification
- Edge cases and invalid inputs
- File existence checks
- Feature importance validation

## Understanding the Output

### Credit Score Range

- **0-39**: Needs Improvement
- **40-59**: Fair
- **60-79**: Good  
- **80-100**: Excellent

### Feature Importance

Top features (typical):
1. Repayment History (20-25%)
2. Annual Income (15-20%)
3. Years of Farming (10-15%)
4. SHG Membership (10-15%)
5. Land Area (8-12%)

### Model Performance

Typical metrics:
- **Accuracy**: >85%
- **MAE**: <10 points
- **RMSE**: <12 points
- **R² Score**: >0.75

## Directory Structure

```
backend/
├── data/
│   ├── training_data.csv          # Training dataset
│   └── validation_report.txt      # Data quality report
├── models/
│   ├── credit_model.pkl           # Trained model
│   ├── scaler.pkl                 # Feature scaler
│   ├── model_comparison.csv       # Model comparison results
│   ├── evaluation/                # Evaluation outputs
│   │   ├── actual_vs_predicted.png
│   │   ├── residual_plot.png
│   │   ├── error_distribution.png
│   │   ├── score_distribution.png
│   │   └── evaluation_report.txt
│   └── analysis/                  # Feature analysis outputs
│       ├── feature_importance.png
│       ├── correlation_matrix.png
│       ├── crop_type_analysis.png
│       ├── boolean_features_analysis.png
│       ├── numerical_relationships.png
│       └── feature_analysis_report.txt
└── scripts/                       # All Python scripts
    ├── ml_model.py
    ├── generate_training_data.py
    ├── validate_data.py
    ├── train_model.py
    ├── evaluate_model.py
    ├── feature_analysis.py
    └── compare_models.py
```

## Troubleshooting

### Issue: Model files not found

**Solution:** Run `python train_model.py` first to create model files

### Issue: Import errors

**Solution:** Ensure all dependencies installed: `pip install -r requirements.txt`

### Issue: Data validation fails

**Solution:** Check `data/training_data.csv` format matches expected schema

### Issue: Low model accuracy

**Solution:** 
- Generate more training data
- Check data quality
- Try different algorithms using `compare_models.py`

### Issue: Visualization not showing

**Solution:** 
- Ensure matplotlib backend is configured
- Check output directories exist
- Images saved to disk (not displayed interactively)

## Next Steps

1. **Production Deployment**: Integrate with FastAPI endpoints
2. **Data Collection**: Replace synthetic data with real farmer data
3. **Model Monitoring**: Track model performance over time
4. **Feature Engineering**: Add more relevant features
5. **A/B Testing**: Test different model configurations

## Support

For detailed documentation, see:
- [ML_MODEL_README.md](ML_MODEL_README.md) - Complete model documentation
- [README.md](../README.md) - Project overview

## License

Part of the VazhiKaatti project - AI Credit Companion for Women Farmers
