# Create a file init_db.py (or run in app.py with app_context)

from app import app
from extensions import db


with app.app_context():
    db.drop_all()
    db.create_all()
    print("Tables created")
