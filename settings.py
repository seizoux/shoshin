from dotenv import load_dotenv
import os

load_dotenv()

RESONATORS = [
        "Rover", "Rover havoc", "Yinlin", "Jianxin", "Lingyang",
        "Baizhi", "Yangyang", "Yuanwu", "Taoqi",
        "Aalto", "Chixia", "Mortefi", "Sanhua", "Danjin",
        "Jiyan", "Verina", "Calcharo", "Encore", "Changli",
        "Jinhsi"
    ]

DATABASE_URL = os.getenv("DATABASE_URL")
DB = os.getenv("DB")
API_DATABASE_URL = os.getenv("API_DB")

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
DISCORD_CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
DISCORD_CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET")
DISCORD_REDIRECT_URI = os.getenv("DISCORD_REDIRECT_URI")

CF_ENDPOINT_R2 = os.getenv("CF_ENDPOINT_R2")
CF_SECRET_KEY = os.getenv("CF_SECRET_KEY")
CF_ACCESS_KEY = os.getenv("CF_ACCESS_KEY")

# Replace with your own credentials
PATREON_CLIENT_ID = os.getenv("PATREON_CLIENT_ID")
PATREON_CLIENT_SECRET = os.getenv("PATREON_CLIENT_SECRET")
PATREON_ACCESS_TOKEN = os.getenv("PATREON_ACCESS_TOKEN")

SENTRY_DSN = os.getenv("SENTRY_DSN")

RECAPTCHA_PROJECT_ID = os.getenv("RECAPTCHA_PROJECT_ID")
RECAPTCHA_KEY = os.getenv("RECAPTCHA_KEY")

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")