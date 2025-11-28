from datetime import datetime
from playwright.sync_api import sync_playwright

# --- CONFIGURATION & GLOBAL STATE ---

GLOBAL_LOGS = []
MAX_LOGS = 50
LAST_STATUS = {"status": "Action Ready", "action": "Click 'Run Action' to test bot."}

# --- LOGGING FUNCTION ---

def add_log(message):
    """Adds a timestamped message to the global log list."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    entry = f"[{timestamp}] {message}"
    GLOBAL_LOGS.append(entry)
    if len(GLOBAL_LOGS) > MAX_LOGS:
        GLOBAL_LOGS.pop(0)
    print(entry)

# --- BOT ACTION FUNCTION (Synchronous Playwright) ---

def run_single_action():
    """
    Triggers a single synchronous Playwright session to perform web actions.
    This function is designed to run within a standard FastAPI request.
    """
    
    LAST_STATUS["status"] = "Running Action..."
    LAST_STATUS["action"] = "Playwright is executing synchronously."
    add_log("--- Starting Single Action Bot ---")
    
    try:
        with sync_playwright() as p:
            # OPTIMIZATION: Use WebKit for lower resource usage
            browser = p.webkit.launch(
                headless=True,
                # Arguments to reduce resource consumption on free tiers
                args=['--no-sandbox', '--disable-setuid-sandbox', '--single-process']
            )
            # Small viewport size to save memory
            context = browser.new_context(viewport={'width': 800, 'height': 600})
            page = context.new_page()

            # --- TARGET SITE ACTION ---
            # Targeting a known, public site for reliable testing
            SITE_URL = "https://playwright.dev/python/docs/intro"
            add_log(f"Navigating to: {SITE_URL}")
            page.goto(SITE_URL, timeout=30000)
            
            # Find the search input field and fill it
            add_log("Searching for input field...")
            search_input = page.locator('input[type="search"]').first
            
            if search_input.is_visible():
                search_input.fill("Synchronous Execution Test")
                add_log("SUCCESS: Input field filled with test text.")
            
                # Simulate waiting for result/button click
                page.wait_for_timeout(2000) 
                
            else:
                 add_log("ERROR: Search input field not found or visible.")

            browser.close()
            add_log("Browser closed successfully.")
            
            LAST_STATUS["status"] = "Action Complete"
            LAST_STATUS["action"] = "Successfully ran synchronous web action."
            return {"status": "success", "message": "Action completed and browser closed."}

    except Exception as e:
        error_msg = f"CRITICAL BOT ERROR: {str(e)}"
        add_log(error_msg)
        LAST_STATUS["status"] = "Action Failed"
        LAST_STATUS["action"] = "Check logs for Playwright error."
        # Re-raise the exception to be caught by FastAPI for an HTTP 500 response
        raise 
    finally:
        add_log("--- Single Action Bot Finished ---")

# --- DATA RETRIEVAL FUNCTIONS ---

def get_current_logs():
    """Returns the most recent logs."""
    return GLOBAL_LOGS

def get_current_status():
    """Returns the current simple status of the bot action."""
    return LAST_STATUS