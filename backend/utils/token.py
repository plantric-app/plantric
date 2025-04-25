from itsdangerous import URLSafeTimedSerializer
import os

def generate_invite_token(user_id):
    secret_key = os.getenv("INVITE_SECRET", "super-secret-key")
    serializer = URLSafeTimedSerializer(secret_key)
    return serializer.dumps(user_id, salt="invite-link")

def verify_invite_token(token, max_age=86400): 
    secret_key = os.getenv("INVITE_SECRET", "super-secret-key")
    serializer = URLSafeTimedSerializer(secret_key)
    try:
        user_id = serializer.loads(token, salt="invite-link", max_age=max_age)
        return user_id
    except Exception as e:
        print("❌ Invalid or expired token:", e)
        return None
