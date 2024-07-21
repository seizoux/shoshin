from quart import Blueprint, current_app
from quart import request, jsonify
import settings as _WebSettings
import logging
from utility import PIL
from quart_cors import cors, route_cors
from utility.methods import requires_valid_origin

api_bp = Blueprint('api', __name__, url_prefix='/api')
log = logging.getLogger("hypercorn")

@api_bp.route('/env', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def get_env():

    _vv = {
        "recaptcha_token": _WebSettings.RECAPTCHA_TOKEN,
        "google_client_id": _WebSettings.GOOGLE_CLIENT_ID,
        "u:/": _WebSettings.URLS,
    }

    data = await request.get_json()
    return jsonify({'key': _vv[data['key']]})

@api_bp.route('/username/availability', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def check_username():
    data = await request.get_json()
    if not data:
        return {"status": "error", "message": "No data provided."}

    if not 'username' in data:
        return {"status": "error", "message": "Missing required field: username"}

    user = await current_app.pool.fetchrow("SELECT * FROM users WHERE username = $1", data['username'])
    if user:
        return {"status": "error", "message": "This username is already taken.", "result": False}
    else:
        return {"status": "success", "message": "This username is available.", "result": True}
    
@api_bp.route("/api/generate_build", methods=["POST"])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
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
        current_app,
        is_mobile=True if device_type == 'mobile' else False,
        is_rover=True if data else False
    )

    try:
        return jsonify(result)
    except Exception as e:
        return result