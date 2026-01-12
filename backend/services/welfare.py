"""
Welfare Fraud Checker Service
Absorbed from: h4d (Samagra-Setu)

Enhanced with ML-based fraud detection using financial intelligence dataset.

Checks welfare applicants against:
- Vahan Registry (vehicle ownership)
- Discom Database (electricity consumption)
- ML Model (trained on financial intelligence with 1,050 records)
"""

import pandas as pd
import os
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone

from core.logging import get_logger
from services.welfare_ml_model import WelfareFraudModel

logger = get_logger("services.welfare")

# Data paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
APPLICANTS_CSV = os.path.join(DATA_DIR, 'welfare_applicants.csv')
VAHAN_CSV = os.path.join(DATA_DIR, 'vahan_registry.csv')
DISCOM_CSV = os.path.join(DATA_DIR, 'discom_users.csv')


class IdentityResolver:
    """
    Fuzzy identity matching between records.
    Uses string similarity for name and address matching.
    """
    
    @staticmethod
    def normalize(text: str) -> str:
        """Normalize text for comparison."""
        if not text:
            return ""
        return str(text).lower().strip()
    
    @staticmethod
    def similarity(s1: str, s2: str) -> float:
        """Calculate simple Jaccard similarity between two strings."""
        if not s1 or not s2:
            return 0.0
        
        s1_norm = IdentityResolver.normalize(s1)
        s2_norm = IdentityResolver.normalize(s2)
        
        # Exact match
        if s1_norm == s2_norm:
            return 1.0
        
        # Word-level Jaccard similarity
        words1 = set(s1_norm.split())
        words2 = set(s2_norm.split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        return intersection / union if union > 0 else 0.0
    
    @classmethod
    def resolve_identity(
        cls, 
        applicant: Dict[str, str], 
        target: Dict[str, str],
        name_threshold: float = 0.7,
        address_threshold: float = 0.5
    ) -> Dict[str, Any]:
        """
        Check if applicant matches target record.
        
        Args:
            applicant: Dict with 'Name' and 'Address'
            target: Dict with 'Name' and 'Address'
            name_threshold: Minimum similarity for name match
            address_threshold: Minimum similarity for address match
        
        Returns:
            Dict with 'match' (bool) and 'details' (confidence scores)
        """
        name_sim = cls.similarity(applicant.get('Name', ''), target.get('Name', ''))
        addr_sim = cls.similarity(applicant.get('Address', ''), target.get('Address', ''))
        
        is_match = name_sim >= name_threshold and addr_sim >= address_threshold
        
        return {
            'match': is_match,
            'details': f"Name: {name_sim*100:.0f}%, Addr: {addr_sim*100:.0f}%"
        }


class WelfareChecker:
    """
    Main service for welfare fraud detection.
    Checks applicants against vehicle and electricity databases.
    """
    
    def __init__(self):
        self.resolver = IdentityResolver()
        self._load_data()
    
    def _load_data(self):
        """Load reference data from CSV files."""
        try:
            self.applicants_df = pd.read_csv(APPLICANTS_CSV) if os.path.exists(APPLICANTS_CSV) else pd.DataFrame()
            self.vahan_df = pd.read_csv(VAHAN_CSV) if os.path.exists(VAHAN_CSV) else pd.DataFrame()
            self.discom_df = pd.read_csv(DISCOM_CSV) if os.path.exists(DISCOM_CSV) else pd.DataFrame()
            logger.info(f"Loaded data: {len(self.applicants_df)} applicants, {len(self.vahan_df)} vehicles, {len(self.discom_df)} discom records")
        except Exception as e:
            logger.error(f"Failed to load data: {e}")
            self.applicants_df = pd.DataFrame()
            self.vahan_df = pd.DataFrame()
            self.discom_df = pd.DataFrame()
    
    def check_vahan_status(self, applicant_identity: Dict[str, str]) -> Optional[Dict]:
        """
        Check if applicant owns a commercial vehicle or high-value asset.
        
        Args:
            applicant_identity: Dict with 'Name' and 'Address'
        
        Returns:
            Flag dict if suspicious, None otherwise
        """
        if self.vahan_df.empty:
            return None
        
        for _, row in self.vahan_df.iterrows():
            target = {
                'Name': row.get('Owner_Name', ''),
                'Address': row.get('Owner_Address', '')
            }
            result = self.resolver.resolve_identity(applicant_identity, target)
            
            if result['match']:
                vehicle_type = row.get('Vehicle_Type', 'Unknown')
                vehicle_model = row.get('Vehicle_Model', 'Unknown')
                
                if vehicle_type == 'Commercial':
                    return {
                        "flagged": True,
                        "reason": "Owns Commercial Vehicle",
                        "evidence": f"Found in Vahan Registry: {vehicle_type} - {vehicle_model}",
                        "match_details": result['details']
                    }
        
        return None
    
    def check_discom_status(self, applicant_identity: Dict[str, str]) -> Optional[Dict]:
        """
        Check if applicant has high electricity consumption.
        
        Args:
            applicant_identity: Dict with 'Name' and 'Address'
        
        Returns:
            Flag dict if suspicious, None otherwise
        """
        if self.discom_df.empty:
            return None
        
        for _, row in self.discom_df.iterrows():
            target = {
                'Name': row.get('Customer_Name', ''),
                'Address': row.get('Customer_Address', '')
            }
            result = self.resolver.resolve_identity(applicant_identity, target)
            
            if result['match']:
                avg_bill = row.get('Avg_Monthly_Bill', 0)
                
                if avg_bill > 10000:
                    return {
                        "flagged": True,
                        "reason": f"High Bill > 10k",
                        "evidence": f"Avg Monthly Bill: ₹{avg_bill}",
                        "match_details": result['details']
                    }
        
        return None
    
    async def scan_applicant(self, applicant: Dict[str, Any]) -> Dict[str, Any]:
        """
        Scan a single applicant for fraud indicators using ML model.
        
        Enhanced with machine learning model trained on financial intelligence dataset.
        
        Args:
            applicant: Dict with ID, Name, Address, Declared_Income, DOB, Asset_Flag (optional)
        
        Returns:
            Scan result with risk status and flags
        """
        try:
            # Initialize ML model
            ml_model = WelfareFraudModel()
            ml_model.load_model()
            
            # Prepare data for ML prediction
            ml_input = {
                'declared_income': applicant.get('Declared_Income', applicant.get('declared_income', 0)),
                'dob': applicant.get('DOB', applicant.get('dob', '1990-01-01')),
                'address': applicant.get('Address', applicant.get('address', '')),
                'asset_flag': applicant.get('Asset_Flag', applicant.get('asset_flag', 'Standard'))
            }
            
            # Get ML prediction
            ml_result = ml_model.predict(ml_input)
            
            # Use ML model's risk assessment as primary
            risk_status = ml_result['risk_status']
            flags = []
            
            # Add ML-detected flags
            for ml_flag in ml_result.get('flags', []):
                flags.append({
                    'type': ml_flag['type'],
                    'severity': ml_flag['severity'],
                    'reason': ml_flag['details'],
                    'source': 'ML Model'
                })
            
        except Exception as e:
            logger.warning(f"ML model error: {str(e)}. Falling back to traditional checks.")
            
            # Fallback to traditional checks
            ml_result = {
                'fraud_probability': 0.0,
                'risk_status': 'green',
                'risk_level': 'LOW'
            }
            risk_status = 'green'
            flags = []
        
        # Traditional checks as secondary validation
        applicant_identity = {
            'Name': applicant.get('Name', applicant.get('name', '')),
            'Address': applicant.get('Address', applicant.get('address', ''))
        }
        
        vahan_result = self.check_vahan_status(applicant_identity)
        if vahan_result:
            flags.append({**vahan_result, 'source': 'Vahan Registry'})
        
        discom_result = self.check_discom_status(applicant_identity)
        if discom_result:
            flags.append({**discom_result, 'source': 'Discom Database'})
        
        return {
            "applicant_id": str(applicant.get('ID', applicant.get('applicant_id', ''))),
            "name": applicant.get('Name', applicant.get('name', '')),
            "address": applicant.get('Address', applicant.get('address', '')),
            "declared_income": ml_input['declared_income'],
            "risk_status": risk_status,
            "flags": flags,
            "ml_fraud_probability": ml_result['fraud_probability'],
            "ml_risk_level": ml_result['risk_level']
        }
    
    async def analyze_all_applicants(self) -> List[Dict[str, Any]]:
        """
        Analyze all applicants from the welfare applicants database.
        
        Returns:
            List of scan results for all applicants
        """
        results = []
        
        if self.applicants_df.empty:
            logger.warning("No applicants data available")
            return results
        
        for _, row in self.applicants_df.iterrows():
            applicant = {
                'ID': row.get('ID', ''),
                'Name': row.get('Name', ''),
                'Address': row.get('Address', ''),
                'Declared_Income': row.get('Declared_Income', 0)
            }
            
            result = await self.scan_applicant(applicant)
            results.append(result)
        
        logger.info(f"Analyzed {len(results)} applicants")
        return results
