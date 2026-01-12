from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import pandas as pd
import os
from pydantic import BaseModel

# from backend.logic.adapters import check_vahan_status, check_discom_status
# # from logic.adapters import check_vahan_status, check_discom_status
from backend.logic.adapters import check_vahan_status, check_discom_status





app = FastAPI(title="Samagra-Setu", description="Federated Fraud Detection System PoC", docs_url="/docs")

# Define path to applicant data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPLICANTS_CSV = os.path.join(BASE_DIR, 'data', 'welfare_applicants.csv')

# Mount Frontend
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "frontend")), name="static")

@app.get("/")
def read_root():
    from fastapi.responses import FileResponse
    return FileResponse(os.path.join(BASE_DIR, 'frontend', 'index.html'))

@app.get("/styles.css")
def read_css():
    from fastapi.responses import FileResponse
    return FileResponse(os.path.join(BASE_DIR, 'frontend', 'styles.css'))

@app.get("/app.js")
def read_js():
    from fastapi.responses import FileResponse
    return FileResponse(os.path.join(BASE_DIR, 'frontend', 'app.js'))

@app.get("/analyze_applicants")
def analyze_applicants():
    """
    Reads welfare applicants and checks them against Vahan and Discom databases.
    Returns Risk Status (Red, Yellow, Green).
    """
    results = []
    
    try:
        df = pd.read_csv(APPLICANTS_CSV)
        
        for _, row in df.iterrows():
            applicant = {
                'ID': row['ID'],
                'Name': row['Name'],
                'Address': row['Address'],
                'Declared_Income': row['Declared_Income']
            }
            
            applicant_identity = {
                'Name': row['Name'],
                'Address': row['Address']
            }
            
            flags = []
            
            # Check Vahan Registry
            vahan_result = check_vahan_status(applicant_identity)
            if vahan_result:
                flags.append(vahan_result)
                
            # Check Discom DB
            discom_result = check_discom_status(applicant_identity)
            if discom_result:
                flags.append(discom_result)
            
            # Determine Risk Status
            risk_level = "green"
            if flags:
                # Logic: If flags exist, it's at least Yellow.
                # If evidence is strong (e.g. Commercial Vehicle), it's Red.
                # For PoC, we mark any flag as Red for now, unless purely ambiguous.
                # To match the "Yellow" requirement: logic could be based on confidence score.
                # let's say if any match confidence < 90 but flagged, it's yellow?
                # For this PoC, let's simplify: Any flag = Red (Fraud Detected)
                # But to demo 'Yellow', let's say: if address match is imperfect but flagged?
                
                is_red = False
                for f in flags:
                    # Parse confidence from string details "Name: X%, Addr: Y%"
                    # This is a hack for PoC. Ideally we pass raw scores.
                    if "Commercial Vehicle" in f['reason'] or "High Bill" in f['reason']:
                        is_red = True
                
                risk_level = "red" if is_red else "yellow"

            # Create entry for frontend
            results.append({
                "applicant_id": str(applicant['ID']),
                "name": applicant['Name'],
                "address": applicant['Address'],
                "declared_income": applicant['Declared_Income'],
                "risk_level": risk_level,
                "flags": flags
            })
                
    except FileNotFoundError:
        return {"error": "Applicant data not found."}
    except Exception as e:
        return {"error": str(e)}

    return applicants


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


from fastapi import Request
import joblib

# Load ML model (once)

# Load ML model
ml_model = joblib.load("backend/fraud_model.pkl")

# Input schema
class ApplicantInput(BaseModel):
    income: int
    same_day_visits: int
    shared_mobile: int
    previous_defaults: int

# ML prediction endpoint
@app.post("/ml-predict")
async def ml_predict(data: ApplicantInput):
    try:
        features = [[
            int(data.income),
            int(data.same_day_visits),
            int(data.shared_mobile),
            int(data.previous_defaults)
        ]]

        prob = float(ml_model.predict_proba(features)[0][1])

        if prob > 0.75:
            level = "High Risk"
        elif prob > 0.4:
            level = "Medium Risk"
        else:
            level = "Low Risk"

        return {
            "status": "Rejected" if prob > 0.5 else "Approved",
            "fraud_risk": round(prob * 100, 2),
            "risk_level": level
        }

    except Exception as e:
        return {
            "error": str(e)
        }
