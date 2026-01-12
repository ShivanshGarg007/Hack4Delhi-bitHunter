"""
Welfare Fraud Detection Model - Trained on Financial Intelligence Dataset
Uses Machine Learning to detect welfare fraud patterns

Training Data: financial_intelligence.csv
Features: Income, Assets, DOB, etc.
Model: Scikit-learn Random Forest + XGBoost ensemble
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import xgboost as xgb
import joblib
import os
from datetime import datetime
from pathlib import Path

# Paths
DATA_DIR = Path(__file__).parent.parent / 'data'
MODEL_DIR = Path(__file__).parent / 'models'
MODEL_DIR.mkdir(exist_ok=True)

FINANCIAL_DATA = DATA_DIR / 'financial_intelligence.csv'
MODEL_PATH = MODEL_DIR / 'welfare_fraud_model.pkl'
SCALER_PATH = MODEL_DIR / 'scaler.pkl'


class WelfareFraudModel:
    """Machine learning model for welfare fraud detection."""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.trained = False
        
    def load_training_data(self):
        """Load and preprocess financial intelligence dataset."""
        print(f"Loading training data from {FINANCIAL_DATA}")
        df = pd.read_csv(FINANCIAL_DATA)
        
        # Display basic info
        print(f"Dataset shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        print(f"\nAsset Flag Distribution:")
        print(df['asset_flag'].value_counts())
        
        return df
    
    def engineer_features(self, df):
        """Create features from the financial intelligence data."""
        df_processed = df.copy()
        
        # Income features
        df_processed['income_level'] = pd.cut(df_processed['tax_filing_income'], 
                                              bins=[0, 1000000, 2000000, 3000000, 4000000, 5000000],
                                              labels=[0, 1, 2, 3, 4])
        df_processed['income_level'] = df_processed['income_level'].astype(int)
        
        # Age feature from DOB
        df_processed['dob'] = pd.to_datetime(df_processed['dob'])
        df_processed['age'] = (datetime.now() - df_processed['dob']).dt.days / 365.25
        
        # Asset risk scoring
        asset_risk_map = {
            'Property > 50L': 4,
            'Luxury Car': 3,
            'Mutual Funds > 5L': 2,
            'Standard': 0
        }
        df_processed['asset_risk_score'] = df_processed['asset_flag'].map(asset_risk_map).fillna(0)
        
        # Address complexity (number of commas = more complex address structure)
        df_processed['address_complexity'] = df_processed['address'].str.count(',')
        
        # Create target: Fraud if high risk asset with moderate-low income
        df_processed['is_fraud'] = (
            (df_processed['asset_risk_score'] >= 3) &  # Has luxury assets
            (df_processed['tax_filing_income'] < 3000000)  # But low declared income
        ).astype(int)
        
        # Additional risk indicators
        df_processed['income_asset_mismatch'] = (
            df_processed['asset_risk_score'] - 
            (df_processed['income_level'] * df_processed['asset_risk_score'].max())
        ).clip(lower=0)
        
        print(f"\nFraud distribution in training data:")
        print(df_processed['is_fraud'].value_counts())
        print(f"Fraud rate: {df_processed['is_fraud'].mean()*100:.2f}%")
        
        return df_processed
    
    def prepare_features(self, df_processed):
        """Prepare features for model training."""
        feature_cols = [
            'income_level',
            'age',
            'asset_risk_score',
            'address_complexity',
            'income_asset_mismatch'
        ]
        
        X = df_processed[feature_cols].fillna(0)
        y = df_processed['is_fraud']
        
        self.feature_names = feature_cols
        return X, y
    
    def train(self):
        """Train the ensemble model on financial intelligence data."""
        print("\n" + "="*70)
        print("TRAINING WELFARE FRAUD DETECTION MODEL")
        print("="*70)
        
        # Load and prepare data
        df = self.load_training_data()
        df_processed = self.engineer_features(df)
        X, y = self.prepare_features(df_processed)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train ensemble model
        print("\nTraining ensemble model (Random Forest + Gradient Boosting)...")
        
        # Random Forest
        rf_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=10,
            min_samples_leaf=5,
            random_state=42,
            class_weight='balanced'
        )
        
        # Gradient Boosting
        gb_model = GradientBoostingClassifier(
            n_estimators=150,
            max_depth=7,
            learning_rate=0.1,
            random_state=42
        )
        
        # Train individual models
        rf_model.fit(X_train_scaled, y_train)
        gb_model.fit(X_train_scaled, y_train)
        
        # Store models as attributes for serialization
        self.rf_model = rf_model
        self.gb_model = gb_model
        self.model = {'rf': rf_model, 'gb': gb_model}
        
        # Evaluate with ensemble
        rf_pred_proba = rf_model.predict_proba(X_test_scaled)[:, 1]
        gb_pred_proba = gb_model.predict_proba(X_test_scaled)[:, 1]
        ensemble_prob = (rf_pred_proba + gb_pred_proba) / 2
        y_pred = (ensemble_prob > 0.5).astype(int)
        y_pred_proba = ensemble_prob
        
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc_auc = roc_auc_score(y_test, y_pred_proba)
        
        print("\n" + "-"*70)
        print("MODEL PERFORMANCE METRICS")
        print("-"*70)
        print(f"Accuracy:  {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall:    {recall:.4f}")
        print(f"F1-Score:  {f1:.4f}")
        print(f"ROC-AUC:   {roc_auc:.4f}")
        print("-"*70)
        
        # Feature importance from Random Forest
        print("\nTop Feature Importance (Random Forest):")
        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': rf_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        for idx, row in importance_df.iterrows():
            print(f"  {row['feature']:25s} {row['importance']:6.4f}")
        
        # Save models
        print(f"\nSaving model to {MODEL_PATH}")
        joblib.dump({
            'rf_model': rf_model,
            'gb_model': gb_model,
            'scaler': self.scaler,
            'feature_names': self.feature_names
        }, MODEL_PATH)
        
        self.trained = True
        print("\n✅ Model training complete!")
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1,
            'roc_auc': roc_auc
        }
    
    def load_model(self):
        """Load pre-trained model."""
        if not MODEL_PATH.exists():
            print(f"Model not found at {MODEL_PATH}. Training new model...")
            return self.train()
        
        print(f"Loading model from {MODEL_PATH}")
        model_data = joblib.load(MODEL_PATH)
        self.rf_model = model_data['rf_model']
        self.gb_model = model_data['gb_model']
        self.scaler = model_data['scaler']
        self.feature_names = model_data['feature_names']
        self.model = {'rf': self.rf_model, 'gb': self.gb_model}
        self.trained = True
        return True
    
    def predict(self, applicant_data):
        """
        Predict fraud risk for an applicant.
        
        Args:
            applicant_data: dict with keys:
              - declared_income: float
              - dob: str (YYYY-MM-DD)
              - address: str
              - assets_detected: list of asset types
        
        Returns:
            dict with prediction results
        """
        if not self.trained:
            self.load_model()
        
        # Create feature vector
        from datetime import datetime as dt
        
        dob = dt.strptime(applicant_data['dob'], '%Y-%m-%d')
        age = (dt.now() - dob).days / 365.25
        
        # Asset risk scoring
        asset_risk_map = {
            'Property > 50L': 4,
            'Luxury Car': 3,
            'Mutual Funds > 5L': 2,
            'Standard': 0
        }
        asset_flag = applicant_data.get('asset_flag', 'Standard')
        asset_risk_score = asset_risk_map.get(asset_flag, 0)
        
        # Income level
        income = applicant_data['declared_income']
        if income < 1000000:
            income_level = 0
        elif income < 2000000:
            income_level = 1
        elif income < 3000000:
            income_level = 2
        elif income < 4000000:
            income_level = 3
        else:
            income_level = 4
        
        # Address complexity
        address = applicant_data.get('address', '')
        address_complexity = address.count(',')
        
        # Income-asset mismatch
        income_asset_mismatch = max(0, asset_risk_score - (income_level * asset_risk_score))
        
        # Create feature vector
        features = np.array([[
            income_level,
            age,
            asset_risk_score,
            address_complexity,
            income_asset_mismatch
        ]])
        
        # Scale
        features_scaled = self.scaler.transform(features)
        
        # Predict using ensemble
        rf_prob = self.rf_model.predict_proba(features_scaled)[:, 1][0]
        gb_prob = self.gb_model.predict_proba(features_scaled)[:, 1][0]
        fraud_prob = (rf_prob + gb_prob) / 2
        prediction = 1 if fraud_prob > 0.5 else 0
        if fraud_prob > 0.7:
            risk_status = 'red'
            risk_level = 'HIGH'
        elif fraud_prob > 0.4:
            risk_status = 'yellow'
            risk_level = 'MEDIUM'
        else:
            risk_status = 'green'
            risk_level = 'LOW'
        
        # Generate flags
        flags = []
        
        if asset_risk_score >= 3:
            flags.append({
                'type': 'high_value_asset',
                'severity': 'high',
                'details': f'Possesses {asset_flag}'
            })
        
        if income_asset_mismatch > 2:
            flags.append({
                'type': 'income_asset_mismatch',
                'severity': 'high',
                'details': f'Asset value exceeds declared income capacity'
            })
        
        if age < 25 and asset_risk_score > 0:
            flags.append({
                'type': 'young_age_high_assets',
                'severity': 'medium',
                'details': f'Age {age:.1f} with significant assets'
            })
        
        return {
            'fraud_probability': round(fraud_prob, 4),
            'risk_status': risk_status,
            'risk_level': risk_level,
            'is_fraud': bool(prediction),
            'flags': flags,
            'feature_values': {
                'income_level': income_level,
                'age': round(age, 1),
                'asset_risk_score': asset_risk_score,
                'address_complexity': address_complexity,
                'income_asset_mismatch': round(income_asset_mismatch, 2)
            }
        }


def train_model():
    """Standalone function to train the model."""
    model = WelfareFraudModel()
    return model.train()


if __name__ == '__main__':
    # Train the model
    model = WelfareFraudModel()
    metrics = model.train()
    
    # Test prediction
    print("\n" + "="*70)
    print("TESTING MODEL ON SAMPLE APPLICANT")
    print("="*70)
    
    test_applicant = {
        'declared_income': 2500000,
        'dob': '1990-05-15',
        'address': 'Delhi, India',
        'asset_flag': 'Luxury Car'
    }
    
    result = model.predict(test_applicant)
    print(f"\nSample applicant prediction:")
    print(f"  Income: ₹{test_applicant['declared_income']:,}")
    print(f"  Assets: {test_applicant['asset_flag']}")
    print(f"  Fraud Probability: {result['fraud_probability']:.2%}")
    print(f"  Risk Level: {result['risk_level']} ({result['risk_status']})")
    print(f"  Is Fraud: {result['is_fraud']}")
    print(f"  Flags: {len(result['flags'])} detected")
