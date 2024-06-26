# This file is the main file for the web server. It handles all the routes and the main server setup.
import aiohttp
from flask import redirect
from quart import Quart, request, session, render_template, jsonify, Response
import settings as _WebSettings
import asyncpg
import datetime
import logging
import colorlog
from quartcord import DiscordOAuth2Session
from utility import PIL

async def get_patrons():
    url = 'https://www.patreon.com/api/oauth2/v2/campaigns/6344774/members'
    headers = {
        'Authorization': f'Bearer {_WebSettings.PATREON_ACCESS_TOKEN}',
        'Content-Type': 'application/json',
    }

    params = {
        'include': 'user,currently_entitled_tiers',
        'fields[member]': 'full_name,patron_status',
        'fields[user]': 'full_name,image_url',
        'fields[tier]': 'title'
    }
    r = await app.session.get(url, headers=headers, params=params)
    return await r.json()

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

@app.route('/patrons', methods=['GET'])
async def patrons():
    data = await get_patrons()
    return jsonify(data)

@app.route('/proxy')
async def proxy():
    url = request.args.get('url')
    if not url:
        app.logger.error("URL parameter is missing")
        return Response("URL parameter is missing", status=400)

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as resp:
                if resp.status != 200:
                    app.logger.error(f"Error fetching the resource: {resp.status}")
                    return Response("Error fetching the resource", status=resp.status)
                data = await resp.read()
                return Response(data, content_type=resp.content_type)
    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return Response(f"Error occurred: {str(e)}", status=500)

@app.route("/api/generate_build", methods=["POST"])
async def gen_build():
    user_agent = request.headers.get('User-Agent').lower()  # Retrieve the User-Agent header and convert to lowercase for easier matching

    # Check if the User-Agent indicates a mobile device
    if 'windows' in user_agent:
        device_type = 'desktop'
    else:
        device_type = 'mobile'

    files = await request.files
    result = await PIL.process_images(files, app, is_mobile=True if device_type == 'mobile' else False)
    try:
        return jsonify(result)
    except Exception as e:
        return result
        log.info(f"[ERROR] Error in Generating Build: {e}")
        return jsonify({"error": str(e)})

@app.route("/yinlin/privacy")
async def privacy():
    return await render_template("privacy.html")

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
    user_language = request.headers.get('Accept-Language', 'en').split(',')[0]
    language_map = {
        'en': 'https://shoshin.moe/en',
        'es': 'https://shoshin.moe/es',
        'it': 'https://shoshin.moe/it'
        # Add more language mappings as needed
    }
    # Find the matching URL or default to English
    redirect_url = language_map.get(user_language[:2], 'https://shoshin.moe/en')
    return redirect(redirect_url)

@app.route("/<lang>")
async def home_lang(lang):
    supported_languages = ['en', 'es', 'it']  # Add more supported languages as needed
    lang = lang if lang in supported_languages else 'en'
    news_entry = await app.pool.fetch("SELECT * FROM news ORDER BY date DESC")
    return await render_template(f"{lang}/wuwagen.html", news_entry=news_entry)