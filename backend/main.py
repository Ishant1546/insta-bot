from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from bot_engine import bot

# Supabase Config
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI()

# CORS: Allow Netlify frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your Netlify URL in production
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
    response = supabase.table("accounts").select("*").execute()
    accounts = response.data
    started = await bot.start(accounts)
    if not started:
        raise HTTPException(status_code=400, detail="Bot already running")
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
    response = supabase.table("accounts").select("*").execute()
    return response.data

@app.post("/accounts/add")
def add_account(account: Account):
    try:
        data = supabase.table("accounts").insert({
            "email": account.email, 
            "password": account.password
        }).execute()
        return data.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/accounts/{uid}")
def delete_account(uid: str):
    supabase.table("accounts").delete().eq("id", uid).execute()
    return {"message": "Deleted"}