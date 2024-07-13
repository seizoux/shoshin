# This file is the main file for the web server. It handles all the routes and the main server setup.
import aiohttp
from quart import Quart, request, session, render_template, jsonify, Response
import settings as _WebSettings
import asyncpg
import datetime
import logging
import colorlog
from quartcord import DiscordOAuth2Session
from utility import PIL
import sentry_sdk
from sentry_sdk.integrations.quart import QuartIntegration
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from blueprints.api import api_bp
from blueprints.auth import auth_bp
from blueprints.captchag import captcha_bp

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

@app.route("/api/generate_build", methods=["POST"])
async def gen_build():
    user_agent = request.headers.get('User-Agent').lower()  # Retrieve the User-Agent header and convert to lowercase for easier matching

    # Check if the User-Agent indicates a mobile device
    if 'windows' in user_agent:
        device_type = 'desktop'
    else:
        device_type = 'mobile'

    # Get files from request
    files = await request.files
    # Get the confirmPayload from the form data
    form = await request.form
    confirm_payload = form.get('confirmPayload')

    if confirm_payload:
        data = True
    else:
        data = False

    if data:
        log.info(f"[INFO] Received data: {data}")

    result = await PIL.process_images(
        files,
        app,
        is_mobile=True if device_type == 'mobile' else False,
        is_rover=True if data else False
    )

    try:
        return jsonify(result)
    except Exception as e:
        return result
    
@app.route("/privacy")
async def privacy():
    return await render_template("legal/privacy.html")

@app.route("/terms")
async def terms():
    return await render_template("legal/terms.html")

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

@app.route("/mailtest")
async def mailtest():
    privacy_policy_url = "https://shoshin.moe/privacy"
    terms_url = "https://shoshin.moe/terms"

    message = Mail(
        from_email='no-reply@shoshin.moe',
        to_emails='pistolamario0@gmail.com',
        subject='Welcome to Shoshin!'
    )

    message.dynamic_template_data = {
        'VERIFICATION_CODE': 739234,
    }
    
    message.template_id = "d-b68f308872694602ae2c6183a0daa077"

    try:
        sg = SendGridAPIClient(_WebSettings.SENDGRID_API_KEY)
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        return {"status": "error", "payload": "Email sent"}
    except Exception as e:
        print(e.message)
        return {"status": "error", "payload": "Email not sent", "error": e}