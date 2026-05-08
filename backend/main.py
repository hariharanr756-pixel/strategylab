from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import PredictionInput

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "StrategyLab AI Running"}

@app.post("/predict")
def predict(input_data: PredictionInput):

    revenue = input_data.price * input_data.customers
    predicted_profit = revenue - input_data.cost + input_data.marketing_spend

    risk = int((input_data.discount * 100) + 54)

    if risk > 70:
        recommendation = "High Risk Strategy"
    else:
        recommendation = "Safe Growth Strategy"

    what_if = []

    for multiplier in [0.5, 0.8, 1, 1.2, 1.5]:
        scenario_profit = (
            revenue
            - input_data.cost
            + (input_data.marketing_spend * multiplier)
        )

        what_if.append({
            "marketing_multiplier": multiplier,
            "predicted_profit": round(scenario_profit, 2)
        })
    return {
    "revenue": revenue,
    "predicted_profit": int(revenue - input_data.cost + (input_data.marketing_spend * 0.2)),
    "risk": min(95, int(input_data.marketing_spend / 1000))
}
   
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)