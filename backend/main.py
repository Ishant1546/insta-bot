
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bot.engine import run_bot
from bot.status import start, stop, get_status, update_action
from bot.logger import log, get_logs
from supabase.client import get_accounts, add_account, delete_account

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/bot/status")
def status():
    return get_status()

@app.post("/bot/start")
def start_bot():
    start()
    accounts = get_accounts()
    if len(accounts) == 0:
        stop()
        return {"error": "No accounts in database"}

    update_action("Loading account")
    acc = accounts[0]

    success = run_bot(acc)
    stop()
    return {"success": success}

@app.post("/bot/stop")
def stop_bot():
    stop()
    return {"message": "Stopped"}

@app.get("/logs")
def logs():
    return {"logs": get_logs()}

@app.get("/accounts")
def accounts():
    return {"accounts": get_accounts()}

@app.post("/accounts/add")
def add(acc: dict):
    return add_account(acc["username"], acc["password"], acc.get("tag", "demo"))

@app.delete("/accounts/{id}")
def remove(id: str):
    return delete_account(id)
