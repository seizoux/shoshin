import datetime
from quart import Blueprint, current_app
from quart import request, jsonify
import settings as _WebSettings
import logging
from utility import PIL
from quart_cors import cors, route_cors
from utility.methods import requires_valid_origin, verify_session_token
import json

api_bp = Blueprint('api', __name__, url_prefix='/api')
log = logging.getLogger("hypercorn")

@api_bp.route('/friends/search', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def search_user():
    data = await request.json
    token = data['token']
    search = data['search']

    # Verify the session token
    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'})
        return jsonify({'status': 'error', 'payload': 'User not found'})

    user = data['payload']
    if not user:
        return jsonify({'status': 'error', 'payload': 'User not found'})

    friends = json.loads(user['friends']) if user.get('friends') else None
    if not search:
        raise ValueError("Search parameter must not be empty")

    try:
        search_int = int(search)
        is_int = True
    except ValueError:
        is_int = False

    if is_int:
        query = 'SELECT * FROM users WHERE uid=$1::bigint'
        params = [search_int]
    else:
        query = 'SELECT * FROM users WHERE username ILIKE $1'
        params = [f'%{search}%']

    friend = await current_app.pool.fetch(query, *params)
    _f = []
    for f in friend:
        if is_int and f['uid'] != search_int:
            continue
        status = 'request already sent' if friends and 'requests' in friends and f['uid'] in friends['requests'] else 'not friends'
        _f.append({
            'uid': str(f['uid']),
            'username': f['username'],
            'avatar': f['avatar'],
            'status': status,
            'bio': f['bio']
        })

    return jsonify({'users': _f}), 200

@api_bp.route('/friends/request', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def send_friend_request():
    data = await request.json
    token = data['token']
    friend_id = data['friend_id']

    # Verify the session token
    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'})
        return jsonify({'status': 'error', 'payload': 'User not found'})

    user = data['payload']

    friend = await current_app.pool.fetchrow('SELECT * FROM users WHERE uid=$1', int(friend_id))

    if not user or not friend:
        return jsonify({'status': 'error', 'payload': 'User not found'})

    user_friends = json.loads(user['friends']) if user.get('friends') else None
    friend_friends = json.loads(friend['friends']) if friend.get('friends') else None

    if friend_friends:
        if int(user['uid']) in friend_friends['accepted']:
            return jsonify({'status': 'error', 'payload': 'Already friends'})

    if user_friends:
        if int(friend_id) in user_friends['accepted']:
            return jsonify({'status': 'error', 'payload': 'Already friends'})

    if not friend_friends:
        friend_friends = {
            'accepted': [],
            'requests': [],
            'blocked': []
        }

    if user['uid'] in friend_friends['requests']:
        return jsonify({'status': 'error', 'payload': 'Request already sent'})

    friend_friends['requests'].append(user['uid'])

    await current_app.pool.execute(
        'UPDATE users SET friends=$1 WHERE uid=$2',
        json.dumps(friend_friends),
        int(friend_id)
    )

    return jsonify({'status': 'success', 'payload': 'Friend request sent'}), 200

@api_bp.route('/friend/request/handle', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def handle_friend_request():
    data = await request.json
    token = data['token']
    friend_id = data['friend_id']
    action = data['action']

    # Verify the session token
    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'})
        return jsonify({'status': 'error', 'payload': 'User not found'})

    user = data['payload']
    friend = await current_app.pool.fetchrow('SELECT friends FROM users WHERE id=$1', friend_id)

    if not user or not friend:
        return jsonify({'status': 'error', 'payload': 'User not found'})

    if not friend_friends:
        friend_friends = {
            'accepted': [],
            'requests': [],
            'blocked': []
        }
    else:
        friend_friends = json.loads(friend['friends'])

    if not user_friends:
        user_friends = {
            'accepted': [],
            'requests': [],
            'blocked': []
        }
    else:
        user_friends = json.loads(user['friends'])

    if 'requests' not in user_friends or friend_id not in user_friends['requests']:
        return jsonify({'status': 'error', 'payload': 'No friend request found'})

    user_friends['requests'].remove(friend_id)

    if action == 'accept':
        user_friends['accepted'].append({'uid': friend_id, 'friends_since': datetime.datetime.now()})
        friend_friends['accepted'].append({'uid': user['uid'], 'friends_since': datetime.datetime.now()})
        await current_app.pool.execute('UPDATE users SET friends=$1 WHERE id=$2', json.dumps(friend_friends), friend_id)

    await current_app.pool.execute('UPDATE users SET friends=$1 WHERE id=$2', json.dumps(user_friends), user['uid'])

    return jsonify({'status': 'success', 'payload': f'Friend request {action}ed'}), 200

@api_bp.route('/friends/<token>', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def friends_list(token):
    # Verify the session token
    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'})
        return jsonify({'status': 'error', 'payload': 'User not found'})

    user = data['payload']

    if not user:
        return jsonify({'status': 'error', 'payload': 'User not found'})

    if not user.get('friends'):
        return jsonify({'status': 'error', 'payload': 'No friends found'})
    
    friends = json.loads(user['friends'])

    friends_data = []
    for friend_id in friends['accepted']:
        friend = await current_app.pool.fetchrow('SELECT * FROM users WHERE uid=$1', friend_id)
        friends_data.append({
            'uid': str(friend['uid']),
            'username': friend['username'],
            'avatar': friend['avatar'],
            'bio': friend['bio']
        })

    return jsonify({'status': 'success', 'payload': friends_data}), 200

@api_bp.route('/friends/requests/in-out', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def friends_requests():
    data = await request.json
    token = data['token']

    # Verify the session token
    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'})
        return jsonify({'status': 'error', 'payload': 'User not found'})

    user = data['payload']

    if user.get('friends'):
        friends = json.loads(user['friends'])

        requests = friends['requests']
        _in = []
        for uid in requests:
            friend = await current_app.pool.fetchrow('SELECT * FROM users WHERE uid=$1', uid)
            _in.append({
                'uid': friend['uid'],
                'username': friend['username'],
                'avatar': friend['avatar'],
                'bio': friend['bio']
            })

        _out = []
        all_users = await current_app.pool.fetch('SELECT * FROM users')
        for u in all_users:
            if u.get('friends'):
                _friends = json.loads(u['friends'])
                if user['uid'] in _friends['requests']:
                    _out.append({
                        'uid': str(user['uid']),
                        'username': u['username'],
                        'avatar': u['avatar'],
                        'bio': u['bio']
                    })

        return jsonify({'status': 'success', 'payload': {'in': _in, 'out': _out}}), 200
    return jsonify({'status': 'error', 'payload': 'No friend requests found'}), 200

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