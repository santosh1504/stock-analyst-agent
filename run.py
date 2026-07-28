import os
import sys
import socket
import webbrowser
import time
import uvicorn

# Reconfigure stdout for UTF-8 in Windows console if needed
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    local_ip = get_local_ip()
    port = 8000
    
    print("==========================================================")
    print("   Starting AI-Powered Stock Trading Analyst Agent        ")
    print("==========================================================")
    print("   - Backend: FastAPI (Python)")
    print("   - Frontend: React.js + Tailwind CSS + Recharts")
    print("   - AI Engine: LangChain + Google Gemini 2.5 Flash")
    print("   - Authentication: Protected JWT Session Tokens")
    print("==========================================================")
    print(f"\n   Desktop URL:  http://localhost:{port}")
    print(f"   Mobile URL:   http://{local_ip}:{port}")
    print("   (Open the Mobile URL on any phone/tablet on same Wi-Fi)\n")
    print("==========================================================\n")
    
    # Add backend folder to sys.path
    backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)

    # Open browser automatically after 1.5 seconds
    def open_browser():
        time.sleep(1.5)
        webbrowser.open(f"http://localhost:{port}")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # Run FastAPI Server listening on 0.0.0.0 for mobile access
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True, app_dir=backend_path)
