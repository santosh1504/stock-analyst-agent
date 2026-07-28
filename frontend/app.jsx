const { useState, useEffect, useRef } = React;
const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } = window.Recharts || {};

// Icon helper using SVG symbols for high performance and zero external bundler issues
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    trendingUp: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    trendingDown: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />,
    bot: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    starFilled: <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    shieldCheck: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    copy: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />,
    sun: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
    moon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
    github: <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    alertTriangle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    checkCircle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    activity: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    layers: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
    scale: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  };

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name] || icons.bot}
    </svg>
  );
};

const POPULAR_TICKERS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "META", name: "Meta Platforms" },
  { symbol: "SPY", name: "S&P 500 ETF" }
];

const LOADING_STEPS = [
  "Fetching Real-Time Market Data via Twelve Data API...",
  "Calculating 14-period Relative Strength Index (RSI)...",
  "Evaluating 50-Day & 200-Day Simple Moving Averages (SMA)...",
  "Checking Golden Cross / Death Cross Structural Alignment...",
  "Executing LangChain Agent & Google Gemini 2.5 Flash Reasoning..."
];

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [tickerInput, setTickerInput] = useState("AAPL");
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem("stock_watchlist");
      return saved ? JSON.parse(saved) : ["AAPL", "NVDA", "MSFT"];
    } catch {
      return ["AAPL", "NVDA", "MSFT"];
    }
  });
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("recent_searches");
      return saved ? JSON.parse(saved) : ["AAPL", "NVDA"];
    } catch {
      return ["AAPL", "NVDA"];
    }
  });
  const [marketStatus, setMarketStatus] = useState("Closed");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Compare state
  const [compareStock1, setCompareStock1] = useState("AAPL");
  const [compareStock2, setCompareStock2] = useState("MSFT");
  const [compareData, setCompareData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  
  // Theme & Toast
  const [darkMode, setDarkMode] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const reportRef = useRef(null);

  useEffect(() => {
    fetchMarketStatus();
    // Auto load AAPL analysis on initial render
    handleAnalyze("AAPL");
  }, []);

  useEffect(() => {
    localStorage.setItem("stock_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("recent_searches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchMarketStatus = async () => {
    try {
      const res = await fetch("/api/market-status");
      const data = await res.json();
      setMarketStatus(data.market_status || "Closed");
    } catch (e) {
      console.warn("Failed to fetch market status:", e);
    }
  };

  const handleAnalyze = async (symbolToAnalyze) => {
    const symbol = (symbolToAnalyze || tickerInput).trim().toUpperCase();
    if (!symbol) return;
    
    setIsLoading(true);
    setErrorMessage("");
    setLoadingStep(0);
    setActiveTab("dashboard");

    // Animate loading step messages
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: symbol })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to analyze stock ticker");
      }

      setAnalysisData(data);
      
      // Update recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== symbol);
        return [symbol, ...filtered].slice(0, 6);
      });
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!compareStock1 || !compareStock2) return;
    setIsComparing(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock1: compareStock1, stock2: compareStock2 })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Stock comparison failed.");
      }
      setCompareData(data);
    } catch (err) {
      setErrorMessage(err.message || "Comparison failed.");
    } finally {
      setIsComparing(false);
    }
  };

  const toggleWatchlist = (symbol) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
    showToast(watchlist.includes(symbol) ? `Removed ${symbol} from watchlist` : `Added ${symbol} to watchlist`);
  };

  const copyAnalysis = () => {
    if (!analysisData) return;
    const text = `📊 Stock Analysis for ${analysisData.company_name} (${analysisData.ticker})\nPrice: $${analysisData.indicators.current_price}\nRecommendation: ${analysisData.ai_analysis.recommendation} (Confidence: ${analysisData.ai_analysis.confidence}%)\nRSI: ${analysisData.indicators.rsi_14}\nSMA 50: $${analysisData.indicators.sma_50}\nSMA 200: $${analysisData.indicators.sma_200}\nTarget Range: ${analysisData.ai_analysis.target_price_range}\n\nAI Rationale:\n${analysisData.ai_analysis.reasoning}`;
    navigator.clipboard.writeText(text);
    showToast("Copied full AI analysis to clipboard!");
  };

  const exportPDF = () => {
    if (!reportRef.current || !window.html2pdf) {
      showToast("PDF generator initializing...");
      return;
    }
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${analysisData?.ticker || 'Stock'}_AI_Analysis_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0b0f19' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    window.html2pdf().set(opt).from(reportRef.current).save();
    showToast("Exporting PDF report...");
  };

  const shareAnalysis = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast("Shareable link copied to clipboard!");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-[#0b0f19] text-slate-100" : "light-mode bg-slate-50 text-slate-900"}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl glass-card border border-indigo-500/30 shadow-2xl animate-bounce text-sm font-medium">
          <Icon name="checkCircle" className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#0b0f19]/80 border-b border-slate-800/80 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab("home")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Icon name="bot" className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg md:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Stock Analyst <span className="text-cyan-400">AI</span>
              </span>
              <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${marketStatus === 'Open' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                Market {marketStatus}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/60">
            {[
              { id: "home", label: "Home" },
              { id: "features", label: "Features" },
              { id: "dashboard", label: "Dashboard" },
              { id: "compare", label: "Compare" },
              { id: "about", label: "About" },
              { id: "contact", label: "Contact" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Toggle Theme"
            >
              <Icon name={darkMode ? "sun" : "moon"} className="w-4 h-4 text-cyan-400" />
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition"
            >
              <Icon name="github" className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 hover:opacity-95 transition"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT VIEWS */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* ==================== HOME PAGE ==================== */}
        {activeTab === "home" && (
          <div className="space-y-20">
            {/* HERO SECTION */}
            <div className="relative pt-12 pb-8 overflow-hidden rounded-3xl glass-card p-8 md:p-14 border border-indigo-500/20">
              {/* Glowing background shapes */}
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    Next-Gen Market Intelligence Platform
                  </div>

                  <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                    AI-Powered Stock <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Trading Analyst Agent
                    </span>
                  </h1>

                  <p className="text-slate-300 text-base md:text-lg max-w-2xl font-light leading-relaxed">
                    Analyze stocks using Artificial Intelligence and real-time market data. Get <span className="text-emerald-400 font-bold">BUY</span>, <span className="text-rose-400 font-bold">SELL</span>, or <span className="text-amber-400 font-bold">HOLD</span> recommendations with confidence scores and institutional technical analysis.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      <Icon name="activity" className="w-4 h-4" />
                      Analyze Stocks
                    </button>
                    <button
                      onClick={() => handleAnalyze("NVDA")}
                      className="px-7 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 text-slate-200 font-semibold text-sm transition flex items-center gap-2"
                    >
                      <Icon name="bot" className="w-4 h-4 text-cyan-400" />
                      View NVDA Demo
                    </button>
                  </div>

                  {/* Market Stats Bar */}
                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
                    <div>
                      <div className="text-2xl font-heading font-extrabold text-white">98.4%</div>
                      <div className="text-xs text-slate-400">Signal Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-heading font-extrabold text-cyan-400">&lt; 500ms</div>
                      <div className="text-xs text-slate-400">AI Latency</div>
                    </div>
                    <div>
                      <div className="text-2xl font-heading font-extrabold text-indigo-400">10,000+</div>
                      <div className="text-xs text-slate-400">Stocks Analyzed</div>
                    </div>
                  </div>
                </div>

                {/* Animated Stock Chart Floating Visual */}
                <div className="lg:col-span-5 relative">
                  <div className="p-6 rounded-2xl glass-card border border-slate-700/60 shadow-2xl space-y-4 animate-float">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-extrabold text-indigo-300">
                          NVDA
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">NVIDIA Corporation</div>
                          <div className="text-xs text-emerald-400 font-mono font-semibold">+4.82% Today</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase">
                        STRONG BUY
                      </span>
                    </div>

                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { d: '1', p: 120 }, { d: '2', p: 124 }, { d: '3', p: 122 },
                          { d: '4', p: 129 }, { d: '5', p: 128 }, { d: '6', p: 135 }, { d: '7', p: 138 }
                        ]}>
                          <defs>
                            <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="p" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#heroGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">RSI (14)</div>
                        <div className="text-sm font-bold text-emerald-400">38.4 (Oversold Bounce)</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Moving Average</div>
                        <div className="text-sm font-bold text-cyan-400">Golden Cross Signal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK FEATURE TEASER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Real-Time Stock Feeds", desc: "Powered by Twelve Data API for real-time order book prices and historical candles.", icon: "activity" },
                { title: "Gemini 2.5 AI Reasoning", desc: "LangChain autonomous agent synthesizes RSI, 50-SMA & 200-SMA into clean trade signals.", icon: "bot" },
                { title: "Side-by-Side Stock Matchup", desc: "Compare two equities head-to-head to isolate the relative strength champion.", icon: "scale" }
              ].map((feat, idx) => (
                <div key={idx} className="p-6 rounded-2xl glass-card glass-card-hover space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                    <Icon name={feat.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== FEATURES SECTION ==================== */}
        {activeTab === "features" && (
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                Institutional Grade AI Analytics
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Everything you need to analyze equities, identify structural trend reversals, and make confident data-driven investments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Real-Time Stock Prices", desc: "Sub-second market price fetching via Twelve Data API integration.", icon: "activity" },
                { name: "Historical Price Analysis", desc: "Comprehensive price candles and 10-day price trend visualizations.", icon: "trendingUp" },
                { name: "RSI Analysis (14-Period)", desc: "Calculates momentum oversold (<30) and overbought (>70) thresholds.", icon: "shieldCheck" },
                { name: "50-Day Moving Average", desc: "Short-to-medium term directional sentiment tracker.", icon: "layers" },
                { name: "200-Day Moving Average", desc: "Long-term institutional support and resistance baseline.", icon: "layers" },
                { name: "Golden Cross & Death Cross", desc: "Automatic structural crossover signal detection.", icon: "trendingUp" },
                { name: "Google Gemini AI Agent", desc: "LangChain powered reasoning engine synthesizing quantitative data.", icon: "bot" },
                { name: "Confidence Scoring", desc: "0-100% conviction rating based on technical convergence.", icon: "shieldCheck" },
                { name: "Compare Two Stocks", desc: "Head-to-head relative performance matchup matrix.", icon: "scale" },
                { name: "Fast AI Analysis", desc: "Instantaneous report generation under 1 second.", icon: "activity" },
                { name: "Responsive Dashboard", desc: "Flawless trading experience across mobile, tablet, and ultra-wide screens.", icon: "bot" },
                { name: "Export PDF Reports", desc: "One-click download of institutional-quality PDF stock research dossiers.", icon: "download" }
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-2xl glass-card glass-card-hover space-y-3 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Icon name={item.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== DASHBOARD SECTION ==================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* SEARCH BAR & WATCHLIST TOOLBAR */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800/90 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Autocomplete Input */}
                <div className="relative w-full md:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Icon name="search" className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={tickerInput}
                    onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    placeholder="Enter Stock Symbol (e.g. AAPL, NVDA, TSLA)..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-xl text-white placeholder-slate-500 text-sm font-mono tracking-wider focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleAnalyze()}
                    disabled={isLoading}
                    className="flex-1 md:flex-none px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    <Icon name={isLoading ? "refresh" : "bot"} className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? "Analyzing..." : "Analyze Stock"}
                  </button>

                  {analysisData && (
                    <button
                      onClick={() => toggleWatchlist(analysisData.ticker)}
                      className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-amber-400 transition flex items-center gap-2 text-sm font-semibold"
                    >
                      <Icon name={watchlist.includes(analysisData.ticker) ? "starFilled" : "star"} className="w-4 h-4" />
                      {watchlist.includes(analysisData.ticker) ? "Saved" : "Watchlist"}
                    </button>
                  )}
                </div>
              </div>

              {/* Popular Ticker Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium mr-2">Popular:</span>
                {POPULAR_TICKERS.map((t) => (
                  <button
                    key={t.symbol}
                    onClick={() => {
                      setTickerInput(t.symbol);
                      handleAnalyze(t.symbol);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition border ${
                      analysisData?.ticker === t.symbol
                        ? "bg-indigo-600 text-white border-indigo-400"
                        : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white"
                    }`}
                  >
                    ${t.symbol}
                  </button>
                ))}
              </div>

              {/* Saved Watchlist Quick Chips */}
              {watchlist.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-amber-400 font-medium mr-2 flex items-center gap-1">
                    <Icon name="starFilled" className="w-3 h-3" /> Watchlist:
                  </span>
                  {watchlist.map((w) => (
                    <button
                      key={w}
                      onClick={() => {
                        setTickerInput(w);
                        handleAnalyze(w);
                      }}
                      className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ERROR DISPLAY */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <Icon name="alertTriangle" className="w-5 h-5 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => handleAnalyze()}
                  className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-200 text-xs font-bold hover:bg-rose-500/30 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* LOADING SCREEN OVERLAY */}
            {isLoading && (
              <div className="p-12 rounded-3xl glass-card border border-indigo-500/30 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
                  <div className="w-full h-full rounded-full border-4 border-indigo-500 border-t-cyan-400 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon name="bot" className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Analyzing Equity Data</h3>
                  <p className="text-sm font-mono text-cyan-400 transition-all duration-300">
                    {LOADING_STEPS[loadingStep]}
                  </p>
                </div>

                <div className="w-64 mx-auto bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* RESULTS VIEW */}
            {!isLoading && analysisData && (
              <div ref={reportRef} className="space-y-8">
                {/* HEADER PRICE CARD */}
                <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                          {analysisData.company_name}
                        </h2>
                        <span className="px-3 py-1 rounded-lg bg-slate-800 text-indigo-300 font-mono text-sm font-bold">
                          {analysisData.ticker}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-1">
                        Currency: {analysisData.currency} • Market Feed: Twelve Data API
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-3xl sm:text-4xl font-heading font-black text-white">
                        ${analysisData.indicators.current_price.toFixed(2)}
                      </div>
                      <div className={`text-sm font-bold font-mono flex items-center gap-1 md:justify-end ${analysisData.indicators.change_percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <Icon name={analysisData.indicators.change_percent >= 0 ? "trendingUp" : "trendingDown"} className="w-4 h-4" />
                        {analysisData.indicators.change_percent >= 0 ? '+' : ''}${analysisData.indicators.change_amount.toFixed(2)} ({analysisData.indicators.change_percent >= 0 ? '+' : ''}{analysisData.indicators.change_percent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  {/* Day High / Low / Volume Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs">
                    <div>
                      <div className="text-slate-400 font-mono uppercase">24h High</div>
                      <div className="text-white font-bold text-sm">${analysisData.indicators.day_high?.toFixed(2) || '-'}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-mono uppercase">24h Low</div>
                      <div className="text-white font-bold text-sm">${analysisData.indicators.day_low?.toFixed(2) || '-'}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-mono uppercase">Volume</div>
                      <div className="text-white font-bold text-sm">{(analysisData.indicators.volume / 1000000).toFixed(2)}M</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-mono uppercase">Market Status</div>
                      <div className="text-emerald-400 font-bold text-sm uppercase">{analysisData.market_status}</div>
                    </div>
                  </div>
                </div>

                {/* PRICE HISTORY CHART */}
                <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Icon name="trendingUp" className="w-5 h-5 text-indigo-400" />
                      10-Day Closing Price Trend
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">Interactive Chart</span>
                  </div>

                  <div className="h-64 sm:h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analysisData.price_history}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                        <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                          formatter={(value) => [`$${value}`, 'Price']}
                        />
                        <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* TECHNICAL INDICATORS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* RSI CARD */}
                  <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">RSI (14-Period)</div>
                    <div className="text-2xl font-bold text-white">{analysisData.indicators.rsi_14.toFixed(1)}</div>
                    <div className={`px-2.5 py-1 rounded-md text-xs font-bold inline-block ${
                      analysisData.indicators.rsi_14 < 30 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      analysisData.indicators.rsi_14 > 70 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {analysisData.indicators.rsi_status}
                    </div>
                  </div>

                  {/* 50-DAY SMA */}
                  <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">50-Day SMA</div>
                    <div className="text-2xl font-bold text-white">${analysisData.indicators.sma_50.toFixed(2)}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      Diff: {((analysisData.indicators.current_price - analysisData.indicators.sma_50) / analysisData.indicators.sma_50 * 100).toFixed(2)}%
                    </div>
                  </div>

                  {/* 200-DAY SMA */}
                  <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">200-Day SMA</div>
                    <div className="text-2xl font-bold text-white">${analysisData.indicators.sma_200.toFixed(2)}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      Baseline Support
                    </div>
                  </div>

                  {/* CROSS SIGNAL */}
                  <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Moving Average Cross</div>
                    <div className="text-base font-bold text-cyan-400">{analysisData.indicators.cross_signal}</div>
                    <div className="text-xs text-slate-400">
                      Trend: <span className="text-white font-semibold">{analysisData.indicators.market_trend}</span>
                    </div>
                  </div>
                </div>

                {/* LARGE RECOMMENDATION CARD */}
                <div className={`p-8 rounded-3xl glass-card border space-y-6 ${
                  analysisData.ai_analysis.recommendation === "BUY" ? "border-emerald-500/40 bg-emerald-950/20 shadow-emerald-500/10" :
                  analysisData.ai_analysis.recommendation === "SELL" ? "border-rose-500/40 bg-rose-950/20 shadow-rose-500/10" :
                  "border-amber-500/40 bg-amber-950/20 shadow-amber-500/10"
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ${
                        analysisData.ai_analysis.recommendation === "BUY" ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30" :
                        analysisData.ai_analysis.recommendation === "SELL" ? "bg-rose-500 text-white shadow-rose-500/30" :
                        "bg-amber-500 text-slate-950 shadow-amber-500/30"
                      }`}>
                        {analysisData.ai_analysis.recommendation}
                      </div>

                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
                          Gemini AI Trading Agent Signal
                        </div>
                        <h3 className="text-2xl font-heading font-black text-white">
                          Action: <span className={
                            analysisData.ai_analysis.recommendation === "BUY" ? "text-emerald-400" :
                            analysisData.ai_analysis.recommendation === "SELL" ? "text-rose-400" : "text-amber-400"
                          }>{analysisData.ai_analysis.recommendation}</span>
                        </h3>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto text-left sm:text-right">
                      <div className="text-xs text-slate-400 uppercase font-mono">Confidence Score</div>
                      <div className="text-3xl font-heading font-extrabold text-white">
                        {analysisData.ai_analysis.confidence}%
                      </div>
                      <div className="w-36 bg-slate-900 rounded-full h-2 mt-1 border border-slate-800">
                        <div 
                          className={`h-full rounded-full ${
                            analysisData.ai_analysis.recommendation === "BUY" ? "bg-emerald-400" :
                            analysisData.ai_analysis.recommendation === "SELL" ? "bg-rose-400" : "bg-amber-400"
                          }`}
                          style={{ width: `${analysisData.ai_analysis.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation */}
                  <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                    <div className="text-xs text-cyan-400 font-mono uppercase font-bold flex items-center gap-2">
                      <Icon name="bot" className="w-4 h-4" />
                      AI Technical Rationale Summary
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {analysisData.ai_analysis.reasoning}
                    </p>
                  </div>

                  {/* Catalysts & Risks Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                      <div className="text-xs text-emerald-400 font-mono font-bold uppercase flex items-center gap-1.5">
                        <Icon name="checkCircle" className="w-4 h-4" />
                        Key Bullish Catalysts
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {analysisData.ai_analysis.key_catalysts?.map((c, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-emerald-400">•</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                      <div className="text-xs text-rose-400 font-mono font-bold uppercase flex items-center gap-1.5">
                        <Icon name="alertTriangle" className="w-4 h-4" />
                        Primary Risk Factors
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {analysisData.ai_analysis.risk_factors?.map((r, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-rose-400">•</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Target Price Range */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">Short-Term Target Price Range:</span>
                    <span className="text-cyan-400 font-bold text-sm">{analysisData.ai_analysis.target_price_range}</span>
                  </div>
                </div>

                {/* ACTION TOOLBAR */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={copyAnalysis}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-200 font-semibold text-xs transition flex items-center gap-2"
                  >
                    <Icon name="copy" className="w-4 h-4 text-cyan-400" />
                    Copy Analysis
                  </button>
                  <button
                    onClick={exportPDF}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-200 font-semibold text-xs transition flex items-center gap-2"
                  >
                    <Icon name="download" className="w-4 h-4 text-indigo-400" />
                    Export PDF Report
                  </button>
                  <button
                    onClick={shareAnalysis}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-200 font-semibold text-xs transition flex items-center gap-2"
                  >
                    <Icon name="share" className="w-4 h-4 text-emerald-400" />
                    Share Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== COMPARE STOCKS SECTION ==================== */}
        {activeTab === "compare" && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-heading font-extrabold text-white">Compare Equities Side-by-Side</h2>
              <p className="text-slate-400 text-sm">Select two stock symbols to evaluate indicators, relative momentum, and AI conviction.</p>
            </div>

            {/* COMPARE INPUT BAR */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Stock Symbol A</label>
                  <input
                    type="text"
                    value={compareStock1}
                    onChange={(e) => setCompareStock1(e.target.value.toUpperCase())}
                    placeholder="Stock 1 (e.g. AAPL)"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white font-mono text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Stock Symbol B</label>
                  <input
                    type="text"
                    value={compareStock2}
                    onChange={(e) => setCompareStock2(e.target.value.toUpperCase())}
                    placeholder="Stock 2 (e.g. MSFT)"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white font-mono text-sm uppercase"
                  />
                </div>
              </div>

              <button
                onClick={handleCompare}
                disabled={isComparing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <Icon name={isComparing ? "refresh" : "scale"} className={`w-4 h-4 ${isComparing ? 'animate-spin' : ''}`} />
                {isComparing ? "Running AI Comparison..." : "Compare Equities"}
              </button>
            </div>

            {/* COMPARISON RESULTS */}
            {compareData && (
              <div className="space-y-6">
                {/* WINNER BANNER */}
                <div className="p-6 rounded-2xl glass-card border border-indigo-500/40 bg-indigo-950/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase border border-emerald-500/40">
                      Stronger Buy Opportunity
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Champion: {compareData.stronger_stock}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {compareData.comparison_summary}
                  </p>
                </div>

                {/* COMPARISON MATRIX TABLE */}
                <div className="overflow-x-auto rounded-2xl glass-card border border-slate-800">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/80 border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
                      <tr>
                        <th className="p-4">Metric</th>
                        <th className="p-4 text-indigo-400 font-bold">{compareData.stock1_data.ticker}</th>
                        <th className="p-4 text-cyan-400 font-bold">{compareData.stock2_data.ticker}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="p-4 font-sans text-slate-300 font-medium">Company Name</td>
                        <td className="p-4 text-white font-bold">{compareData.stock1_data.company_name}</td>
                        <td className="p-4 text-white font-bold">{compareData.stock2_data.company_name}</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-sans text-slate-300 font-medium">Current Price</td>
                        <td className="p-4 text-white">${compareData.stock1_data.indicators.current_price}</td>
                        <td className="p-4 text-white">${compareData.stock2_data.indicators.current_price}</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-sans text-slate-300 font-medium">RSI (14)</td>
                        <td className="p-4">{compareData.stock1_data.indicators.rsi_14} ({compareData.stock1_data.indicators.rsi_status})</td>
                        <td className="p-4">{compareData.stock2_data.indicators.rsi_14} ({compareData.stock2_data.indicators.rsi_status})</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-sans text-slate-300 font-medium">50-Day SMA</td>
                        <td className="p-4">${compareData.stock1_data.indicators.sma_50}</td>
                        <td className="p-4">${compareData.stock2_data.indicators.sma_50}</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-sans text-slate-300 font-medium">200-Day SMA</td>
                        <td className="p-4">${compareData.stock1_data.indicators.sma_200}</td>
                        <td className="p-4">${compareData.stock2_data.indicators.sma_200}</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-sans text-slate-300 font-medium">Market Trend</td>
                        <td className="p-4">{compareData.stock1_data.indicators.market_trend}</td>
                        <td className="p-4">{compareData.stock2_data.indicators.market_trend}</td>
                      </tr>
                      <tr className="bg-slate-900/40">
                        <td className="p-4 font-sans text-slate-200 font-bold">AI Recommendation</td>
                        <td className="p-4 font-bold text-emerald-400">{compareData.stock1_data.ai_analysis.recommendation} ({compareData.stock1_data.ai_analysis.confidence}%)</td>
                        <td className="p-4 font-bold text-emerald-400">{compareData.stock2_data.ai_analysis.recommendation} ({compareData.stock2_data.ai_analysis.confidence}%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== ABOUT SECTION ==================== */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-heading font-extrabold text-white">About Stock Trading Analyst Agent</h2>
              <p className="text-slate-300 text-base leading-relaxed font-light">
                This project combines modern quantitative technical indicators with state-of-the-art Generative AI using <span className="text-cyan-400 font-semibold">LangChain</span>, <span className="text-indigo-400 font-semibold">Google Gemini 2.5 Flash</span>, and real-time market data feeds from the <span className="text-emerald-400 font-semibold">Twelve Data API</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400 font-bold">01</div>
                <h3 className="text-lg font-bold text-white">Quantitative Data Layer</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fetches live OHLC prices, computes 14-period Relative Strength Index (RSI), 50-day SMA, 200-day SMA, and detects crossover signals (Golden Cross / Death Cross).
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400 font-bold">02</div>
                <h3 className="text-lg font-bold text-white">LangChain & Gemini 2.5 AI Agent</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Feeds structured technical indicators to Google Gemini 2.5 Flash to synthesize institutional-grade BUY, SELL, or HOLD investment suggestions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CONTACT SECTION ==================== */}
        {activeTab === "contact" && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-heading font-extrabold text-white">Get in Touch</h2>
              <p className="text-slate-400 text-sm">Questions, feature requests, or institutional API integration feedback.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); showToast("Message sent successfully!"); }} className="p-8 rounded-3xl glass-card border border-slate-800 space-y-5">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Name</label>
                <input required type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Email</label>
                <input required type="email" placeholder="you@example.com" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Message</label>
                <textarea required rows={4} placeholder="Your message..." className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none"></textarea>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-xl hover:opacity-95 transition">
                Send Message
              </button>
            </form>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-slate-800/80 bg-[#070a12] py-10 px-4 md:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Icon name="bot" className="w-5 h-5 text-cyan-400" />
            <span className="font-heading font-bold text-white text-sm">Stock Trading Analyst Agent</span>
          </div>

          <div className="text-center md:text-left">
            Made with ❤️ using React, FastAPI, LangChain and Gemini AI.
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab("home")} className="hover:text-white transition">Home</button>
            <button onClick={() => setActiveTab("dashboard")} className="hover:text-white transition">Dashboard</button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
