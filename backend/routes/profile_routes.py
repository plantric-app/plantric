# routes/profile_routes.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# Blueprint for protected user profile route
profile_bp = Blueprint('profile', __name__)

# Route to get current user's profile info using JWT
@profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()  # Get data embedded in JWT
    return jsonify(user=current_user)
