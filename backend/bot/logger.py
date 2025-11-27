
logs = []

def log(entry):
    logs.append(entry)
    if len(logs) > 2000:
        logs.pop(0)

def get_logs():
    return logs
