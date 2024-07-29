from quart import current_app, request, jsonify, make_response, Blueprint
import hmac
import hashlib
import os
import datetime
import json
import base64
from utility.methods import sign_cookie

cookies_bp = Blueprint('cookies', __name__, url_prefix='/ck')

@cookies_bp.route('/getcookie', methods=['GET'])
async def get_cookie():
    cookie_name = request.args.get('name')
    if not cookie_name:
        return jsonify({'message': 'Cookie name not provided'}), 400

    cookie_value = request.cookies.get(cookie_name)
    if not cookie_value:
        return jsonify({'message': 'No cookie found'}), 404

    try:
        value, signature = cookie_value.rsplit('.', 1)
        if sign_cookie(value) != signature:
            return jsonify({'message': 'Invalid cookie signature'}), 403

        # Base64 decode the value
        cookie_value_json = base64.b64decode(value).decode()
        return jsonify(json.loads(cookie_value_json))
    except Exception as e:
        return jsonify({'message': 'Error parsing cookie'}), 400

@cookies_bp.route('/erasecookie', methods=['GET'])
async def erase_cookie():
    cookie = request.headers.get('Cookie')
    response = await make_response(jsonify({'message': 'Cookie erased'}))
    response.set_cookie(cookie, '', expires=0)
    return response