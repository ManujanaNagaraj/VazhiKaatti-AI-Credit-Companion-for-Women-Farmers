"""
VazhiKaatti - Feature Analysis Script
Analyze feature importance and relationships in the credit scoring model
"""

import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os
from scipy.stats import pearsonr


def load_model_and_data():
    """Load model and training data"""
    print("Loading model and data...")
    
    model = joblib.load('models/credit_model.pkl')
    df = pd.read_csv('data/training_data.csv')
    
    feature_names = [
        'years_of_farming', 'crop_type', 'annual_income_inr',
        'shg_member', 'pm_kisan_registered', 'has_bank_account',
        'existing_loans', 'land_area_acres', 'crop_insurance',
        'repayment_history'
    ]
    
    return model, df, feature_names


def analyze_feature_importance(model, feature_names, output_dir='models/analysis'):
    """Analyze and visualize feature importance"""
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n" + "="*70)
    print("FEATURE IMPORTANCE ANALYSIS")
    print("="*70)
    
    # Get feature importance
    importance = model.feature_importances_
    importance_df = pd.DataFrame({
        'feature': feature_names,
        'importance': importance
    }).sort_values('importance', ascending=False)
    
    # Print importance
    print("\nFeature Importance Ranking:")
    print("-"*70)
    for idx, row in importance_df.iterrows():
        bar_length = int(row['importance'] * 50)
        bar = '█' * bar_length
        print(f"{row['feature']:25s} {row['importance']:.4f} {bar}")
    print("-"*70)
    
    # Plot importance
    plt.figure(figsize=(12, 8))
    colors = sns.color_palette("viridis", len(importance_df))
    bars = plt.barh(importance_df['feature'], importance_df['importance'], color=colors)
    plt.xlabel('Importance Score', fontsize=12, fontweight='bold')
    plt.ylabel('Features', fontsize=12, fontweight='bold')
    plt.title('Feature Importance in Credit Scoring Model', 
              fontsize=14, fontweight='bold', pad=20)
    plt.grid(axis='x', alpha=0.3)
    
    # Add value labels
    for i, bar in enumerate(bars):
        width = bar.get_width()
        plt.text(width, bar.get_y() + bar.get_height()/2, 
                f'{width:.4f}', ha='left', va='center', fontsize=10)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/feature_importance.png', dpi=300, bbox_inches='tight')
    print(f"\n✓ Saved: {output_dir}/feature_importance.png")
    plt.close()
    
    return importance_df


def analyze_feature_correlations(df, feature_names, output_dir='models/analysis'):
    """Analyze correlations between features and target"""
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n" + "="*70)
    print("FEATURE CORRELATION ANALYSIS")
    print("="*70)
    
    # Calculate correlations with credit score
    correlations = {}
    for feature in feature_names:
        corr, p_value = pearsonr(df[feature], df['credit_score'])
        correlations[feature] = {'correlation': corr, 'p_value': p_value}
    
    # Convert to DataFrame
    corr_df = pd.DataFrame(correlations).T
    corr_df = corr_df.sort_values('correlation', ascending=False)
    
    print("\nCorrelation with Credit Score:")
    print("-"*70)
    for feature, row in corr_df.iterrows():
        print(f"{feature:25s} {row['correlation']:+.4f} (p-value: {row['p_value']:.4e})")
    print("-"*70)
    
    # Correlation matrix
    plt.figure(figsize=(12, 10))
    correlation_matrix = df[feature_names + ['credit_score']].corr()
    sns.heatmap(correlation_matrix, annot=True, fmt='.2f', cmap='coolwarm', 
                center=0, linewidths=1, cbar_kws={'label': 'Correlation'})
    plt.title('Feature Correlation Matrix', fontsize=14, fontweight='bold', pad=20)
    plt.tight_layout()
    plt.savefig(f'{output_dir}/correlation_matrix.png', dpi=300, bbox_inches='tight')
    print(f"\n✓ Saved: {output_dir}/correlation_matrix.png")
    plt.close()
    
    return corr_df


def analyze_categorical_features(df, output_dir='models/analysis'):
    """Analyze categorical features"""
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n" + "="*70)
    print("CATEGORICAL FEATURE ANALYSIS")
    print("="*70)
    
    # Crop type analysis
    crop_names = {0: 'Rice', 1: 'Vegetables', 2: 'Fruits', 3: 'Mixed'}
    df['crop_name'] = df['crop_type'].map(crop_names)
    
    crop_stats = df.groupby('crop_name')['credit_score'].agg(['mean', 'median', 'std', 'count'])
    print("\nCredit Score by Crop Type:")
    print("-"*70)
    print(crop_stats.to_string())
    print("-"*70)
    
    # Plot crop type distribution
    fig, axes = plt.subplots(1, 2, figsize=(15, 5))
    
    # Count plot
    crop_counts = df['crop_name'].value_counts()
    axes[0].bar(crop_counts.index, crop_counts.values, color=sns.color_palette("Set2"))
    axes[0].set_xlabel('Crop Type', fontsize=12, fontweight='bold')
    axes[0].set_ylabel('Number of Farmers', fontsize=12, fontweight='bold')
    axes[0].set_title('Distribution of Farmers by Crop Type', fontsize=12, fontweight='bold')
    axes[0].grid(axis='y', alpha=0.3)
    
    # Box plot of credit scores
    df.boxplot(column='credit_score', by='crop_name', ax=axes[1])
    axes[1].set_xlabel('Crop Type', fontsize=12, fontweight='bold')
    axes[1].set_ylabel('Credit Score', fontsize=12, fontweight='bold')
    axes[1].set_title('Credit Score Distribution by Crop Type', fontsize=12, fontweight='bold')
    plt.suptitle('')
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/crop_type_analysis.png', dpi=300, bbox_inches='tight')
    print(f"\n✓ Saved: {output_dir}/crop_type_analysis.png")
    plt.close()
    
    # Boolean feature analysis
    bool_features = ['shg_member', 'pm_kisan_registered', 'has_bank_account', 'crop_insurance']
    
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    axes = axes.flatten()
    
    for i, feature in enumerate(bool_features):
        data_yes = df[df[feature] == 1]['credit_score']
        data_no = df[df[feature] == 0]['credit_score']
        
        axes[i].hist([data_no, data_yes], bins=20, label=['No', 'Yes'], 
                    color=['#ff9999', '#99ff99'], alpha=0.7, edgecolor='black')
        axes[i].set_xlabel('Credit Score', fontsize=11)
        axes[i].set_ylabel('Frequency', fontsize=11)
        axes[i].set_title(f'Credit Score Distribution: {feature.replace("_", " ").title()}', 
                         fontsize=11, fontweight='bold')
        axes[i].legend()
        axes[i].grid(axis='y', alpha=0.3)
        
        # Add mean lines
        axes[i].axvline(data_no.mean(), color='red', linestyle='--', linewidth=2, 
                       label=f'Mean (No): {data_no.mean():.1f}')
        axes[i].axvline(data_yes.mean(), color='green', linestyle='--', linewidth=2, 
                       label=f'Mean (Yes): {data_yes.mean():.1f}')
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/boolean_features_analysis.png', dpi=300, bbox_inches='tight')
    print(f"✓ Saved: {output_dir}/boolean_features_analysis.png")
    plt.close()
    
    print("\nBoolean Feature Impact on Credit Score:")
    print("-"*70)
    for feature in bool_features:
        mean_yes = df[df[feature] == 1]['credit_score'].mean()
        mean_no = df[df[feature] == 0]['credit_score'].mean()
        diff = mean_yes - mean_no
        print(f"{feature:25s} Yes: {mean_yes:5.1f} | No: {mean_no:5.1f} | Diff: {diff:+6.1f}")
    print("-"*70)


def analyze_numerical_relationships(df, output_dir='models/analysis'):
    """Analyze relationships between numerical features and credit score"""
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n" + "="*70)
    print("NUMERICAL FEATURE RELATIONSHIPS")
    print("="*70)
    
    numerical_features = ['years_of_farming', 'annual_income_inr', 'land_area_acres', 
                         'existing_loans']
    
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    axes = axes.flatten()
    
    for i, feature in enumerate(numerical_features):
        axes[i].scatter(df[feature], df['credit_score'], alpha=0.5, s=30)
        
        # Add trend line
        z = np.polyfit(df[feature], df['credit_score'], 1)
        p = np.poly1d(z)
        axes[i].plot(df[feature].sort_values(), p(df[feature].sort_values()), 
                    "r--", linewidth=2, label=f'Trend: y={z[0]:.2f}x+{z[1]:.1f}')
        
        axes[i].set_xlabel(feature.replace('_', ' ').title(), fontsize=11, fontweight='bold')
        axes[i].set_ylabel('Credit Score', fontsize=11, fontweight='bold')
        axes[i].set_title(f'Credit Score vs {feature.replace("_", " ").title()}', 
                         fontsize=11, fontweight='bold')
        axes[i].legend()
        axes[i].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/numerical_relationships.png', dpi=300, bbox_inches='tight')
    print(f"✓ Saved: {output_dir}/numerical_relationships.png")
    plt.close()


def generate_summary_report(importance_df, corr_df, output_file='models/analysis/feature_analysis_report.txt'):
    """Generate comprehensive feature analysis report"""
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w') as f:
        f.write("="*70 + "\n")
        f.write("VAZHIKAATTI - FEATURE ANALYSIS REPORT\n")
        f.write("Credit Scoring Model for Women Farmers in Tamil Nadu\n")
        f.write("="*70 + "\n\n")
        
        f.write("TOP 5 MOST IMPORTANT FEATURES:\n")
        f.write("-"*70 + "\n")
        for idx, row in importance_df.head(5).iterrows():
            f.write(f"{idx+1}. {row['feature']:25s} {row['importance']:.4f}\n")
        f.write("\n")
        
        f.write("TOP 5 FEATURES BY CORRELATION WITH CREDIT SCORE:\n")
        f.write("-"*70 + "\n")
        for idx, (feature, row) in enumerate(corr_df.head(5).iterrows(), 1):
            f.write(f"{idx}. {feature:25s} {row['correlation']:+.4f}\n")
        f.write("\n")
        
        f.write("="*70 + "\n")
    
    print(f"\n✓ Feature analysis report saved to {output_file}")


def main():
    """Main analysis function"""
    print("="*70)
    print("VAZHIKAATTI - FEATURE ANALYSIS")
    print("="*70)
    
    # Load data
    model, df, feature_names = load_model_and_data()
    
    # Analyze feature importance
    importance_df = analyze_feature_importance(model, feature_names)
    
    # Analyze correlations
    corr_df = analyze_feature_correlations(df, feature_names)
    
    # Analyze categorical features
    analyze_categorical_features(df)
    
    # Analyze numerical relationships
    analyze_numerical_relationships(df)
    
    # Generate summary report
    generate_summary_report(importance_df, corr_df)
    
    print("\n" + "="*70)
    print("✓ FEATURE ANALYSIS COMPLETE")
    print("="*70)


if __name__ == "__main__":
    main()
