from flask import Flask
from extensions import db
from models import User

app = Flask(__name__)

# Use your PostgreSQL credentials here
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:Arth1827@localhost:5432/plantric'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/')
def home():
    return 'Flask with PostgreSQL is working!'

@app.route('/add')
def add_user():
    user = User(username='admin', email='admin@example.com', phone=9898030024)
    db.session.add(user)
    db.session.commit()
    return 'User added!'

if __name__ == '__main__':
    app.run(debug=True)
