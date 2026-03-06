"""
VazhiKaatti - Model Evaluation Script
Comprehensive evaluation of the credit scoring model
"""

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, mean_absolute_error,
    mean_squared_error, r2_score
)
from sklearn.model_selection import cross_val_score, train_test_split
import joblib
import os


def load_model_and_data():
    """Load trained model and test data"""
    print("Loading model and data...")
    
    # Load model and scaler
    model = joblib.load('models/credit_model.pkl')
    scaler = joblib.load('models/scaler.pkl')
    
    # Load data
    df = pd.read_csv('data/training_data.csv')
    
    feature_names = [
        'years_of_farming', 'crop_type', 'annual_income_inr',
        'shg_member', 'pm_kisan_registered', 'has_bank_account',
        'existing_loans', 'land_area_acres', 'crop_insurance',
        'repayment_history'
    ]
    
    X = df[feature_names]
    y = df['credit_score']
    
    # Split data (same split as training)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    X_test_scaled = scaler.transform(X_test)
    
    return model, X_test_scaled, y_test, feature_names


def evaluate_model(model, X_test, y_test):
    """Comprehensive model evaluation"""
    print("\n" + "="*70)
    print("MODEL EVALUATION METRICS")
    print("="*70)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Classification metrics (treating as classification task)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nCLASSIFICATION METRICS:")
    print(f"  Accuracy Score: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Regression metrics (since scores are continuous)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    print(f"\nREGRESSION METRICS:")
    print(f"  Mean Absolute Error (MAE): {mae:.2f}")
    print(f"  Mean Squared Error (MSE): {mse:.2f}")
    print(f"  Root Mean Squared Error (RMSE): {rmse:.2f}")
    print(f"  R² Score: {r2:.4f}")
    
    # Error analysis
    errors = y_test - y_pred
    print(f"\nERROR ANALYSIS:")
    print(f"  Mean Error: {np.mean(errors):.2f}")
    print(f"  Std Dev of Errors: {np.std(errors):.2f}")
    print(f"  Min Error: {np.min(errors):.2f}")
    print(f"  Max Error: {np.max(errors):.2f}")
    
    # Score range analysis
    print(f"\nPREDICTION RANGE:")
    print(f"  Min Predicted Score: {y_pred.min()}")
    print(f"  Max Predicted Score: {y_pred.max()}")
    print(f"  Mean Predicted Score: {y_pred.mean():.2f}")
    print(f"  Median Predicted Score: {np.median(y_pred):.2f}")
    
    print(f"\nACTUAL RANGE:")
    print(f"  Min Actual Score: {y_test.min()}")
    print(f"  Max Actual Score: {y_test.max()}")
    print(f"  Mean Actual Score: {y_test.mean():.2f}")
    print(f"  Median Actual Score: {y_test.median():.2f}")
    
    # Accuracy within tolerance
    within_5 = np.sum(np.abs(errors) <= 5) / len(errors) * 100
    within_10 = np.sum(np.abs(errors) <= 10) / len(errors) * 100
    within_15 = np.sum(np.abs(errors) <= 15) / len(errors) * 100
    
    print(f"\nACCURACY WITHIN TOLERANCE:")
    print(f"  Within ±5 points: {within_5:.2f}%")
    print(f"  Within ±10 points: {within_10:.2f}%")
    print(f"  Within ±15 points: {within_15:.2f}%")
    
    print("="*70)
    
    return {
        'accuracy': accuracy,
        'mae': mae,
        'rmse': rmse,
        'r2': r2,
        'predictions': y_pred,
        'actuals': y_test,
        'errors': errors
    }


def cross_validation_score(model, X, y, cv=5):
    """Perform cross-validation"""
    print("\n" + "="*70)
    print("CROSS-VALIDATION ANALYSIS")
    print("="*70)
    
    print(f"\nPerforming {cv}-fold cross-validation...")
    
    # Accuracy scores
    cv_scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')
    
    print(f"\nCross-Validation Accuracy Scores:")
    for i, score in enumerate(cv_scores, 1):
        print(f"  Fold {i}: {score:.4f} ({score*100:.2f}%)")
    
    print(f"\nCross-Validation Summary:")
    print(f"  Mean Accuracy: {cv_scores.mean():.4f} ({cv_scores.mean()*100:.2f}%)")
    print(f"  Std Deviation: {cv_scores.std():.4f}")
    print(f"  95% Confidence Interval: [{cv_scores.mean() - 1.96*cv_scores.std():.4f}, "
          f"{cv_scores.mean() + 1.96*cv_scores.std():.4f}]")
    
    print("="*70)
    
    return cv_scores


def plot_evaluation_charts(results, output_dir='models/evaluation'):
    """Generate evaluation visualizations"""
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n" + "="*70)
    print("GENERATING EVALUATION CHARTS")
    print("="*70)
    
    sns.set_style("whitegrid")
    
    # 1. Actual vs Predicted scatter plot
    plt.figure(figsize=(10, 6))
    plt.scatter(results['actuals'], results['predictions'], alpha=0.5, s=50)
    plt.plot([0, 100], [0, 100], 'r--', lw=2, label='Perfect Prediction')
    plt.xlabel('Actual Credit Score', fontsize=12)
    plt.ylabel('Predicted Credit Score', fontsize=12)
    plt.title('Actual vs Predicted Credit Scores', fontsize=14, fontweight='bold')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(f'{output_dir}/actual_vs_predicted.png', dpi=300, bbox_inches='tight')
    print(f"  ✓ Saved: {output_dir}/actual_vs_predicted.png")
    plt.close()
    
    # 2. Residual plot
    plt.figure(figsize=(10, 6))
    plt.scatter(results['predictions'], results['errors'], alpha=0.5, s=50)
    plt.axhline(y=0, color='r', linestyle='--', lw=2)
    plt.xlabel('Predicted Credit Score', fontsize=12)
    plt.ylabel('Residual (Actual - Predicted)', fontsize=12)
    plt.title('Residual Plot', fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3)
    plt.savefig(f'{output_dir}/residual_plot.png', dpi=300, bbox_inches='tight')
    print(f"  ✓ Saved: {output_dir}/residual_plot.png")
    plt.close()
    
    # 3. Error distribution
    plt.figure(figsize=(10, 6))
    plt.hist(results['errors'], bins=30, edgecolor='black', alpha=0.7)
    plt.axvline(x=0, color='r', linestyle='--', lw=2, label='Zero Error')
    plt.xlabel('Prediction Error', fontsize=12)
    plt.ylabel('Frequency', fontsize=12)
    plt.title('Distribution of Prediction Errors', fontsize=14, fontweight='bold')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(f'{output_dir}/error_distribution.png', dpi=300, bbox_inches='tight')
    print(f"  ✓ Saved: {output_dir}/error_distribution.png")
    plt.close()
    
    # 4. Score distribution comparison
    plt.figure(figsize=(12, 6))
    plt.hist(results['actuals'], bins=20, alpha=0.5, label='Actual', edgecolor='black')
    plt.hist(results['predictions'], bins=20, alpha=0.5, label='Predicted', edgecolor='black')
    plt.xlabel('Credit Score', fontsize=12)
    plt.ylabel('Frequency', fontsize=12)
    plt.title('Distribution of Actual vs Predicted Scores', fontsize=14, fontweight='bold')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(f'{output_dir}/score_distribution.png', dpi=300, bbox_inches='tight')
    print(f"  ✓ Saved: {output_dir}/score_distribution.png")
    plt.close()
    
    print("="*70)


def save_evaluation_report(results, filename='models/evaluation/evaluation_report.txt'):
    """Save detailed evaluation report"""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, 'w') as f:
        f.write("="*70 + "\n")
        f.write("VAZHIKAATTI - MODEL EVALUATION REPORT\n")
        f.write("Credit Scoring Model for Women Farmers in Tamil Nadu\n")
        f.write("="*70 + "\n\n")
        
        f.write("PERFORMANCE METRICS:\n")
        f.write("-"*70 + "\n")
        f.write(f"Accuracy Score: {results['accuracy']:.4f} ({results['accuracy']*100:.2f}%)\n")
        f.write(f"Mean Absolute Error: {results['mae']:.2f}\n")
        f.write(f"Root Mean Squared Error: {results['rmse']:.2f}\n")
        f.write(f"R² Score: {results['r2']:.4f}\n\n")
        
        f.write("ERROR STATISTICS:\n")
        f.write("-"*70 + "\n")
        f.write(f"Mean Error: {np.mean(results['errors']):.2f}\n")
        f.write(f"Std Dev of Errors: {np.std(results['errors']):.2f}\n")
        f.write(f"Min Error: {np.min(results['errors']):.2f}\n")
        f.write(f"Max Error: {np.max(results['errors']):.2f}\n\n")
        
        f.write("="*70 + "\n")
    
    print(f"\n✓ Evaluation report saved to {filename}")


def main():
    """Main evaluation function"""
    print("="*70)
    print("VAZHIKAATTI - MODEL EVALUATION")
    print("="*70)
    
    # Load model and data
    model, X_test, y_test, feature_names = load_model_and_data()
    
    # Evaluate model
    results = evaluate_model(model, X_test, y_test)
    
    # Generate visualizations
    plot_evaluation_charts(results)
    
    # Save report
    save_evaluation_report(results)
    
    print("\n" + "="*70)
    print("✓ MODEL EVALUATION COMPLETE")
    print("="*70)


if __name__ == "__main__":
    main()
