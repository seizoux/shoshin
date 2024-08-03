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
    """Search for users by UID or username.

    Request JSON
    ------------
    token : str
        The session token of the user.
    search : str
        The UID or username to search for.

    Returns
    -------
    200 OK
    ---------
    status : str
        The status of the search process.
    payload : list
        The list of found users.
            - uid : str
                The UID of the user.
            - username : str
                The username of the user.
            - avatar : str
                The avatar of the user.
            - status : str
                The friendship status.
            - bio : str
                The bio of the user.

    400 Bad Request
    ---------------
    status : str
        The status of the search process.
    payload : str
        The error message.
    """
    data = await request.json
    token = data['token']
    search = data['search']

    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'}), 400
        return jsonify({'status': 'error', 'payload': 'User not found'}), 400

    user = data['payload']
    if not user:
        return jsonify({'status': 'error', 'payload': 'User not found'}), 400

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

    return jsonify({'status': 'success', 'payload': _f}), 200

@api_bp.route('/friends/request', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def send_friend_request():
    """Send a friend request to another user.

    Request JSON
    ------------
    token : str
        The session token of the user.
    friend_id : int
        The ID of the user to send a friend request to.

    Returns
    -------
    200 OK
    ---------
    status : str
        The status of the request process.
    payload : str
        The result of the friend request process.

    400 Bad Request
    ---------------
    status : str
        The status of the request process.
    payload : str
        The error message.
    """
    data = await request.json
    token = data['token']
    friend_id = data['friend_id']

    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'}), 400
        return jsonify({'status': 'error', 'payload': 'User not found'}), 400

    user = data['payload']

    friend = await current_app.pool.fetchrow('SELECT * FROM users WHERE uid=$1', int(friend_id))

    if not user or not friend:
        return jsonify({'status': 'error', 'payload': 'User not found'}), 400

    user_friends = json.loads(user['friends']) if user.get('friends') else None
    friend_friends = json.loads(friend['friends']) if friend.get('friends') else None

    if friend_friends:
        if int(user['uid']) in friend_friends['accepted']:
            return jsonify({'status': 'error', 'payload': 'Already friends'}), 400

    if user_friends:
        if int(friend_id) in user_friends['accepted']:
            return jsonify({'status': 'error', 'payload': 'Already friends'}), 400

    if not friend_friends:
        friend_friends = {
            'accepted': [],
            'requests': [],
            'blocked': []
        }

    if not user_friends:
        user_friends = {
            'accepted': [],
            'requests': [],
            'blocked': []
        }

    if user['uid'] in friend_friends['requests']:
        return jsonify({'status': 'error', 'payload': 'Request already sent'}), 400

    if user_friends:
        if friend['uid'] in user_friends['requests']:
            return jsonify({'status': 'error', 'payload': 'Pending request'}), 400

    friend_friends['requests'].append(user['uid'])

    await current_app.pool.execute(
        'UPDATE users SET friends=$1 WHERE uid=$2',
        json.dumps(friend_friends),
        int(friend_id)
    )

    if not user_friends:
        await current_app.pool.execute(
            'UPDATE users SET friends=$1 WHERE uid=$2',
            json.dumps({'requests': [friend['uid']]}),
            user['uid']
        )

    return jsonify({'status': 'success', 'payload': 'Friend request sent'}), 200

@api_bp.route('/friend/request/handle', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def handle_friend_request():
    """Handle incoming friend requests (accept or reject).

    Request JSON
    ------------
    token : str
        The session token of the user.
    friend_id : int
        The ID of the user who sent the friend request.
    action : str
        The action to take ('accept' or 'reject').

    Returns
    -------
    200 OK
    ---------
    status : str
        The status of the request process.
    payload : str
        The result of the friend request process.

    400 Bad Request
    ---------------
    status : str
        The status of the request process.
    payload : str
        The error message.
    """
    data = await request.json
    token = data['token']
    friend_id = data['friend_id']
    action = data['action']

    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'}), 400
        return jsonify({'status': 'error', 'payload': 'User not found'}), 400

    user = data['payload']
    friend = await current_app.pool.fetchrow('SELECT friends FROM users WHERE id=$1', friend_id)

    if not user or not friend:
        return jsonify({'status': 'error', 'payload': 'User not found'}), 400

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
        return jsonify({'status': 'error', 'payload': 'No friend request found'}), 400

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
    """Get the list of friends for the authenticated user.

    Parameters
    ----------
    token : str
        The session token of the user.

    Returns
    -------
    200 OK
    ---------
    status : str
        The status of the request process.
    payload : list
        The list of friends.
            - uid : str
                The UID of the friend.
            - username : str
                The username of the friend.
            - avatar : str
                The avatar of the friend.
            - bio : str
                The bio of the friend.

    400 Bad Request
    ---------------
    status : str
        The status of the request process.
    payload : str
        The error message.
    """
    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'}), 400
        return jsonify({'status': 'error', 'payload': 'User not found'}), 400

    user = data['payload']

    if not user:
        return jsonify({'status': 'error', 'payload': 'User not found'}), 400

    if not user.get('friends'):
        return jsonify({'status': 'error', 'payload': 'No friends found'}), 400
    
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
    """Get incoming and outgoing friend requests for the authenticated user.

    Request JSON
    ------------
    token : str
        The session token of the user.

    Returns
    -------
    200 OK
    ---------
    status : str
        The status of the request process.
    payload : dict
        The incoming and outgoing friend requests.
            - in : list
                - uid : str
                    The UID of the user who sent the friend request.
                - username : str
                    The username of the user who sent the friend request.
                - avatar : str
                    The avatar of the user who sent the friend request.
                - bio : str
                    The bio of the user who sent the friend request.
            - out : list
                - uid : str
                    The UID of the user to whom the friend request was sent.
                - username : str
                    The username of the user to whom the friend request was sent.
                - avatar : str
                    The avatar of the user to whom the friend request was sent.
                - bio : str
                    The bio of the user to whom the friend request was sent.

    400 Bad Request
    ---------------
    status : str
        The status of the request process.
    payload : str
        The error message.
    """
    data = await request.json
    token = data['token']

    data = await verify_session_token(token, False)
    if data['status'] == "error":
        if data['message'] == "Invalid session token.":
            return jsonify({'status': 'error', 'payload': 'Invalid session token'}), 400
        return jsonify({'status': 'error', 'payload': 'User not found'}), 400

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
    return jsonify({'status': 'error', 'payload': 'No friend requests found'}), 400

@api_bp.route('/env', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def get_env():
    """Get environment settings based on the provided key.

    Request JSON
    ------------
    key : str
        The key of the environment setting to retrieve.

    Returns
    -------
    200 OK
    ---------
    key : str
        The value of the environment setting.

    400 Bad Request
    ---------------
    status : str
        The status of the request process.
    payload : str
        The error message.
    """
    _vv = {
        "recaptcha_token": _WebSettings.RECAPTCHA_TOKEN,
        "google_client_id": _WebSettings.GOOGLE_CLIENT_ID,
        "u:/": _WebSettings.URLS,
    }

    data = await request.get_json()
    return jsonify({'key': _vv[data['key']]}), 200

@api_bp.route('/username/availability', methods=['POST'])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def check_username():
    """Check the availability of a username.

    Request JSON
    ------------
    username : str
        The username to check for availability.

    Returns
    -------
    200 OK
    ---------
    status : str
        The status of the request process.
    message : str
        The result of the availability check.
    result : bool
        Whether the username is available or not.

    400 Bad Request
    ---------------
    status : str
        The status of the request process.
    message : str
        The error message.
    """
    data = await request.get_json()
    if not data:
        return {"status": "error", "message": "No data provided."}, 400

    if 'username' not in data:
        return {"status": "error", "message": "Missing required field: username"}, 400

    user = await current_app.pool.fetchrow("SELECT * FROM users WHERE username = $1", data['username'])
    if user:
        return {"status": "error", "message": "This username is already taken.", "result": False}, 400
    else:
        return {"status": "success", "message": "This username is available.", "result": True}, 200
    
@api_bp.route("/generate_build", methods=["POST"])
@route_cors(allow_origin="https://beta.shoshin.moe")
@requires_valid_origin
async def gen_build():
    """Generate a build based on the provided files and payload.

    Request Headers
    ---------------
    User-Agent : str
        The User-Agent header of the request, indicating the client device type.

    Request Form Data
    -----------------
    confirmPayload : optional

    Request Files
    -------------
    files : list of files
        The files to be processed.

    Returns
    -------
    200 OK
    ---------
    status : str
        The status of the build process.
    result : dict
        The result of the build process.

    400 Bad Request
    ---------------
    status : str
        The status of the build process.
    result : str
        The error message.
    """
    user_agent = request.headers.get('User-Agent').lower()

    if 'windows' in user_agent:
        device_type = 'desktop'
    else:
        device_type = 'mobile'

    files = await request.files
    form = await request.form
    confirm_payload = form.get('confirmPayload')

    data = bool(confirm_payload)

    result = await PIL.process_images(
        files,
        current_app,
        is_mobile=device_type == 'mobile',
        is_rover=data
    )

    return jsonify({"status": "success", "result": result}), 200