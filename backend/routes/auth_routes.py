# routes/auth_routes.py

from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from extensions import db
from models import User

# Blueprint for auth routes
auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# Route for user sign in
@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity={"email": user.email, "name": user.username, "role": user.role})

    return jsonify(
        user={"email": user.email, "displayName": user.username, "role": user.role},
        access_token=token
    ), 200

# Route for user sign up
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("displayName")
    role = data.get("role", "user")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=name, email=email, password=hashed_password, role=role)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity={"email": email, "name": name, "role": role})

    return jsonify(user={"email": email, "name": name, "role": role}, access_token=token), 200
