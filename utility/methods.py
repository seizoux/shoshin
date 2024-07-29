import os
import time
import hashlib
from quart import current_app, request, jsonify, make_response
import hmac
import datetime
import json
import base64
from functools import wraps

secret_key = 'your-secret-key'  # Store this securely, e.g., in environment variables

class SnowflakeIDGenerator:
    """
    A class to generate unique IDs using the Snowflake algorithm.
    The Snowflake algorithm is used to generate unique IDs at a large scale in a distributed environment without the need for a central authority to allocate IDs.
    This class is a Python implementation of the Snowflake algorithm that generates unique IDs using the worker ID, timestamp, and sequence number.
    """
    def __init__(self):
        self.worker_id = os.getpid()
        self.sequence = 0
        self.last_timestamp = -1

    def generate_id(self):
        timestamp = int(time.time() * 1000)

        if timestamp == self.last_timestamp:
            self.sequence = (self.sequence + 1) & 4095
        else:
            self.sequence = 0

        self.last_timestamp = timestamp

        return (timestamp << 22) | (self.worker_id << 12) | self.sequence

def requires_valid_origin(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        origin = request.headers.get('Origin')
        allowed_origin = "https://beta.shoshin.moe"
        if origin != allowed_origin:
            return jsonify({"msg": "Forbidden"}), 403
        return await func(*args, **kwargs)
    return wrapper

# Function to create a session token
def create_session_token(username):
    token = hashlib.sha256(f"{username}{time.time()}".encode()).hexdigest()
    return token

# Function to verify session token
async def verify_session_token(token, just_verify: bool = True):
    if just_verify:
        _v = await current_app.pool.fetchrow("SELECT * FROM sessions WHERE token = $1", token)
        if not _v:
            return {"status": "error", "payload": False}
        return {"status": "success", "payload": True}
    
    _v = await current_app.pool.fetchrow("SELECT * FROM sessions WHERE token = $1", token)
    if not _v:
        return {"status": "error", "payload": "Invalid", "message": "Invalid session token."}
    
    data = await current_app.pool.fetchrow("SELECT * FROM users WHERE uid = $1", _v['uid'])
    if not data:
        return {"status": "error", "payload": "Invalid", "message": "Unable to find user."}
    
    return {"status": "success", "payload": data}

def sign_cookie(value):
    return hmac.new(secret_key.encode(), value.encode(), hashlib.sha256).hexdigest()

async def set_cookie(response, token, days):
    date = datetime.datetime.utcnow() + datetime.timedelta(days=days)
    expires = date.strftime("%a, %d-%b-%Y %H:%M:%S GMT")

    # Create a dictionary to store both the value and the expiration time
    cookie_value = {'raw': {'token': token, 'expiry': date.timestamp()}}
    cookie_value_json = json.dumps(cookie_value)

    # Base64 encode the JSON string to avoid issues with special characters
    cookie_value_encoded = base64.b64encode(cookie_value_json.encode()).decode()

    signature = sign_cookie(cookie_value_encoded)
    signed_value = f"{cookie_value_encoded}.{signature}"

    response.set_cookie(
        '_sho-session',
        value=signed_value,
        max_age=days * 24 * 60 * 60,
        httponly=True,
        secure=True,
        samesite='Strict',
        expires=expires
    )
    return response

def fetch_achievements(achievements):
    achivements_icons_folder_path = "https://beta.shoshin.moe/static/achievements"

    achievements_data = {
        "comment_post": {
            "name": "Social Butterfly",
            "description": "People love your comments, you've commented over 500 times!",
            "icon": f"{achivements_icons_folder_path}/comment_post.png"
        },
        "contributor": {
            "name": "Contributor",
            "description": "Developers love you, you've contributed to this project!",
            "icon": f"{achivements_icons_folder_path}/contributor.png"
        },
        "create_account": {
            "name": "One Of Us",
            "description": "Brave enough to join us, nothing less than a hero!",
            "icon": f"{achivements_icons_folder_path}/create_account.png"
        },
        "leave_a_like": {
            "name": "Sharing Love",
            "description": "Can't stop liking posts, you've liked over 1.500 posts!",
            "icon": f"{achivements_icons_folder_path}/leave_a_like.png"
        },
        "link_discord": {
            "name": "Multi-Platform",
            "description": "Uh-oh? Discord? Everything is connected!",
            "icon": f"{achivements_icons_folder_path}/link_discord.png"
        },
        "one_year": {
            "name": "Veteran",
            "description": "Not even moving, you've been here for over a year!",
            "icon": f"{achivements_icons_folder_path}/one_year.png"
        },
        "repost_post": {
            "name": "Repost King",
            "description": "Don't you get tired of reposting? You've reposted over 500 posts!",
            "icon": f"{achivements_icons_folder_path}/repost_post.png"
        },
        "select_gender": {
            "name": "Identified",
            "description": "They/them? He/him? She/her? Who knows... You do!",
            "icon": f"{achivements_icons_folder_path}/select_gender.png"
        },
        "special": {
            "name": "Truly Special",
            "description": "You're special! (seriously, you are)",
            "icon": f"{achivements_icons_folder_path}/special.png"
        },
        "upload_picture": {
            "name": "Memory Keeper",
            "description": "Every picture tells a story, you've uploaded over 200 pictures!",
            "icon": f"{achivements_icons_folder_path}/upload_picture.png"
        },
        "upload_video": {
            "name": "Videographer",
            "description": "Lights, camera, action! You've uploaded over 200 videos!",
            "icon": f"{achivements_icons_folder_path}/upload_video.png"
        }
    }

    for ach in achievements:
        if ach['name'] in achievements_data:
            achievements_data[ach['name']]['time'] = ach['time']

    return {
        "owned": [achievements_data[ach['name']] for ach in achievements if ach['name'] in achievements_data],
        "not_owned": [achievements_data[ach] for ach in achievements_data if ach not in [ac['name'] for ac in achievements]]
    }

    