import asyncio
from datetime import datetime
from playwright.async_api import async_playwright

class BotManager:
    def __init__(self):
        self.status = "idle" # idle, starting, running, error
        self.action = "Waiting for command"
        self.logs = []
        self.start_time = None
        self.last_success = None
        self.stop_event = asyncio.Event()
        self.browser_task = None
        self.max_logs = 100

    def add_log(self, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        entry = f"[{timestamp}] {message}"
        self.logs.append(entry)
        if len(self.logs) > self.max_logs:
            self.logs.pop(0)
        print(entry)

    async def run_bot_loop(self, accounts):
        self.status = "starting"
        self.start_time = datetime.now()
        self.stop_event.clear()
        
        try:
            async with async_playwright() as p:
                # Launch headless to save CPU on Render
                browser = await p.chromium.launch(headless=True)
                self.status = "running"
                self.add_log("Browser launched successfully.")

                while not self.stop_event.is_set():
                    if not accounts:
                        self.action = "No accounts found"
                        self.add_log("No accounts in DB. Idling...")
                        await asyncio.sleep(5)
                        continue

                    for account in accounts:
                        if self.stop_event.is_set(): break
                        
                        self.action = f"Processing {account['email']}"
                        self.add_log(f"Logging in: {account['email']}")
                        
                        # --- BOT LOGIC HERE ---
                        page = await browser.new_page()
                        try:
                            # Mocking action for CPU safety
                            await page.goto("https://example.com")
                            await asyncio.sleep(2) # Simulate work
                            self.last_success = datetime.now().isoformat()
                            self.add_log(f"Success action for {account['email']}")
                        except Exception as e:
                            self.add_log(f"Error processing account: {str(e)}")
                        finally:
                            await page.close()
                        
                        # Wait between accounts
                        await asyncio.sleep(2)

                await browser.close()
                self.add_log("Browser closed.")
                
        except Exception as e:
            self.status = "error"
            self.add_log(f"CRITICAL ERROR: {str(e)}")
        finally:
            if not self.status == "error":
                self.status = "idle"
            self.action = "Stopped"

    async def start(self, accounts):
        if self.status in ["running", "starting"]:
            return False
        self.browser_task = asyncio.create_task(self.run_bot_loop(accounts))
        return True

    async def stop(self):
        self.stop_event.set()
        if self.browser_task:
            await self.browser_task
        self.status = "idle"
        return True

    def get_stats(self):
        uptime = "0s"
        if self.start_time and self.status == "running":
            delta = datetime.now() - self.start_time
            uptime = str(delta).split('.')[0]
            
        return {
            "status": self.status,
            "action": self.action,
            "uptime": uptime,
            "last_success": self.last_success,
            "logs": self.logs[-50:] # Return last 50 logs
        }

bot = BotManager()