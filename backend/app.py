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


app = Flask(__name__)
CORS(app)

bcrypt = Bcrypt()

# Use your PostgreSQL credentials here
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:Arth1827@localhost:5432/plantric'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


load_dotenv()
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)

db.init_app(app)
jwt = JWTManager(app)

@app.route('/')
def home():
    return 'Flask with PostgreSQL is working!'

@app.route('/add')
def add_user():
    hashed_password = bcrypt.generate_password_hash("5;4+0IOx:\\Dy").decode('utf-8')
    user = User(username='admin', email='admin@fusetheme.com', password = hashed_password)
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
@app.route('/api/auth/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity={"email": user.email, "name": user.username})
    
    return jsonify(
        user={"email": user.email, "name": user.username},
        access_token=token
    ), 200

# If session is still active
@app.route('/api/auth/me', methods=['GET'])
def get_me():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'message': 'Token missing'}), 401

    token = auth_header.split(" ")[1]
    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user = User.query.get(decoded['user_id'])
        return jsonify({
            'id': user.id,
            'email': user.username,
            'displayName': user.username
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401



# Sign Up Route (example only)
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("displayName")

    if email in USERS:
        return jsonify({"message": "User already exists"}), 400

    USERS[email] = {"password": password, "name": name}
    token = create_access_token(identity={"email": email, "name": name})
    return jsonify(user={"email": email, "name": name}, access_token=token)

# Protected Route
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify(user=current_user)

if __name__ == '__main__':
    app.run(debug=True)
