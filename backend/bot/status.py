
import time

bot_status = {
    "status": "offline",
    "uptime": "0s",
    "action": "idle",
    "start_time": None
}

def start():
    bot_status["status"] = "online"
    bot_status["start_time"] = time.time()
    bot_status["action"] = "starting"

def stop():
    bot_status["status"] = "offline"
    bot_status["action"] = "idle"
    bot_status["start_time"] = None

def update_action(text):
    bot_status["action"] = text

def get_status():
    if bot_status["start_time"]:
        elapsed = int(time.time() - bot_status["start_time"])
        bot_status["uptime"] = f"{elapsed}s"
    return bot_status
