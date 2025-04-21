from flask import Flask
from extensions import db
from models import User
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from dotenv import load_dotenv
import os
from flask_bcrypt import Bcrypt
from datetime import date


app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

bcrypt = Bcrypt()

# Use your PostgreSQL credentials here
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://neelshah:Neel11@localhost:5432/plantric'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


load_dotenv()
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=10)

db.init_app(app)
jwt = JWTManager(app)




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

    token = create_access_token(identity={"email": user.email, "name": user.username, "role": user.role})
    
    return jsonify(
        user={"email": user.email, "displayName": user.username, "role": user.role},
        access_token=token
    ), 200



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

# Sign Up Route (example only)
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

# Protected Route
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify(user=current_user)

if __name__ == '__main__':
        app.run(debug=True, port=5001)
