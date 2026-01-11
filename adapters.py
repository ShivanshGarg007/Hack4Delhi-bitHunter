import pandas as pd
import os
from backend.logic.resolver import resolve_identity

# Define paths to mock databases
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VAHAN_CSV = os.path.join(BASE_DIR, 'data', 'vahan_registry.csv')
DISCOM_CSV = os.path.join(BASE_DIR, 'data', 'discom_users.csv')

def check_vahan_status(applicant_identity):
    """
    Checks if the applicant owns a commercial vehicle or has high value assets.
    Returns specific flags only (Privacy Compliance).
    """
    try:
        df = pd.read_csv(VAHAN_CSV)
        for _, row in df.iterrows():
            target_entry = {
                'Name': row['Owner_Name'],
                'Address': row['Owner_Address']
            }
            res = resolve_identity(applicant_identity, target_entry)
            if res['match']:
                if row['Vehicle_Type'] == 'Commercial':
                    return {
                        "flagged": True, 
                        "reason": "Owns Commercial Vehicle",
                        "evidence": f"Found in Vahan Registry: {row['Vehicle_Type']} - {row['Vehicle_Model']}",
                        "match_details": res['details']
                    }
    except FileNotFoundError:
        print(f"Error: {VAHAN_CSV} not found.")
    return None

def check_discom_status(applicant_identity):
    """
    Checks if the applicant has a high electricity bill (> 10k).
    """
    try:
        df = pd.read_csv(DISCOM_CSV)
        for _, row in df.iterrows():
            target_entry = {
                'Name': row['Customer_Name'],
                'Address': row['Customer_Address']
            }
            res = resolve_identity(applicant_identity, target_entry)
            if res['match']:
                if row['Avg_Monthly_Bill'] > 10000:
                    return {
                        "flagged": True, 
                        "reason": f"High Bill > 10k",
                        "evidence": f"Avg Monthly Bill: ₹{row['Avg_Monthly_Bill']}",
                        "match_details": res['details']
                    }
    except FileNotFoundError:
        print(f"Error: {DISCOM_CSV} not found.")
    return None
