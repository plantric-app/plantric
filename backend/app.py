# app.py
# Entry point for the Flask application.
# This file sets up the app, configures extensions (CORS, JWT, DB), and registers blueprints.

from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from extensions import db
from app_config.config import Config

# Import route blueprints from the routes directory
from routes.user_routes import user_bp
from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp

# Initialize Flask app
app = Flask(__name__)

# Enable CORS to allow communication with frontend (React running on localhost:3000)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Load application configuration (database URI, JWT secret, etc.)
app.config.from_object(Config)

# Initialize extensions
bcrypt = Bcrypt()         # For password hashing
jwt = JWTManager(app)     # For JWT-based authentication

# Bind SQLAlchemy DB to app
db.init_app(app)

# Register route blueprints with specific prefixes
app.register_blueprint(user_bp, url_prefix='/api')        # User CRUD + invite link
app.register_blueprint(auth_bp, url_prefix='/api/auth')   # Auth: login/signup
app.register_blueprint(profile_bp, url_prefix='/api/user')# Protected profile route

# Basic test route to check if the app is up
@app.route('/')
def home():
    return 'Flask with PostgreSQL is working!'

# Start the Flask development server
if __name__ == '__main__':
    app.run(debug=True, port=5001)
