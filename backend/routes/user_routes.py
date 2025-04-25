# routes/user_routes.py

from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.exc import IntegrityError
from extensions import db
from models import User
from utils.mailer import send_invite_email
from utils.token import verify_invite_token

# Blueprint for user routes
user_bp = Blueprint('user', __name__)

# Route to create a new user and send invite email
@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')

    if not username or not email:
        return jsonify({"message": "Username and email required"}), 400

    try:
        new_user = User(username=username, email=email, is_active=False)
        db.session.add(new_user)
        db.session.commit()

        # Send email with invite link
        send_invite_email(new_user, current_app)
        return jsonify({"message": "User created and invite sent"}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Email already exists"}), 409

# Route to retrieve all users
@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email, "is_active": u.is_active}
        for u in users
    ])

# Route to update an existing user
@user_bp.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    user = User.query.get_or_404(id)

    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.is_active = data.get('is_active', user.is_active)

    db.session.commit()
    return jsonify({"message": "User updated"})

# Route to delete a user
@user_bp.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})

# Route to handle invite link with token verification
@user_bp.route('/invite', methods=['GET'])
def handle_invite():
    token = request.args.get('token')
    user_id = verify_invite_token(token)

    if not user_id:
        return jsonify({"message": "Invalid or expired invite link"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "message": "Welcome to Plantric!",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username
        }
    }), 200
