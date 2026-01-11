from flask import Flask, request, jsonify
import joblib
app = Flask(__name__)



model = joblib.load("fraud_model.pkl")

test_case = [[600000, 6, 1, 1]]
prob = model.predict_proba(test_case)[0][1]

print("Fraud probability:", round(prob * 100, 2), "%")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = [[
        data["income"],
        data["same_day_visits"],
        data["shared_mobile"],
        data["previous_defaults"]
    ]]

    prob = model.predict_proba(features)[0][1]

    if prob > 0.75:
        level = "High Risk"
    elif prob > 0.4:
        level = "Medium Risk"
    else:
        level = "Low Risk"

    return jsonify({
        "status": "Rejected" if prob > 0.5 else "Approved",
        "fraud_risk": round(prob * 100, 2),
        "risk_level": level
    })
if __name__ == "__main__":
    app.run(debug=True)
@app.post("/ml-predict")
async def ml_predict(request: Request):
    data = await request.json()

    features = [[
        data["income"],
        data["same_day_visits"],
        data["shared_mobile"],
        data["previous_defaults"]
    ]]

    prob = model.predict_proba(features)[0][1]

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
