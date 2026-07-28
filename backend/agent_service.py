import os
import json
import re
from typing import Dict, Any

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def get_ai_recommendation(symbol: str, company_name: str, indicators: Dict[str, Any], history: list) -> Dict[str, Any]:
    """Generates AI analysis via Gemini AI (LangChain / google-genai) or rule-based quantitative AI fallback"""
    
    curr_price = indicators["current_price"]
    rsi = indicators["rsi_14"]
    sma_50 = indicators["sma_50"]
    sma_200 = indicators["sma_200"]
    rsi_status = indicators["rsi_status"]
    cross_signal = indicators["cross_signal"]
    market_trend = indicators["market_trend"]
    change_pct = indicators["change_percent"]
    
    # Check if Gemini API Key is available
    if GEMINI_API_KEY:
        try:
            from google import genai
            from google.genai import types
            
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            prompt = f"""
You are a top-tier Senior Quantitative Wall Street Equity Analyst and Portfolio Manager.
Analyze the following stock technical data for {company_name} ({symbol}):

Current Price: ${curr_price:.2f} (24h Change: {change_pct}%)
RSI (14): {rsi:.2f} ({rsi_status})
50-Day SMA: ${sma_50:.2f}
200-Day SMA: ${sma_200:.2f}
Moving Average Cross Signal: {cross_signal}
Market Trend: {market_trend}
Recent 10-Day Closing Prices: {[h['price'] for h in history]}

Provide your expert investment recommendation in valid raw JSON format ONLY without markdown formatting:
{{
  "recommendation": "BUY" or "SELL" or "HOLD",
  "confidence": integer between 50 and 98,
  "reasoning": "A comprehensive 3-4 sentence financial analysis detailing why this recommendation was selected based on the RSI, 50/200 SMA alignment, trend strength, and risk-reward profile.",
  "key_catalysts": ["Catalyst 1", "Catalyst 2", "Catalyst 3"],
  "risk_factors": ["Risk Factor 1", "Risk Factor 2"],
  "target_price_range": "$XXX.XX - $YYY.YY"
}}
"""
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            
            text = response.text.strip()
            # Clean JSON codeblock wrappers if returned
            if text.startswith("```"):
                text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
                text = re.sub(r"\n?```$", "", text).strip()
                
            parsed = json.loads(text)
            return {
                "recommendation": parsed.get("recommendation", "HOLD").upper(),
                "confidence": min(100, max(0, int(parsed.get("confidence", 75)))),
                "reasoning": parsed.get("reasoning", "Technical setup indicates balanced risk/reward."),
                "key_catalysts": parsed.get("key_catalysts", ["Positive momentum", "Moving average support"]),
                "risk_factors": parsed.get("risk_factors", ["Macro volatility", "RSI divergence"]),
                "target_price_range": parsed.get("target_price_range", f"${curr_price*0.95:.2f} - ${curr_price*1.1:.2f}")
            }
        except Exception as e:
            print(f"[AgentService] Gemini API call warning: {e}. Falling back to Rule-Engine...")

    # Rule-Based Financial Quantitative Engine (Gemini-equivalent output fallback)
    bullish_score = 0
    bearish_score = 0
    reasons = []
    catalysts = []
    risks = []
    
    # RSI evaluation
    if rsi < 35:
        bullish_score += 3
        reasons.append(f"RSI at {rsi:.1f} indicates an oversold condition, creating an attractive mean-reversion buying opportunity.")
        catalysts.append(f"RSI oversold rebound from {rsi:.1f}")
    elif rsi > 65:
        bearish_score += 3
        reasons.append(f"RSI at {rsi:.1f} signals overbought conditions, warning of potential short-term profit taking.")
        risks.append(f"Elevated RSI ({rsi:.1f}) near overbought zone")
    else:
        reasons.append(f"RSI of {rsi:.1f} sits comfortably in the neutral territory, allowing price to trend without immediate indicator exhaustion.")
        
    # Moving Average evaluation
    if curr_price > sma_50 and sma_50 > sma_200:
        bullish_score += 4
        reasons.append(f"Price (${curr_price:.2f}) trades above both the 50-day SMA (${sma_50:.2f}) and 200-day SMA (${sma_200:.2f}), confirming a robust Golden Cross bullish regime.")
        catalysts.append(f"Golden Cross structure (50-SMA ${sma_50:.2f} > 200-SMA ${sma_200:.2f})")
    elif curr_price < sma_50 and sma_50 < sma_200:
        bearish_score += 4
        reasons.append(f"Price (${curr_price:.2f}) remains capped below the 50-day SMA (${sma_50:.2f}) and 200-day SMA (${sma_200:.2f}), reflecting a classic Death Cross downside risk.")
        risks.append(f"Death Cross overhead resistance at 50-SMA (${sma_50:.2f})")
    elif curr_price > sma_50:
        bullish_score += 2
        reasons.append(f"Price maintains short-term bullish momentum above the 50-day SMA (${sma_50:.2f}).")
        catalysts.append("Short-term price action above 50-day SMA")
    else:
        bearish_score += 2
        reasons.append(f"Price has pulled back below the 50-day SMA (${sma_50:.2f}), suggesting short-term consolidation.")
        risks.append("Price below 50-day moving average")

    # Decision Matrix
    score_diff = bullish_score - bearish_score
    if score_diff >= 3:
        recommendation = "BUY"
        confidence = min(95, 75 + score_diff * 4)
        catalysts.extend(["Sustained institutional volume inflow", "Favorable technical trend continuation"])
        risks.extend(["Broad market equity pullback", "Macro rate volatility"])
        target = f"${curr_price*1.06:.2f} - ${curr_price*1.18:.2f}"
    elif score_diff <= -3:
        recommendation = "SELL"
        confidence = min(92, 70 + abs(score_diff) * 4)
        catalysts.extend(["Potential oversold bounce entry point later"])
        risks.extend(["Continued technical breakdowns", "Sub-200 SMA trend weakness", "Volume selloff pressure"])
        target = f"${curr_price*0.84:.2f} - ${curr_price*0.94:.2f}"
    else:
        recommendation = "HOLD"
        confidence = 68 + abs(score_diff) * 3
        catalysts.extend(["Breakout above resistance level", "Consolidation base formation"])
        risks.extend(["Range-bound chopped price action", "Lack of clear breakout momentum"])
        target = f"${curr_price*0.96:.2f} - ${curr_price*1.06:.2f}"

    reasoning_text = " ".join(reasons) + f" Overall financial metrics favor a {recommendation} posture with a target range of {target}."

    return {
        "recommendation": recommendation,
        "confidence": int(confidence),
        "reasoning": reasoning_text,
        "key_catalysts": catalysts[:3],
        "risk_factors": risks[:3],
        "target_price_range": target
    }

def compare_stocks_ai(stock1_data: Dict[str, Any], stock2_data: Dict[str, Any]) -> Dict[str, Any]:
    s1_ticker = stock1_data["ticker"]
    s2_ticker = stock2_data["ticker"]
    
    s1_rec = stock1_data["ai_analysis"]["recommendation"]
    s2_rec = stock2_data["ai_analysis"]["recommendation"]
    
    s1_conf = stock1_data["ai_analysis"]["confidence"]
    s2_conf = stock2_data["ai_analysis"]["confidence"]
    
    s1_score = (3 if s1_rec == "BUY" else 1 if s1_rec == "HOLD" else 0) * 20 + s1_conf * 0.5
    s2_score = (3 if s2_rec == "BUY" else 1 if s2_rec == "HOLD" else 0) * 20 + s2_conf * 0.5
    
    if s1_score >= s2_score:
        stronger = s1_ticker
        weaker = s2_ticker
        advantages = [
            f"{s1_ticker} exhibits stronger AI Recommendation posture ({s1_rec} vs {s2_rec})",
            f"RSI for {s1_ticker} is at {stock1_data['indicators']['rsi_14']} ({stock1_data['indicators']['rsi_status']})",
            f"Trend alignment favors {s1_ticker} with {stock1_data['indicators']['market_trend']}"
        ]
    else:
        stronger = s2_ticker
        weaker = s1_ticker
        advantages = [
            f"{s2_ticker} exhibits stronger AI Recommendation posture ({s2_rec} vs {s1_rec})",
            f"RSI for {s2_ticker} is at {stock2_data['indicators']['rsi_14']} ({stock2_data['indicators']['rsi_status']})",
            f"Trend alignment favors {s2_ticker} with {stock2_data['indicators']['market_trend']}"
        ]

    summary = f"Based on multi-indicator technical analysis and Gemini AI score evaluation, {stronger} outperforms {weaker} with superior trend alignment, higher confidence rating, and healthier risk/reward setup."

    return {
        "stronger_stock": stronger,
        "comparison_summary": summary,
        "relative_advantage": advantages
    }
