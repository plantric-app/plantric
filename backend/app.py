from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from dotenv import load_dotenv
import os
from flask_bcrypt import Bcrypt
from datetime import date
from routes.user_routes import user_bp


app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

bcrypt = Bcrypt()

# Use your PostgreSQL credentials here
# General DB Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://neelshah:Neel11@localhost:5432/plantric'
from extensions import db, bcrypt, jwt, migrate
from models import User
from flask_jwt_extended import create_refresh_token

app = Flask(__name__)
load_dotenv()

# App configs
# DB Config for Dvip
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)


# User table routes
app.register_blueprint(user_bp, url_prefix='/api')

# Init extensions
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
migrate.init_app(app, db)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
#     response.headers.add('Access-Control-Allow-Credentials', 'true')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
#     return response

@app.route('/')
def home():
    return 'Flask with PostgreSQL is working!'

@app.route('/add')
def add_user():
# DB Credentials for the Neel & Arth
    hashed_password = bcrypt.generate_password_hash("neel11").decode('utf-8')
    user = User(
        username='Neel',
        email='neelshah@gmail.com',
        password=hashed_password,
        role='admin',
        dob = date(2001, 5, 22),  # 👈 provide a valid date
        profile=None,
        bio=None,
        gender=None
        )
# DB Credentials for Dvip
    hashed_password = bcrypt.generate_password_hash("5;4+0IOx:\\Dy").decode('utf-8')
    user = User(username='admin', email='admin@fusetheme.com', password=hashed_password, role='admin')
    db.session.add(user)
    db.session.commit()
    return 'User added!'


USERS = {
    "admin@fusetheme.com": {
        "password": "5;4+0IOx:\\Dy",
        "name": "Admin User"
    }
}

# Login Route
# @app.route('/api/auth/signin', methods=['POST'])
# def signin():
    
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")


#     if not email or not password:
#         return jsonify({"message": "Email and password are required"}), 400

#     user = User.query.filter_by(email=email).first()

#     if not user or not bcrypt.check_password_hash(user.password, password):
#         return jsonify({"message": "Invalid credentials"}), 401

#     token = create_access_token(identity={"email": user.email, "name": user.username, "role": user.role})
    
#     return jsonify(
#         user={"email": user.email, "displayName": user.username, "role": user.role},
#         access_token=token
#     ), 200

@app.route('/api/auth/signin', methods=['POST'])
def signin():
    # if request.method == 'OPTIONS':
    #     return '', 204  # Preflight response

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    identity = {
        "email": user.email,
        "name": user.username,
        "role": user.role
    }

    token = create_access_token(identity=identity)
    # refresh_token = create_refresh_token(identity=identity)

    return jsonify(
        user=identity,
        access_token=token,
        # refresh_token=refresh_token  
    ), 200
    
    
@app.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token)


# If session is still active
# @app.route('/api/auth/me', methods=['GET'])
# @jwt_required()
# def get_me():
#     print("🔐 AUTH HEADER:", request.headers.get('Authorization'))
#     current_user = get_jwt_identity()  # ✅ This gets the identity from the token
#     return jsonify({
#         "email": current_user["email"],
#         "displayName": current_user["name"],
#         "role": current_user["role"]
#     }), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user = get_jwt_identity()
    return jsonify({
        "email": current_user["email"],
        "displayName": current_user["name"],
        "role": current_user["role"]
    }), 200

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
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

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify(user=current_user)

if __name__ == '__main__':
        app.run(debug=True, port=5001)
