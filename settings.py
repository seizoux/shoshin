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