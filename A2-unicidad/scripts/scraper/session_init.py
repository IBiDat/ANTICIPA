from camoufox.sync_api import Camoufox
import os

LOGIN_URL = os.getenv("LOGIN_URL", "https://www.linkedin.com/login")


with Camoufox() as browser:
    context = browser.new_context()
    page = context.new_page()

    page.goto(LOGIN_URL)
    input("🔐 Please log in manually, then press ENTER...")

    # Save storage state to file
    context.storage_state(path="ld_session.json")
