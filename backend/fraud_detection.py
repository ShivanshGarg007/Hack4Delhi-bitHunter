import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class FraudDetectionEngine:
    def __init__(self):
        self.isolation_forest = IsolationForest(contamination=0.1, random_state=42)
        self.tfidf_vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        
    def detect_cost_anomaly(self, contracts: List[Dict]) -> Dict:
        if len(contracts) < 10:
            return {}
        
        contract_values = np.array([c.get('contract_value', 0) for c in contracts]).reshape(-1, 1)
        
        try:
            self.isolation_forest.fit(contract_values)
            anomaly_scores = self.isolation_forest.predict(contract_values)
            anomaly_scores_prob = self.isolation_forest.score_samples(contract_values)
            
            results = {}
            for i, contract in enumerate(contracts):
                is_anomaly = anomaly_scores[i] == -1
                anomaly_score = float(anomaly_scores_prob[i])
                
                normalized_score = max(0, min(100, int((1 - (anomaly_score + 0.5)) * 100)))
                
                results[contract['id']] = {
                    'is_anomaly': is_anomaly,
                    'anomaly_score': normalized_score,
                    'explanation': f"Contract value ${contract.get('contract_value', 0):,.0f} {'significantly deviates' if is_anomaly else 'is within normal range'} from typical contract values"
                }
            
            return results
        except Exception as e:
            logger.error(f"Cost anomaly detection failed: {e}")
            return {}
    
    def detect_tender_similarity(self, contracts: List[Dict]) -> Dict:
        if len(contracts) < 2:
            return {}
        
        tender_texts = []
        contract_map = []
        
        for contract in contracts:
            tender_text = f"{contract.get('project_name', '')} {contract.get('description', '')}"
            if tender_text.strip():
                tender_texts.append(tender_text)
                contract_map.append(contract['id'])
        
        if len(tender_texts) < 2:
            return {}
        
        try:
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(tender_texts)
            similarity_matrix = cosine_similarity(tfidf_matrix)
            
            results = {}
            for i, contract_id in enumerate(contract_map):
                similarities = similarity_matrix[i]
                max_sim_idx = np.argmax([s if j != i else 0 for j, s in enumerate(similarities)])
                max_similarity = similarities[max_sim_idx]
                
                similarity_score = int(max_similarity * 100)
                is_suspicious = max_similarity > 0.8
                
                results[contract_id] = {
                    'is_suspicious': is_suspicious,
                    'similarity_score': similarity_score,
                    'similar_to': contract_map[max_sim_idx] if is_suspicious else None,
                    'explanation': f"Tender text shows {similarity_score}% similarity to other tenders" + (" (potentially duplicate or copied)" if is_suspicious else "")
                }
            
            return results
        except Exception as e:
            logger.error(f"Tender similarity detection failed: {e}")
            return {}
    
    def detect_rule_based_flags(self, contract: Dict, vendor: Dict, all_contracts: List[Dict]) -> Dict:
        flags = {}
        
        single_bidder = contract.get('bidder_count', 2) == 1
        flags['single_bidder'] = single_bidder
        
        vendor_contracts = [c for c in all_contracts if c.get('contractor_id') == vendor.get('id')]
        same_dept_contracts = [c for c in vendor_contracts if c.get('department') == contract.get('department')]
        repeated_vendor = len(same_dept_contracts) > 3
        flags['repeated_vendor'] = repeated_vendor
        
        start_date = contract.get('start_date')
        expected_completion = contract.get('expected_completion')
        actual_completion = contract.get('actual_completion')
        
        if start_date and expected_completion:
            from datetime import datetime
            try:
                if actual_completion:
                    actual = datetime.fromisoformat(actual_completion.replace('Z', '+00:00'))
                    expected = datetime.fromisoformat(expected_completion.replace('Z', '+00:00'))
                    delay_days = (actual - expected).days
                else:
                    now = datetime.now()
                    expected = datetime.fromisoformat(expected_completion.replace('Z', '+00:00'))
                    if now > expected:
                        delay_days = (now - expected).days
                    else:
                        delay_days = 0
                
                flags['timeline_overrun'] = delay_days > 30
                flags['delay_days'] = delay_days
            except:
                flags['timeline_overrun'] = False
                flags['delay_days'] = 0
        else:
            flags['timeline_overrun'] = False
            flags['delay_days'] = 0
        
        original_budget = contract.get('original_budget', contract.get('contract_value', 0))
        current_value = contract.get('contract_value', 0)
        if original_budget > 0:
            escalation_pct = ((current_value - original_budget) / original_budget) * 100
            flags['budget_escalation'] = escalation_pct > 20
            flags['escalation_percentage'] = round(escalation_pct, 2)
        else:
            flags['budget_escalation'] = False
            flags['escalation_percentage'] = 0
        
        return flags
    
    def calculate_fraud_risk_score(self, contract: Dict, flags: Dict, anomaly_data: Dict, similarity_data: Dict, citizen_reports_count: int) -> Dict:
        score = 0
        explanations = []
        
        if flags.get('single_bidder'):
            score += 20
            explanations.append("Single bidder tender (High Risk: +20)")
        
        if flags.get('repeated_vendor'):
            score += 15
            explanations.append("Repeated vendor from same department (Medium Risk: +15)")
        
        if flags.get('timeline_overrun'):
            delay = flags.get('delay_days', 0)
            delay_score = min(15, int(delay / 30) * 5)
            score += delay_score
            explanations.append(f"Timeline overrun by {delay} days (Risk: +{delay_score})")
        
        if flags.get('budget_escalation'):
            escalation = flags.get('escalation_percentage', 0)
            escalation_score = min(20, int(escalation / 10) * 5)
            score += escalation_score
            explanations.append(f"Budget escalation of {escalation}% (Risk: +{escalation_score})")
        
        if anomaly_data.get('is_anomaly'):
            anomaly_score = min(20, anomaly_data.get('anomaly_score', 0) // 5)
            score += anomaly_score
            explanations.append(f"Cost anomaly detected (Risk: +{anomaly_score})")
        
        if similarity_data.get('is_suspicious'):
            score += 15
            explanations.append(f"High tender similarity detected (Risk: +15)")
        
        if citizen_reports_count > 0:
            report_score = min(15, citizen_reports_count * 5)
            score += report_score
            explanations.append(f"{citizen_reports_count} citizen complaint(s) (Risk: +{report_score})")
        
        risk_level = "Low"
        if score >= 70:
            risk_level = "High"
        elif score >= 40:
            risk_level = "Medium"
        
        return {
            'fraud_risk_score': min(100, score),
            'risk_level': risk_level,
            'explanations': explanations,
            'flags': flags
        }