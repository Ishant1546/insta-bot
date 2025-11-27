
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bot.engine import run_bot
from bot.status import start, stop, get_status, update_action, finish
from bot.logger import log, get_logs, clear_logs
from supabase.client import get_accounts, add_account, delete_account

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.post("/bot/start")
async def bot_start():
    clear_logs()
    accounts = get_accounts()
    if not accounts:
        log("ERROR: No accounts stored in Supabase")
        return {"success": False, "error": "No accounts stored"}

    acc = accounts[0]  
    start()
    update_action("Launching bot")
    log("Starting bot using: " + acc["email"])

    success = run_bot(acc)

    finish(success)
    return {"success": success}

@app.post("/bot/stop")
async def bot_stop():
    stop()
    log("Bot manually stopped")
    return {"success": True}

@app.get("/bot/status")
async def bot_status():
    return get_status()

@app.get("/logs")
async def logs():
    return {"logs": get_logs()}

@app.get("/accounts")
async def accounts():
    return {"accounts": get_accounts()}

@app.post("/accounts/add")
async def accounts_add(body: dict):
    email = body.get("email")
    password = body.get("password")
    if not email or not password:
        return {"success": False, "error": "Email + password required"}

    add_account(email, password)
    log(f"Added account: {email}")
    return {"success": True, "accounts": get_accounts()}

@app.delete("/accounts/{id}")
async def accounts_delete(id: str):
    delete_account(id)
    log(f"Deleted account: {id}")
    return {"success": True, "accounts": get_accounts()}
