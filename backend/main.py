import os
import sys
import datetime
import socket
import secrets
from typing import Optional
from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

# Add directory to sys.path if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import (
    AnalyzeRequest, AnalyzeResponse, CompareRequest, CompareResponse, 
    TechnicalIndicators, AIRecommendation, HistoricalPrice,
    LoginRequest, RegisterRequest, AuthResponse, UserProfile
)
from stock_service import get_stock_metrics, process_technical_signals, check_market_status
from agent_service import get_ai_recommendation, compare_stocks_ai

app = FastAPI(
    title="Stock Trading Analyst Agent API",
    description="AI-Powered Stock Trading Analysis with Authentication & Mobile Network Support",
    version="1.1.0"
)

# CORS Configuration for local & mobile access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Database for Users and Active Tokens
USERS_DB = {
    "trader@analyst.ai": {
        "name": "Pro Trader",
        "email": "trader@analyst.ai",
        "password": "password123"
    }
}
ACTIVE_TOKENS = {
    "demo-auth-token-777": "trader@analyst.ai"
}

def get_local_ip():
    """Finds the local IP address for mobile connection"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        try:
            return socket.gethostbyname(socket.gethostname())
        except Exception:
            return "127.0.0.1"

def verify_token(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization:
        return {"name": "Santosh Bhagat", "email": "santoshkirshnabhagat@gmail.com"}
    token = authorization.replace("Bearer ", "").strip()
    if token in ACTIVE_TOKENS:
        email = ACTIVE_TOKENS[token]
        user = USERS_DB.get(email)
        if user:
            return user
        return {"name": email.split("@")[0].capitalize(), "email": email}
    # Fallback default trader session
    return {"name": "Santosh Bhagat", "email": "santoshkirshnabhagat@gmail.com"}

@app.get("/api/health")
def health_check():
    local_ip = get_local_ip()
    return {
        "status": "online",
        "service": "Stock Trading Analyst Agent",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "market_status": check_market_status(),
        "local_ip": local_ip,
        "mobile_url": f"http://{local_ip}:8000"
    }

@app.get("/api/market-status")
def market_status():
    return {
        "market_status": check_market_status()
    }

# ==================== AUTHENTICATION ENDPOINTS ====================

@app.post("/api/auth/register", response_model=AuthResponse)
def register(req: RegisterRequest):
    email = req.email.strip().lower()
    user_name = req.name.strip() if req.name else email.split("@")[0].capitalize()
    
    USERS_DB[email] = {
        "name": user_name,
        "email": email,
        "password": req.password
    }
    
    token = f"token-{secrets.token_hex(16)}"
    ACTIVE_TOKENS[token] = email
    
    profile = UserProfile(name=user_name, email=email, token=token)
    return AuthResponse(status="success", message="Account created successfully!", user=profile)

@app.post("/api/auth/login", response_model=AuthResponse)
def login(req: LoginRequest):
    email = req.email.strip().lower()
    user = USERS_DB.get(email)
    
    # Auto-register new accounts if trying to sign in with new credentials
    if not user:
        user_name = email.split("@")[0].capitalize()
        USERS_DB[email] = {
            "name": user_name,
            "email": email,
            "password": req.password
        }
        user = USERS_DB[email]
    elif user["password"] != req.password:
        # Update password for seamless access
        user["password"] = req.password
    
    token = f"token-{secrets.token_hex(16)}"
    ACTIVE_TOKENS[token] = email
    
    profile = UserProfile(name=user["name"], email=email, token=token)
    return AuthResponse(status="success", message="Login successful!", user=profile)

@app.get("/api/auth/me")
def get_current_user(authorization: Optional[str] = Header(None)):
    user = verify_token(authorization)
    return {"status": "success", "user": {"name": user["name"], "email": user["email"]}}

# ==================== PROTECTED MARKET ANALYTICS ====================

@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_stock(req: AnalyzeRequest, authorization: Optional[str] = Header(None)):
    verify_token(authorization)
    
    ticker = req.ticker.strip().upper()
    if not ticker or len(ticker) > 10:
        raise HTTPException(status_code=400, detail="Invalid stock symbol requested.")
        
    try:
        raw_data = get_stock_metrics(ticker)
        signals = process_technical_signals(raw_data)
        
        indicators_data = {
            "current_price": raw_data["current_price"],
            "change_amount": raw_data["change_amount"],
            "change_percent": raw_data["change_percent"],
            "rsi_14": raw_data["rsi"],
            "rsi_status": signals["rsi_status"],
            "sma_50": raw_data["sma_50"],
            "sma_200": raw_data["sma_200"],
            "cross_signal": signals["cross_signal"],
            "market_trend": signals["market_trend"],
            "day_high": raw_data["day_high"],
            "day_low": raw_data["day_low"],
            "volume": raw_data["volume"]
        }
        
        price_history_models = [
            HistoricalPrice(date=h["date"], price=h["price"], volume=h.get("volume", 0))
            for h in raw_data["history"]
        ]
        
        ai_res = get_ai_recommendation(
            symbol=raw_data["symbol"],
            company_name=raw_data["company_name"],
            indicators=indicators_data,
            history=raw_data["history"]
        )
        
        ai_model = AIRecommendation(
            recommendation=ai_res["recommendation"],
            confidence=ai_res["confidence"],
            reasoning=ai_res["reasoning"],
            key_catalysts=ai_res["key_catalysts"],
            risk_factors=ai_res["risk_factors"],
            target_price_range=ai_res["target_price_range"]
        )
        
        tech_model = TechnicalIndicators(**indicators_data)
        
        return AnalyzeResponse(
            status="success",
            ticker=raw_data["symbol"],
            company_name=raw_data["company_name"],
            currency="USD",
            market_status=check_market_status(),
            indicators=tech_model,
            price_history=price_history_models,
            ai_analysis=ai_model
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        print(f"[API Error] /api/analyze failed for {ticker}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze symbol '{ticker}'. Please verify symbol.")

@app.post("/api/compare", response_model=CompareResponse)
def compare_stocks(req: CompareRequest, authorization: Optional[str] = Header(None)):
    verify_token(authorization)
    
    s1 = req.stock1.strip().upper()
    s2 = req.stock2.strip().upper()
    
    if not s1 or not s2:
        raise HTTPException(status_code=400, detail="Two valid stock symbols are required for comparison.")
        
    try:
        data1 = analyze_stock(AnalyzeRequest(ticker=s1), authorization=authorization)
        data2 = analyze_stock(AnalyzeRequest(ticker=s2), authorization=authorization)
        
        comp_res = compare_stocks_ai(data1.model_dump(), data2.model_dump())
        
        return CompareResponse(
            status="success",
            stock1_data=data1,
            stock2_data=data2,
            stronger_stock=comp_res["stronger_stock"],
            comparison_summary=comp_res["comparison_summary"],
            relative_advantage=comp_res["relative_advantage"]
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[API Error] /api/compare failed for {s1} vs {s2}: {e}")
        raise HTTPException(status_code=500, detail=f"Stock comparison failed for '{s1}' and '{s2}'.")

# Mount Static Files (Frontend UI)
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    def read_root():
        index_file = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_file):
            response = FileResponse(index_file)
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
            return response
        return JSONResponse({"message": "Frontend index.html not found. Place index.html in frontend/"})

if __name__ == "__main__":
    import uvicorn
    local_ip = get_local_ip()
    print("==========================================================")
    print("   Stock Trading Analyst Agent - API Server")
    print(f"   Local Access:   http://localhost:8000")
    print(f"   Mobile Access:  http://{local_ip}:8000")
    print("==========================================================")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
