
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy bot state
bot_state = {
    "status": "offline",
    "uptime": "0s",
    "action": "idle"
}

@app.get("/bot/status")
def get_status():
    return bot_state

@app.post("/bot/start")
def start_bot():
    bot_state["status"] = "online"
    bot_state["action"] = "starting"
    return {"message": "Bot starting"}

@app.post("/bot/stop")
def stop_bot():
    bot_state["status"] = "offline"
    bot_state["action"] = "idle"
    return {"message": "Bot stopped"}

@app.get("/logs")
def get_logs():
    return {"logs": ["No logs yet"]}

@app.get("/accounts")
def get_accounts():
    return {"accounts": []}

@app.post("/accounts/add")
def add_account(account: dict):
    return {"message": "Account added", "account": account}
