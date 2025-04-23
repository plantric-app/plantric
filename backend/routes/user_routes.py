from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from utils.mailer import send_invite_email  # we'll create this
from sqlalchemy.exc import IntegrityError

user_bp = Blueprint('user', __name__)

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

        send_invite_email(email, username)  # 💌 fire that SMTP
        return jsonify({"message": "User created and invite sent"}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Email already exists"}), 409

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email, "is_active": u.is_active}
        for u in users
    ])

@user_bp.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    user = User.query.get_or_404(id)

    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.is_active = data.get('is_active', user.is_active)

    db.session.commit()
    return jsonify({"message": "User updated"})

@user_bp.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})
