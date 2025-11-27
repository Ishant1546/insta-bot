
logs = []

def log(message: str):
    if len(logs) > 5000:
        logs.pop(0)
    logs.append(message)

def get_logs():
    return logs

def clear_logs():
    logs.clear()
