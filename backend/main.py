from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from bot_engine import bot
import asyncio # Import asyncio for the bot tasks

# Supabase Config
# Note: Render automatically reads these from environment variables
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Check if keys are available to prevent startup error
if not url or not key:
    print("WARNING: Supabase URL or Key not found in environment variables.")
    # Use dummy values if running locally without setup, should fail nicely on Render if missing
    url = url or "http://example.com"
    key = key or "dummykey"

supabase: Client = create_client(url, key)

app = FastAPI()

# --- CORS FIX ---
# CRITICAL: Replace 'https://insta-follow-bot.netlify.app' with your actual Netlify domain.
# Also allows http://localhost:5173 for local development.
ALLOWED_ORIGINS = [
    "https://insta-follow-bot.netlify.app", 
    "http://localhost:5173",
    "http://127.0.0.1:8000" # For testing the API itself
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Account(BaseModel):
    email: str
    password: str

@app.get("/")
def read_root():
    return {"message": "Luxury Bot API v3.0 Running"}

@app.get("/bot/status")
def get_status():
    return bot.get_stats()

@app.post("/bot/start")
async def start_bot():
    # Fetch accounts from Supabase
    try:
        response = supabase.table("accounts").select("*").execute()
        accounts = response.data
    except Exception as e:
        # Handle DB failure gracefully
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

    started = await bot.start(accounts)
    if not started:
        raise HTTPException(status_code=400, detail="Bot already running or in error state.")
    return {"message": "Bot started"}

@app.post("/bot/stop")
async def stop_bot():
    await bot.stop()
    return {"message": "Bot stopped"}

@app.get("/logs")
def get_logs():
    return bot.get_stats()["logs"]

@app.get("/accounts")
def get_accounts():
    try:
        response = supabase.table("accounts").select("id, email").execute()
        # IMPORTANT: Do not return passwords. Only return ID and email.
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database read error: {e}")

@app.post("/accounts/add")
def add_account(account: Account):
    if not account.email or not account.password:
        raise HTTPException(status_code=400, detail="Email and password cannot be empty.")
        
    try:
        # Supabase will handle UUID generation
        data = supabase.table("accounts").insert({
            "email": account.email, 
            "password": account.password
        }).execute()
        return data.data
    except Exception as e:
        # Check for unique constraint violation (email already exists)
        if "duplicate key value violates unique constraint" in str(e):
             raise HTTPException(status_code=409, detail="Account with this email already exists.")
        raise HTTPException(status_code=500, detail=f"Database insert error: {e}")

@app.delete("/accounts/{uid}")
def delete_account(uid: str):
    try:
        supabase.table("accounts").delete().eq("id", uid).execute()
        return {"message": "Deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database delete error: {e}")

# This task ensures the background bot task is properly managed upon API exit
@app.on_event("shutdown")
async def shutdown_event():
    if bot.browser_task and not bot.browser_task.done():
        await bot.stop()