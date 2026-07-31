from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LoginRequest(BaseModel):
    email: str = Field(..., example="trader@analyst.ai")
    password: str = Field(..., example="password123")

class RegisterRequest(BaseModel):
    name: str = Field(..., example="Alex Trader")
    email: str = Field(..., example="alex@analyst.ai")
    password: str = Field(..., example="password123")

class UserProfile(BaseModel):
    name: str
    email: str
    token: str

class AuthResponse(BaseModel):
    status: str = "success"
    message: str
    user: Optional[UserProfile] = None

class AnalyzeRequest(BaseModel):
    ticker: str = Field(..., example="AAPL", description="Stock ticker symbol")

class HistoricalPrice(BaseModel):
    date: str
    price: float
    volume: Optional[int] = 0

class TechnicalIndicators(BaseModel):
    current_price: float
    change_amount: float
    change_percent: float
    rsi_14: float
    rsi_status: str  # Oversold, Neutral, Overbought
    sma_50: float
    sma_200: float
    cross_signal: str  # Golden Cross, Death Cross, Neutral
    market_trend: str  # Bullish, Bearish, Sideways
    day_high: Optional[float] = None
    day_low: Optional[float] = None
    volume: Optional[int] = None

class AIRecommendation(BaseModel):
    recommendation: str  # BUY, SELL, HOLD
    confidence: int  # 0 to 100 percentage
    reasoning: str
    key_catalysts: List[str]
    risk_factors: List[str]
    target_price_range: str

class AnalyzeResponse(BaseModel):
    status: str = "success"
    ticker: str
    company_name: str
    currency: str = "USD"
    market_status: str  # Open or Closed
    indicators: TechnicalIndicators
    price_history: List[HistoricalPrice]
    ai_analysis: AIRecommendation

class CompareRequest(BaseModel):
    stock1: str = Field(..., example="AAPL")
    stock2: str = Field(..., example="MSFT")

class CompareResponse(BaseModel):
    status: str = "success"
    stock1_data: AnalyzeResponse
    stock2_data: AnalyzeResponse
    stronger_stock: str
    comparison_summary: str
    relative_advantage: List[str]

class ContactRequest(BaseModel):
    name: str = Field(..., example="John Doe")
    email: str = Field(..., example="john@example.com")
    message: str = Field(..., example="Great application!")

