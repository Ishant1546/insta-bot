import asyncio
from datetime import datetime
from playwright.async_api import async_playwright, Playwright

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
        self.p_instance: Playwright = None # Store Playwright instance

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
        
        # --- Aggressive Browser Optimization ---
        try:
            self.p_instance = await async_playwright().start()
            
            # OPTIMIZATION: Use WebKit, which is sometimes lighter than Chromium
            browser = await self.p_instance.webkit.launch(
                headless=True,
                args=[
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--single-process' # Further resource saving
                ]
            )
            self.status = "running"
            self.add_log("Browser (WebKit) launched and fully optimized.")

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
                    
                    # OPTIMIZATION: Set small viewport size to save memory
                    page = await browser.new_page(viewport={'width': 800, 'height': 600})
                    
                    try:
                        # OPTIMIZATION: Use a strict timeout for navigation
                        await page.goto("https://example.com", timeout=30000) 
                        self.add_log(f"Attempting login for {account['email']}...")

                        # --- BOT LOGIC (Placeholder) ---
                        # Example of interacting with an element:
                        # await page.fill('input[name="username"]', account['email'])
                        await asyncio.sleep(2) # Simulate waiting for action
                        
                        self.last_success = datetime.now().isoformat()
                        self.add_log(f"Success action for {account['email']}")
                        
                    except Exception as e:
                        self.add_log(f"Resource Error on account {account['email']}: {str(e)}")
                    finally:
                        # Ensure page is closed immediately after use
                        await page.close()
                    
                    # Wait between accounts to cool down CPU
                    await asyncio.sleep(5)

            await browser.close()
            self.add_log("Browser closed.")
            
        except Exception as e:
            self.status = "error"
            self.add_log(f"CRITICAL RESOURCE ERROR: {str(e)}")
        finally:
            if self.p_instance:
                 await self.p_instance.stop() # Ensure Playwright instance is stopped
            if not self.status == "error":
                self.status = "idle"
            self.action = "Stopped"

    async def start(self, accounts):
        if self.status in ["running", "starting"]:
            return False
        # Clear any previous error state when starting
        if self.status == "error": self.status = "idle"
        self.browser_task = asyncio.create_task(self.run_bot_loop(accounts))
        return True

    async def stop(self):
        self.add_log("Stop requested. Waiting for processes to terminate...")
        self.stop_event.set()
        if self.browser_task and not self.browser_task.done():
            # Wait a maximum of 10 seconds for the browser to close gracefully
            try:
                await asyncio.wait_for(self.browser_task, timeout=10)
            except asyncio.TimeoutError:
                self.add_log("Graceful shutdown timed out. Forcefully terminating.")
                # The Playwright instance is stopped in the finally block of run_bot_loop
        self.status = "idle"
        self.action = "Stopped"
        return True

    def get_stats(self):
        uptime = "0s"
        # Only calculate uptime if running
        if self.start_time and self.status == "running":
            delta = datetime.now() - self.start_time
            uptime = str(delta).split('.')[0]
            
        return {
            "status": self.status,
            "action": self.action,
            "uptime": uptime,
            # Format last_success for display
            "last_success": self.last_success,
            "logs": self.logs[-50:]
        }

bot = BotManager()