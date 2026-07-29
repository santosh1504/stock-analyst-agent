# AI-Powered Stock Trading Analyst Agent 📈🤖

A professional, modern, fully-responsive AI-powered stock trading web application inspired by Bloomberg, TradingView, and Yahoo Finance.

Built with **React.js**, **Tailwind CSS**, **Recharts**, **FastAPI**, **LangChain**, **Google Gemini 2.5 Flash**, and **Twelve Data API**.

---

## 🌟 Key Features

- **Real-Time Stock Analysis**: Instant live price feeds, 24h change, day high/low, and volume stats via Twelve Data API.
- **Institutional Technical Indicators**:
  - **14-Period RSI**: Oversold (<30), Neutral (30-70), and Overbought (>70) momentum detection.
  - **50-Day & 200-Day SMA**: Moving averages tracking trend direction.
  - **Golden Cross & Death Cross**: Automatic crossover pattern signal detection.
- **Google Gemini 2.5 Flash AI Agent**: LangChain autonomous agent generating structured BUY, SELL, or HOLD recommendations, confidence percentages (0-100%), risk factors, and price targets.
- **Interactive Price History Chart**: Powered by Recharts with smooth area gradients and hover tooltips.
- **Stock Comparison Tool**: Side-by-side comparison of two stock tickers with automated relative strength champion evaluation.
- **PDF Report Export**: One-click generation and download of institutional stock research dossiers using `html2pdf.js`.
- **Watchlist & Search Autocomplete**: Saved tickers stored in local state/localStorage.
- **Responsive Dark Mode UI**: Bloomberg / TradingView inspired glassmorphism design system.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Tailwind CSS, Recharts, Lucide Icons, html2pdf.js
- **Backend**: FastAPI (Python 3.14), Uvicorn, Pydantic
- **AI Engine**: LangChain, Google Gemini 2.5 Flash (`google-genai`)
- **Stock Data**: Twelve Data API (with yfinance & quantitative math fallback)

---

## 📁 Project Structure

```
stock-analyst-agent/
├── backend/
│   ├── main.py            # FastAPI main server & endpoint routes
│   ├── models.py          # Pydantic request & response schemas
│   ├── stock_service.py   # Twelve Data API, RSI & SMA calculation engine
│   └── agent_service.py   # LangChain & Gemini AI agent logic
├── frontend/
│   ├── index.html         # HTML shell with CDN setup (Tailwind, React, Recharts)
│   └── app.jsx            # Complete React dashboard application
├── .env.example           # API keys configuration template
├── README.md              # Project documentation
└── run.py                 # One-click launcher script
```

---

## 🚀 Quick Start Guide

### 1. Install Python Dependencies
```bash
pip install fastapi uvicorn requests google-genai langchain langchain-google-genai pandas numpy yfinance pydantic
```

### 2. Configure Environment Variables (Optional)
Create a `.env` file or export your API keys:
```bash
export TWELVE_DATA_API_KEY="your_twelve_data_key"
export GEMINI_API_KEY="your_gemini_api_key"
```
*(Note: Built-in failovers allow the app to run with realistic data even without API keys!)*

### 3. Launch the Server & Application
```bash
python run.py
```
Open your browser at `http://localhost:8000`.

## 👨‍💻 Author & Developer Profile

- **Developer**: **Santosh Bhagat**
- **Email ID**: [santoshkirshnabhagat@gmail.com](mailto:santoshkirshnabhagat@gmail.com)
- **Institution**: **NIAT Kolhapur**
- **GitHub**: [github.com/santosh1504/stock-analyst-agent](https://github.com/santosh1504/stock-analyst-agent)

---

## 📄 License
MIT License. Created with ❤️ by **Santosh Bhagat** (NIAT Kolhapur) using React, FastAPI, LangChain, and Gemini AI.
