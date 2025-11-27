
import time

bot_state = {
    "status": "idle",
    "action": "waiting",
    "uptime": "0s",
    "start_time": None,
    "last_success": None
}

def start():
    bot_state["status"] = "starting"
    bot_state["action"] = "Initializing bot"
    bot_state["start_time"] = time.time()
    bot_state["last_success"] = None

def finish(success: bool):
    bot_state["status"] = "idle"
    bot_state["action"] = "Completed" if success else "Failed"
    bot_state["last_success"] = success

def stop():
    bot_state["status"] = "idle"
    bot_state["action"] = "Stopped"
    bot_state["start_time"] = None

def update_action(txt: str):
    bot_state["action"] = txt

def get_status():
    if bot_state["start_time"]:
        elapsed = int(time.time() - bot_state["start_time"])
        bot_state["uptime"] = f"{elapsed}s"
    return bot_state
