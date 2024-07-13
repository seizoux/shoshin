from quart import Blueprint, current_app
from quart import request, jsonify
import settings as _WebSettings

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/env', methods=['POST'])
async def get_env():

    _vv = {
        "recaptcha_token": _WebSettings.RECAPTCHA_TOKEN,
        "google_client_id": _WebSettings.GOOGLE_CLIENT_ID,
    }

    data = await request.get_json()
    return jsonify({'key': _vv[data['key']]})

@api_bp.route('/username/availability', methods=['POST'])
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