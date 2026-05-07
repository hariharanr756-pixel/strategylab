from pydantic import BaseModel
from typing import List


class PredictionInput(BaseModel):
    price: float
    marketing_spend: float
    customers: int
    discount: float
    cost: float


class WhatIfScenario(BaseModel):
    marketing_multiplier: float
    predicted_profit: float


class PredictionResponse(BaseModel):
    predicted_profit: float
    risk: int
    revenue: float
    recommendation: str
    what_if_analysis: List[WhatIfScenario]