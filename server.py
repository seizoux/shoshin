# This file is the main file for the web server. It handles all the routes and the main server setup.
import aiohttp
from quart import Quart, redirect, request, session, render_template, jsonify, Response, url_for
import settings as _WebSettings
import asyncpg
import datetime
import logging
from quartcord import DiscordOAuth2Session
import sentry_sdk
from sentry_sdk.integrations.quart import QuartIntegration
from blueprints.api import api_bp
from blueprints.auth import auth_bp
from blueprints.captchag import captcha_bp
import json
from utility.methods import verify_session_token

sentry_sdk.init(
    dsn=_WebSettings.SENTRY_DSN,
    integrations=[QuartIntegration()],
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)

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

app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

# Register blueprints
app.register_blueprint(api_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(captcha_bp)

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
    
@app.route("/privacy")
async def privacy():
    return await render_template("legal/privacy.html")

@app.route("/terms")
async def terms():
    return await render_template("legal/terms.html")

@app.route("/guidelines")
async def cguidelines():
    return await render_template("legal/cguidelines.html")

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
    news_entry = await app.pool.fetch("SELECT * FROM news ORDER BY date DESC")
    return await render_template(f"wuwagen.html", news_entry=news_entry)

@app.route("/login")
async def login():
    return await render_template("auth/auth.html")

@app.route("/register")
async def register():
    return await render_template("auth/register.html")

@app.route("/profile/manage")
async def view_profile():
    uid_cookie = request.cookies.get('_sho-session')
    if uid_cookie:
        uid_data = json.loads(uid_cookie)
        data = await verify_session_token(uid_data['raw']['token'], False)
        if data['status'] == "error":
            if data['message'] == "Invalid session token.":
                await app.pool.execute("DELETE FROM sessions WHERE token = $1", uid_data['raw']['token'])
                await app.pool.execute("UPDATE users SET sessions = array_remove(sessions, $1)", uid_data['raw']['token'])
            return redirect(url_for('login'))
        return await render_template("profile/account.html", data=data['payload'])
    
    return redirect(url_for('login'))