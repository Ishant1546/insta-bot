
from playwright.sync_api import sync_playwright
from bot.status import update_action
from bot.logger import log

def run_bot(account):
    browser = None
    try:
        with sync_playwright() as pw:
            update_action("Launching Chromium")
            log("Launching Chromium browser")

            browser = pw.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-gpu",
                    "--disable-dev-shm-usage",
                    "--disable-setuid-sandbox"
                ]
            )

            page = browser.new_page()

            login_url = "https://example.com/login"  
            update_action("Opening login page")
            log("Navigating to login page...")
            page.goto(login_url)

            update_action("Typing email")
            log("Typing email")
            page.fill("input[name=email]", account["email"])

            update_action("Typing password")
            log("Typing password")
            page.fill("input[name=password]", account["password"])

            update_action("Clicking login")
            log("Submitting login form")
            page.click("button[type=submit]")

            update_action("Waiting for dashboard")
            log("Waiting for dashboard selector")
            page.wait_for_selector("#dashboard", timeout=7000)

            update_action("Login success")
            log("Login success")

            browser.close()
            return True

    except Exception as e:
        update_action("Error occurred")
        log("ERROR: " + str(e))
        if browser:
            try: browser.close()
            except: pass
        return False
