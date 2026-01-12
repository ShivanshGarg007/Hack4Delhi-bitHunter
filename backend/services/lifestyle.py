"""
Lifestyle Mismatch Scanner Service
Absorbed from: lifestyle_mismatch (SATARK-360)

Performs 360° profile scans:
- AI identity resolution
- Family cluster identification
- Asset detection (vehicles, electricity)
- Risk scoring
"""

import pandas as pd
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timezone

from core.logging import get_logger

logger = get_logger("services.lifestyle")

# Data paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
CIVIL_REGISTRY_CSV = os.path.join(DATA_DIR, 'civil_registry.csv')
VAHAN_REGISTRY_CSV = os.path.join(DATA_DIR, 'vahan_registry.csv')
DISCOM_DATA_CSV = os.path.join(DATA_DIR, 'discom_data.csv')


class LifestyleScanner:
    """
    360° Profile Scanner for detecting lifestyle mismatches.
    
    Checks applicants against:
    - Civil Registry (identity verification, family clustering)
    - Vahan Registry (vehicle ownership)
    - Discom Data (electricity consumption patterns)
    """
    
    def __init__(self):
        self._load_data()
    
    def _load_data(self):
        """Load reference data from CSV files."""
        try:
            # Civil Registry (Master list of citizens)
            if os.path.exists(CIVIL_REGISTRY_CSV):
                self.df_civil = pd.read_csv(CIVIL_REGISTRY_CSV)
                self.df_civil["unique_id"] = self.df_civil["unique_id"].astype(str)
            else:
                self.df_civil = pd.DataFrame(columns=["name", "family_id", "unique_id", "address"])
            
            # Vahan Registry (Vehicle owners)
            if os.path.exists(VAHAN_REGISTRY_CSV):
                self.df_vahan = pd.read_csv(VAHAN_REGISTRY_CSV)
                if 'owner_id' in self.df_vahan.columns:
                    self.df_vahan["owner_id"] = self.df_vahan["owner_id"].astype(str)
            else:
                self.df_vahan = pd.DataFrame(columns=["owner_id", "vehicle_model"])
            
            # Discom Data (Electricity bills)
            if os.path.exists(DISCOM_DATA_CSV):
                self.df_discom = pd.read_csv(DISCOM_DATA_CSV)
            else:
                self.df_discom = pd.DataFrame(columns=["address", "avg_monthly_bill"])
            
            logger.info(f"Loaded: {len(self.df_civil)} citizens, {len(self.df_vahan)} vehicles, {len(self.df_discom)} discom records")
            
        except Exception as e:
            logger.error(f"Failed to load data: {e}")
            self.df_civil = pd.DataFrame()
            self.df_vahan = pd.DataFrame()
            self.df_discom = pd.DataFrame()
    
    def _identify_citizen(self, applicant_name: str) -> Tuple[Optional[pd.Series], str]:
        """
        AI-powered identity resolution.
        Matches input name to existing citizen in Civil Registry.
        
        Returns:
            Tuple of (matched_person, match_type)
        """
        if self.df_civil.empty:
            return None, "NO_DATA"
        
        clean_input = applicant_name.lower().strip()
        
        # 1. EXACT MATCH
        exact = self.df_civil[self.df_civil['name'].str.lower() == clean_input]
        if not exact.empty:
            logger.info(f"Exact match found for '{applicant_name}'")
            return exact.iloc[0], "EXACT_MATCH"
        
        # 2. PREFIX MATCH (for partial names like "Turvi L")
        if len(clean_input) >= 3:
            prefix = self.df_civil[self.df_civil['name'].str.lower().str.startswith(clean_input)]
            if not prefix.empty:
                logger.info(f"Prefix match: '{clean_input}' -> '{prefix.iloc[0]['name']}'")
                return prefix.iloc[0], "PREFIX_MATCH"
        
        # 3. FUZZY MATCH (Simple word overlap)
        input_words = set(clean_input.split())
        best_match = None
        best_score = 0
        
        for _, row in self.df_civil.iterrows():
            name = row.get('name', '')
            if not name:
                continue
            
            name_words = set(str(name).lower().split())
            overlap = len(input_words & name_words)
            score = overlap / max(len(input_words), len(name_words))
            
            if score > best_score and score > 0.5:
                best_score = score
                best_match = row
        
        if best_match is not None:
            logger.info(f"Fuzzy match: '{applicant_name}' -> '{best_match['name']}' (score: {best_score:.2f})")
            return best_match, "FUZZY_MATCH"
        
        # No match found
        return None, "NEW_APPLICANT"
    
    def _get_family_cluster(self, person: pd.Series) -> List[str]:
        """Get all family members of a person."""
        if self.df_civil.empty:
            return [person.get('name', 'Unknown')]
        
        family_id = person.get('family_id')
        if not family_id:
            return [person.get('name', 'Unknown')]
        
        family = self.df_civil[self.df_civil['family_id'] == family_id]
        return family['name'].tolist()
    
    def _check_family_assets(self, family_members: pd.DataFrame) -> Tuple[List[str], int]:
        """
        Check assets for all family members.
        
        Returns:
            Tuple of (flags_list, risk_score)
        """
        flags = []
        risk_score = 0
        
        for _, member in family_members.iterrows():
            member_id = str(member.get('unique_id', ''))
            member_name = member.get('name', 'Unknown')
            member_address = member.get('address', '')
            
            # Check Vahan (Vehicles)
            if not self.df_vahan.empty and 'owner_id' in self.df_vahan.columns:
                cars = self.df_vahan[self.df_vahan['owner_id'] == member_id]
                if not cars.empty:
                    vehicle = cars.iloc[0].get('vehicle_model', 'Vehicle')
                    flags.append(f"🚗 Family Member ({member_name}) owns {vehicle}")
                    risk_score += 50
            
            # Check Discom (Electricity)
            if not self.df_discom.empty and member_address:
                bills = self.df_discom[self.df_discom['address'] == member_address]
                if not bills.empty:
                    avg_bill = bills.iloc[0].get('avg_monthly_bill', 0)
                    if avg_bill > 8000:
                        flags.append(f"⚡ High Monthly Bill Detected: ₹{avg_bill}")
                        risk_score += 40
        
        return flags, risk_score
    
    async def scan(self, name: str, dob: str, address: str) -> Dict[str, Any]:
        """
        Perform 360° profile scan on an applicant.
        
        Args:
            name: Applicant's name
            dob: Date of birth (ISO format)
            address: Declared address
        
        Returns:
            Scan result with integrity status, risk score, family cluster, etc.
        """
        logger.info(f"Processing application: '{name}'")
        
        # Step 1: Identity Resolution
        person, match_type = self._identify_citizen(name)
        
        # Step 2: Handle new applicants (no prior records)
        if person is None:
            logger.info(f"Unknown applicant '{name}' - treating as new entry")
            return {
                "integrity_status": "CLEAN",
                "risk_score": 0,
                "family_cluster": [name],
                "assets_detected": [],
                "system_message": "No prior financial records found. Applicant is ELIGIBLE for enrollment.",
                "match_type": match_type
            }
        
        # Step 3: Get family cluster
        family_id = person.get('family_id')
        if family_id and not self.df_civil.empty:
            family_members = self.df_civil[self.df_civil['family_id'] == family_id]
        else:
            family_members = pd.DataFrame([person])
        
        family_names = family_members['name'].tolist()
        logger.info(f"Family cluster: {family_names}")
        
        # Step 4: Check family assets
        flags, risk_score = self._check_family_assets(family_members)
        
        # Step 5: Determine status
        if risk_score >= 50:
            status = "CRITICAL FRAUD"
            message = "Ineligible due to high-value assets linked to family."
        elif risk_score > 0:
            status = "REVIEW REQUIRED"
            message = "Minor asset flags detected. Manual verification needed."
        else:
            status = "CLEAN"
            message = "Identity verified. No hidden assets found. ELIGIBLE."
        
        return {
            "integrity_status": status,
            "risk_score": risk_score,
            "family_cluster": family_names,
            "assets_detected": flags,
            "system_message": message,
            "match_type": match_type
        }
    
    async def scan_with_ai(self, name: str, dob: str, address: str) -> Dict[str, Any]:
        """
        Enhanced scan using Splink AI matching (if available).
        Falls back to basic scan if Splink not installed.
        """
        try:
            from splink import DuckDBAPI, Linker, SettingsCreator
            import splink.comparison_library as cl
            
            # Use AI matching for identity resolution
            logger.info("🧠 Running AI-powered identity scan...")
            
            # Create a temporary entry for the applicant
            new_entry = pd.DataFrame([{"name": name, "unique_id": "TEMP"}])
            
            # Configure Splink with fuzzy matching
            settings = SettingsCreator(
                link_type="link_only",
                blocking_rules_to_generate_predictions=[],
                comparisons=[cl.JaroWinklerAtThresholds("name", [0.60])]
            )
            
            try:
                linker = Linker([new_entry, self.df_civil], settings, DuckDBAPI())
                results = linker.inference.predict(threshold_match_probability=0.01).as_pandas_dataframe()
                
                if not results.empty:
                    best = results.sort_values(by="match_probability", ascending=False).iloc[0]
                    
                    if best['match_probability'] > 0.6:
                        matched_name = best['name_r']
                        logger.info(f"AI matched '{name}' -> '{matched_name}' (Score: {best['match_probability']:.2f})")
                        
                        # Get matched person and continue with regular scan
                        matched_person = self.df_civil[self.df_civil['name'] == matched_name].iloc[0]
                        
                        # Continue with family/asset checks using the AI-matched identity
                        family_id = matched_person.get('family_id')
                        if family_id:
                            family_members = self.df_civil[self.df_civil['family_id'] == family_id]
                        else:
                            family_members = pd.DataFrame([matched_person])
                        
                        family_names = family_members['name'].tolist()
                        flags, risk_score = self._check_family_assets(family_members)
                        
                        if risk_score >= 50:
                            status = "CRITICAL FRAUD"
                            message = "Ineligible due to high-value assets linked to family."
                        elif risk_score > 0:
                            status = "REVIEW REQUIRED"
                            message = "Minor asset flags detected. Manual verification needed."
                        else:
                            status = "CLEAN"
                            message = "Identity verified via AI. No hidden assets found. ELIGIBLE."
                        
                        return {
                            "integrity_status": status,
                            "risk_score": risk_score,
                            "family_cluster": family_names,
                            "assets_detected": flags,
                            "system_message": message,
                            "match_type": "AI_MATCH",
                            "ai_confidence": best['match_probability']
                        }
            
            except Exception as e:
                logger.warning(f"AI matching failed: {e}, falling back to basic scan")
        
        except ImportError:
            logger.info("Splink not available, using basic scan")
        
        # Fallback to basic scan
        return await self.scan(name, dob, address)
