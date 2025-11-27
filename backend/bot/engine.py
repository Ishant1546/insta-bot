
from playwright.sync_api import sync_playwright
from .status import update_action
from .logger import log

def run_bot(account):
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            update_action("Opening website")
            log("Opening site...")
            page.goto("https://example.com/login")

            update_action("Entering username")
            log("Typing username")
            page.fill("#username", account["username"])

            update_action("Entering password")
            log("Typing password")
            page.fill("#password", account["password"])

            update_action("Clicking login")
            log("Click login button")
            page.click("#login")

            update_action("Checking success")
            page.wait_for_selector("#dashboard", timeout=5000)
            log("Login success")
            browser.close()
            return True
        except Exception as e:
            log(f"Error: {e}")
            browser.close()
            return False
