from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
# Import the functions and state from the separate bot execution file
from server1 import run_single_action, get_current_logs, get_current_status

# --- CONFIGURATION & INIT ---

app = FastAPI()

# CRITICAL: Replace 'https://insta-follow-bot.netlify.app' with your actual Netlify domain.
ALLOWED_ORIGINS = [
    "https://insta-follow-bot.netlify.app", 
    "http://localhost:5173",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Simplified Bot API v3.0 Running"}

@app.post("/bot/run_action")
def trigger_action():
    """Triggers the single synchronous Playwright action defined in server1.py."""
    try:
        return run_single_action()
    except Exception as e:
        # If run_single_action fails, it raises an exception, which we catch 
        # to return a 500 status to the client.
        raise HTTPException(status_code=500, detail=f"Bot execution failed: {str(e)}")

@app.get("/status")
def get_status():
    """Returns the simple status."""
    return get_current_status()

@app.get("/logs")
def get_logs():
    """Returns the globally stored logs."""
    return get_current_logs()

# Deprecated Endpoint (Included just in case the UI accidentally hits it)
@app.get("/accounts")
def get_accounts_disabled():
    return []