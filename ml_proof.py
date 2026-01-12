import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Synthetic dataset (anti-gravity signals)
data = {
    "income": [500000, 450000, 760000, 480000, 720000, 460000, 800000, 430000],
    "same_day_visits": [1, 6, 1, 7, 1, 5, 1, 6],
    "shared_mobile": [0, 1, 0, 1, 0, 1, 0, 1],
    "previous_defaults": [0, 1, 0, 1, 0, 1, 0, 1],
    "fraud": [0, 1, 0, 1, 0, 1, 0, 1]
}

df = pd.DataFrame(data)

X = df.drop("fraud", axis=1)
y = df["fraud"]

# 2. Train ML model
model = RandomForestClassifier(n_estimators=50, random_state=42)
model.fit(X, y)

# 3. Save model
joblib.dump(model, "fraud_model.pkl")

# 4. Inference test
test_case = [[600000, 6, 1, 1]]
prob = model.predict_proba(test_case)[0][1]

print("✅ ML TRAINED SUCCESSFULLY")
print("Fraud probability:", round(prob * 100, 2), "%")
