import os
import time
import hashlib
from quart import current_app
import hmac

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

# Function to create a session token
def create_session_token(username):
    token = hashlib.sha256(f"{username}{time.time()}".encode()).hexdigest()
    return token

# Function to verify session token
async def verify_session_token(token, just_verify: bool = True):
    if just_verify:
        _v = await current_app.pool.fetchrow("SELECT * FROM sessions WHERE token = $1", token)
        if not _v:
            return False
        return True
    
    _v = await current_app.pool.fetchrow("SELECT * FROM sessions WHERE token = $1", token)
    if not _v:
        return {"status": "error", "payload": "Invalid", "message": "Invalid session token."}
    
    data = await current_app.pool.fetchrow("SELECT * FROM users WHERE uid = $1", _v['uid'])
    if not data:
        return {"status": "error", "payload": "Invalid", "message": "Unable to find user."}
    
    return {"status": "success", "payload": data}

def sign_cookie(value):
    return hmac.new(secret_key.encode(), value.encode(), hashlib.sha256).hexdigest()
    