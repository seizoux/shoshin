# This file is the main file for the web server. It handles all the routes and the main server setup.
import aiohttp
from flask import redirect
from quart import Quart, request, session, render_template, jsonify
import settings as _WebSettings
import asyncpg
import datetime
import logging
import colorlog
from quartcord import DiscordOAuth2Session
from utility import PIL

class WebQuart(Quart):
    def __init__(self, name, static_folder):
        super().__init__(name, static_folder=static_folder)
        self.pool: asyncpg.Pool = None
        self.discord: DiscordOAuth2Session = None
        self.session: aiohttp.ClientSession = None

    async def get_pool(self) -> asyncpg.Pool:
        return self.pool
    
app = WebQuart(__name__, static_folder="./static")

app.secret_key = b"random bytes representing quart secret key"

log = logging.getLogger("hypercorn")
log.setLevel(logging.INFO)

handler = logging.StreamHandler()
handler.setFormatter(
    colorlog.ColoredFormatter(
        "[APP] %(log_color)s%(message)s",
        log_colors={
            "DEBUG": "cyan",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "red,bg_white",
        },
    )
)

log.addHandler(handler)

app.config["DISCORD_CLIENT_ID"] = _WebSettings.DISCORD_CLIENT_ID  # Discord client ID.
app.config["DISCORD_CLIENT_SECRET"] = (
    _WebSettings.DISCORD_CLIENT_SECRET
)  # Discord client secret.
app.config["DISCORD_REDIRECT_URI"] = (
    _WebSettings.DISCORD_REDIRECT_URI
)  # URL to your callback endpoint.
app.config["DISCORD_BOT_TOKEN"] = _WebSettings.DISCORD_TOKEN

app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

@app.before_serving
async def startup():
    app.pool = await asyncpg.create_pool(_WebSettings.DB)
    log.info(f"[DATABASE] Connected: {app.pool}")
    app.session = aiohttp.ClientSession()

@app.before_request
def make_session_permanent():
    session.permanent = True

@app.route("/api/generate_build", methods=["POST"])
async def gen_build():
    files = await request.files
    result = await PIL.process_images(files, app)
    return jsonify(result)

@app.route("/privacy")
async def privacy():
    return await render_template("privacy.html")

@app.route("/wuwa/generate")
async def wuwagen():
    news_entry = await app.pool.fetch("SELECT * FROM news ORDER BY date DESC")
    return await render_template("wuwagen.html", news_entry=news_entry)


@app.route("/wuwa/news/publish", methods=["POST"])
async def wuwanews():
    data = await request.get_json()
    if not data:
        return {"status": "error", "message": "No data provided."}
    
    _must_have = [
        "title",
        "content",
        "author",
        "author_image_url",
        "footer",
        "date"
    ]

    if not all([x in data for x in _must_have]):
        return {"status": "error", "message": "Missing required fields: {}".format(", ".join([x for x in _must_have if x not in data]))}

    await app.pool.execute("INSERT INTO news (title, content, author, author_image_url, footer, date) VALUES ($1, $2, $3, $4, $5, $6)", data["title"], data["content"], data["author"], data["author_image_url"], data["footer"], datetime.datetime.utcfromtimestamp(data["date"]))

    return {"status": "success", "payload": data}

@app.route("/", methods=["GET"])
async def home():
    return redirect("https://shoshin.moe/wuwa/generate")