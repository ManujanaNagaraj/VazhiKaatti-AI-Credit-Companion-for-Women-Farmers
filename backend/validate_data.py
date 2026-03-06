"""
VazhiKaatti - Data Validation Script
Validate training data quality and completeness
"""

import pandas as pd
import numpy as np


def load_data():
    """Load training data"""
    print("Loading training data...")
    df = pd.read_csv('data/training_data.csv')
    print(f"✓ Loaded {len(df)} records")
    return df


def validate_data_structure(df):
    """Validate data structure and columns"""
    print("\n" + "="*70)
    print("DATA STRUCTURE VALIDATION")
    print("="*70)
    
    expected_columns = [
        'years_of_farming', 'crop_type', 'annual_income_inr',
        'shg_member', 'pm_kisan_registered', 'has_bank_account',
        'existing_loans', 'land_area_acres', 'crop_insurance',
        'repayment_history', 'credit_score'
    ]
    
    # Check columns
    missing_cols = set(expected_columns) - set(df.columns)
    extra_cols = set(df.columns) - set(expected_columns)
    
    if missing_cols:
        print(f"✗ Missing columns: {missing_cols}")
        return False
    else:
        print("✓ All required columns present")
    
    if extra_cols:
        print(f"⚠ Extra columns found: {extra_cols}")
    
    # Check data types
    print("\nColumn Data Types:")
    print("-"*70)
    for col in expected_columns:
        print(f"  {col:25s} {df[col].dtype}")
    print("-"*70)
    
    return True


def validate_data_ranges(df):
    """Validate data value ranges"""
    print("\n" + "="*70)
    print("DATA RANGE VALIDATION")
    print("="*70)
    
    issues = []
    
    # Years of farming (0-50)
    if df['years_of_farming'].min() < 0 or df['years_of_farming'].max() > 50:
        issues.append(f"years_of_farming out of range: [{df['years_of_farming'].min()}, {df['years_of_farming'].max()}]")
    else:
        print(f"✓ years_of_farming: [{df['years_of_farming'].min()}, {df['years_of_farming'].max()}]")
    
    # Crop type (0-3)
    if df['crop_type'].min() < 0 or df['crop_type'].max() > 3:
        issues.append(f"crop_type out of range: [{df['crop_type'].min()}, {df['crop_type'].max()}]")
    else:
        print(f"✓ crop_type: [{df['crop_type'].min()}, {df['crop_type'].max()}]")
    
    # Annual income (0-1,000,000)
    if df['annual_income_inr'].min() < 0 or df['annual_income_inr'].max() > 1000000:
        issues.append(f"annual_income_inr out of range: [{df['annual_income_inr'].min()}, {df['annual_income_inr'].max()}]")
    else:
        print(f"✓ annual_income_inr: [₹{df['annual_income_inr'].min():,.0f}, ₹{df['annual_income_inr'].max():,.0f}]")
    
    # Boolean fields (0 or 1)
    bool_fields = ['shg_member', 'pm_kisan_registered', 'has_bank_account', 'crop_insurance']
    for field in bool_fields:
        unique_vals = df[field].unique()
        if not set(unique_vals).issubset({0, 1, True, False}):
            issues.append(f"{field} contains non-boolean values: {unique_vals}")
        else:
            print(f"✓ {field}: boolean")
    
    # Existing loans (0-5)
    if df['existing_loans'].min() < 0 or df['existing_loans'].max() > 5:
        issues.append(f"existing_loans out of range: [{df['existing_loans'].min()}, {df['existing_loans'].max()}]")
    else:
        print(f"✓ existing_loans: [{df['existing_loans'].min()}, {df['existing_loans'].max()}]")
    
    # Land area (0-20)
    if df['land_area_acres'].min() < 0 or df['land_area_acres'].max() > 20:
        issues.append(f"land_area_acres out of range: [{df['land_area_acres'].min()}, {df['land_area_acres'].max()}]")
    else:
        print(f"✓ land_area_acres: [{df['land_area_acres'].min()}, {df['land_area_acres'].max()}]")
    
    # Repayment history (0-3)
    if df['repayment_history'].min() < 0 or df['repayment_history'].max() > 3:
        issues.append(f"repayment_history out of range: [{df['repayment_history'].min()}, {df['repayment_history'].max()}]")
    else:
        print(f"✓ repayment_history: [{df['repayment_history'].min()}, {df['repayment_history'].max()}]")
    
    # Credit score (0-100)
    if df['credit_score'].min() < 0 or df['credit_score'].max() > 100:
        issues.append(f"credit_score out of range: [{df['credit_score'].min()}, {df['credit_score'].max()}]")
    else:
        print(f"✓ credit_score: [{df['credit_score'].min()}, {df['credit_score'].max()}]")
    
    if issues:
        print("\n✗ Range validation failed:")
        for issue in issues:
            print(f"  - {issue}")
        return False
    
    return True


def validate_data_quality(df):
    """Validate data quality"""
    print("\n" + "="*70)
    print("DATA QUALITY VALIDATION")
    print("="*70)
    
    # Check for missing values
    missing = df.isnull().sum()
    if missing.any():
        print("✗ Missing values found:")
        print(missing[missing > 0])
        return False
    else:
        print("✓ No missing values")
    
    # Check for duplicates
    duplicates = df.duplicated().sum()
    if duplicates > 0:
        print(f"⚠ {duplicates} duplicate rows found")
    else:
        print("✓ No duplicate rows")
    
    # Check for outliers using IQR method
    print("\nOutlier Detection (IQR method):")
    print("-"*70)
    numerical_cols = ['years_of_farming', 'annual_income_inr', 'land_area_acres', 'credit_score']
    
    for col in numerical_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)][col]
        
        if len(outliers) > 0:
            pct = (len(outliers) / len(df)) * 100
            print(f"  {col:25s} {len(outliers):4d} outliers ({pct:.1f}%)")
        else:
            print(f"  {col:25s} No outliers")
    print("-"*70)
    
    return True


def validate_data_distribution(df):
    """Validate data distribution"""
    print("\n" + "="*70)
    print("DATA DISTRIBUTION ANALYSIS")
    print("="*70)
    
    # Crop type distribution
    print("\nCrop Type Distribution:")
    print("-"*70)
    crop_names = {0: 'Rice', 1: 'Vegetables', 2: 'Fruits', 3: 'Mixed'}
    crop_dist = df['crop_type'].value_counts().sort_index()
    for crop_id, count in crop_dist.items():
        pct = (count / len(df)) * 100
        bar = '█' * int(pct / 2)
        print(f"  {crop_names.get(crop_id, 'Unknown'):15s} {count:4d} ({pct:5.1f}%) {bar}")
    print("-"*70)
    
    # Boolean field distribution
    print("\nBoolean Field Distribution:")
    print("-"*70)
    bool_fields = ['shg_member', 'pm_kisan_registered', 'has_bank_account', 'crop_insurance']
    for field in bool_fields:
        true_count = df[field].sum()
        true_pct = (true_count / len(df)) * 100
        false_pct = 100 - true_pct
        print(f"  {field:25s} Yes: {true_pct:5.1f}% | No: {false_pct:5.1f}%")
    print("-"*70)
    
    # Repayment history distribution
    print("\nRepayment History Distribution:")
    print("-"*70)
    repayment_names = {0: 'Poor', 1: 'Fair', 2: 'Good', 3: 'Excellent'}
    repayment_dist = df['repayment_history'].value_counts().sort_index()
    for level, count in repayment_dist.items():
        pct = (count / len(df)) * 100
        bar = '█' * int(pct / 2)
        print(f"  {repayment_names.get(level, 'Unknown'):15s} {count:4d} ({pct:5.1f}%) {bar}")
    print("-"*70)
    
    # Credit score distribution
    print("\nCredit Score Distribution:")
    print("-"*70)
    bins = [0, 40, 60, 80, 100]
    labels = ['Needs Improvement (<40)', 'Fair (40-59)', 'Good (60-79)', 'Excellent (80+)']
    score_dist = pd.cut(df['credit_score'], bins=bins, labels=labels, include_lowest=True).value_counts()
    for category, count in score_dist.items():
        pct = (count / len(df)) * 100
        bar = '█' * int(pct / 2)
        print(f"  {category:30s} {count:4d} ({pct:5.1f}%) {bar}")
    print("-"*70)
    
    return True


def generate_validation_report(df, output_file='data/validation_report.txt'):
    """Generate validation report"""
    with open(output_file, 'w') as f:
        f.write("="*70 + "\n")
        f.write("VAZHIKAATTI - DATA VALIDATION REPORT\n")
        f.write("="*70 + "\n\n")
        
        f.write(f"Total Records: {len(df)}\n")
        f.write(f"Total Features: {len(df.columns) - 1}\n")
        f.write(f"Missing Values: {df.isnull().sum().sum()}\n")
        f.write(f"Duplicate Rows: {df.duplicated().sum()}\n\n")
        
        f.write("Data Summary:\n")
        f.write("-"*70 + "\n")
        f.write(df.describe().to_string())
        f.write("\n\n")
        
        f.write("="*70 + "\n")
    
    print(f"\n✓ Validation report saved to {output_file}")


def main():
    """Main validation function"""
    print("="*70)
    print("VAZHIKAATTI - DATA VALIDATION")
    print("="*70)
    
    # Load data
    df = load_data()
    
    # Validate structure
    if not validate_data_structure(df):
        print("\n✗ Data structure validation failed!")
        return
    
    # Validate ranges
    if not validate_data_ranges(df):
        print("\n✗ Data range validation failed!")
        return
    
    # Validate quality
    if not validate_data_quality(df):
        print("\n✗ Data quality validation failed!")
        return
    
    # Analyze distribution
    validate_data_distribution(df)
    
    # Generate report
    generate_validation_report(df)
    
    print("\n" + "="*70)
    print("✓ DATA VALIDATION COMPLETE")
    print("="*70)


if __name__ == "__main__":
    main()
