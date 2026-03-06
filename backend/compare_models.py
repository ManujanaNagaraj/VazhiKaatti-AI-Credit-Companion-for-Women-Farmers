"""
VazhiKaatti - Model Comparison Script
Compare different ML algorithms for credit scoring
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.svm import SVR
from sklearn.metrics import accuracy_score, mean_absolute_error, mean_squared_error, r2_score
import time


def load_data():
    """Load training data"""
    print("Loading training data...")
    df = pd.read_csv('data/training_data.csv')
    
    feature_names = [
        'years_of_farming', 'crop_type', 'annual_income_inr',
        'shg_member', 'pm_kisan_registered', 'has_bank_account',
        'existing_loans', 'land_area_acres', 'crop_insurance',
        'repayment_history'
    ]
    
    X = df[feature_names]
    y = df['credit_score']
    
    print(f"✓ Loaded {len(df)} records with {len(feature_names)} features")
    return X, y, feature_names


def prepare_data(X, y, test_size=0.2, random_state=42):
    """Prepare train/test split and scale features"""
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test


def evaluate_model(model, X_train, X_test, y_train, y_test, model_name):
    """Evaluate a model and return metrics"""
    # Train
    start_time = time.time()
    model.fit(X_train, y_train)
    training_time = time.time() - start_time
    
    # Predict
    start_time = time.time()
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    prediction_time = time.time() - start_time
    
    # Calculate metrics
    metrics = {
        'model': model_name,
        'train_mae': mean_absolute_error(y_train, y_pred_train),
        'test_mae': mean_absolute_error(y_test, y_pred_test),
        'train_rmse': np.sqrt(mean_squared_error(y_train, y_pred_train)),
        'test_rmse': np.sqrt(mean_squared_error(y_test, y_pred_test)),
        'train_r2': r2_score(y_train, y_pred_train),
        'test_r2': r2_score(y_test, y_pred_test),
        'training_time': training_time,
        'prediction_time': prediction_time
    }
    
    # Cross-validation score
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, 
                                scoring='neg_mean_absolute_error')
    metrics['cv_mae'] = -cv_scores.mean()
    metrics['cv_mae_std'] = cv_scores.std()
    
    return metrics


def compare_models():
    """Compare different ML models"""
    print("="*90)
    print("VAZHIKAATTI - MODEL COMPARISON")
    print("="*90)
    print()
    
    # Load and prepare data
    X, y, feature_names = load_data()
    X_train, X_test, y_train, y_test = prepare_data(X, y)
    
    # Define models to compare
    models = {
        'Random Forest (200)': RandomForestRegressor(n_estimators=200, max_depth=15, random_state=42),
        'Random Forest (100)': RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, max_depth=5, random_state=42),
        'Decision Tree': DecisionTreeRegressor(max_depth=15, random_state=42),
        'Linear Regression': LinearRegression(),
        'Support Vector': SVR(kernel='rbf', C=100, gamma=0.1)
    }
    
    # Evaluate each model
    results = []
    print("\nEvaluating models...")
    print("-"*90)
    
    for model_name, model in models.items():
        print(f"\nTraining {model_name}...")
        metrics = evaluate_model(model, X_train, X_test, y_train, y_test, model_name)
        results.append(metrics)
        
        print(f"  Test MAE: {metrics['test_mae']:.2f}")
        print(f"  Test RMSE: {metrics['test_rmse']:.2f}")
        print(f"  Test R²: {metrics['test_r2']:.4f}")
        print(f"  Training Time: {metrics['training_time']:.3f}s")
    
    # Convert to DataFrame
    results_df = pd.DataFrame(results)
    
    # Display results
    print("\n" + "="*90)
    print("MODEL COMPARISON RESULTS")
    print("="*90)
    
    print("\nTest Performance (Lower is Better for MAE/RMSE, Higher for R²):")
    print("-"*90)
    comparison = results_df[['model', 'test_mae', 'test_rmse', 'test_r2']].sort_values('test_mae')
    print(comparison.to_string(index=False))
    print("-"*90)
    
    print("\nCross-Validation Performance:")
    print("-"*90)
    cv_comparison = results_df[['model', 'cv_mae', 'cv_mae_std']].sort_values('cv_mae')
    print(cv_comparison.to_string(index=False))
    print("-"*90)
    
    print("\nTraining and Prediction Time:")
    print("-"*90)
    time_comparison = results_df[['model', 'training_time', 'prediction_time']].sort_values('training_time')
    print(time_comparison.to_string(index=False))
    print("-"*90)
    
    # Identify best model
    best_mae_idx = results_df['test_mae'].idxmin()
    best_r2_idx = results_df['test_r2'].idxmax()
    
    print("\n" + "="*90)
    print("RECOMMENDATIONS")
    print("="*90)
    
    print(f"\nBest by MAE: {results_df.loc[best_mae_idx, 'model']}")
    print(f"  - Test MAE: {results_df.loc[best_mae_idx, 'test_mae']:.2f}")
    print(f"  - Test RMSE: {results_df.loc[best_mae_idx, 'test_rmse']:.2f}")
    print(f"  - Test R²: {results_df.loc[best_mae_idx, 'test_r2']:.4f}")
    print(f"  - Training Time: {results_df.loc[best_mae_idx, 'training_time']:.3f}s")
    
    print(f"\nBest by R²: {results_df.loc[best_r2_idx, 'model']}")
    print(f"  - Test MAE: {results_df.loc[best_r2_idx, 'test_mae']:.2f}")
    print(f"  - Test RMSE: {results_df.loc[best_r2_idx, 'test_rmse']:.2f}")
    print(f"  - Test R²: {results_df.loc[best_r2_idx, 'test_r2']:.4f}")
    print(f"  - Training Time: {results_df.loc[best_r2_idx, 'training_time']:.3f}s")
    
    # Save results
    results_df.to_csv('models/model_comparison.csv', index=False)
    print(f"\n✓ Results saved to models/model_comparison.csv")
    
    print("\n" + "="*90)
    print("MODEL COMPARISON COMPLETE")
    print("="*90)
    
    return results_df


def main():
    """Main comparison function"""
    compare_models()


if __name__ == "__main__":
    main()
