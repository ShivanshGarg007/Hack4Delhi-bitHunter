// attach events AFTER page loads
window.onload = () => {
    document.getElementById("analyzeBtn").onclick = analyze;
    document.getElementById("manualBtn").onclick = manualCheck;
};

// =====================
// ANALYZE APPLICATIONS
// =====================
async function analyze() {
    const status = document.getElementById("systemStatus");
    status.innerText = "ANALYZING...";
    status.className = "badge warning";

    try {
        const res = await fetch("http://127.0.0.1:8000/analyze_applicants");
        const json = await res.json();

        const data = Array.isArray(json) ? json : json.results;
        const results = document.getElementById("results");
        results.innerHTML = "";

        data.forEach(app => {
            results.innerHTML += `
        <div class="result">
          <b>${app.name}</b><br/>
          Address: ${app.address}<br/>
          Income: ₹${app.declared_income}<br/>
          Risk: ${app.risk_level}
        </div><hr/>
      `;
        });

        status.innerText = "READY";
        status.className = "badge ready";

    } catch (e) {
        console.error(e);
        status.innerText = "ERROR";

        status.className = "badge error";
    }
}

// =====================
// MANUAL FRAUD CHECK
// =====================
async function manualCheck() {
    try {
        const payload = {
            income: Number(income.value),
            same_day_visits: Number(sameDay.value),
            shared_mobile: Number(sharedMobile.value),
            previous_defaults: Number(defaults.value)
        };

        const res = await fetch("http://127.0.0.1:8000/ml-predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        const risk = Number(data.fraud_risk);

        riskText.innerText = `Risk: ${risk}% (${data.risk_level})`;
        manualResult.innerHTML = `<b>Status:</b> ${data.status}`;

        const angle = (risk / 100) * 180 - 90;
        needle.style.transform = `rotate(${angle}deg)`;

    } catch (e) {
        console.error(e);
        riskText.innerText = "Risk: ERROR";
    }
}

