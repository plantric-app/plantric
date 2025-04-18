# from extensions import db
# from sqlalchemy import Column, Integer, String
<<<<<<< Updated upstream
=======

# class User(db.Model):
#     id = Column(Integer, primary_key=True)
#     username = Column(String(50), nullable=False)
#     email = Column(String(120), unique=True, nullable=False)
#     password = Column(String(200), nullable=False)
#     role = Column(String(50), nullable=False)

from extensions import db
from sqlalchemy import Column, Integer, String
>>>>>>> Stashed changes

# class User(db.Model):
#     id = Column(Integer, primary_key=True)
#     username = Column(String(50), nullable=False)
#     email = Column(String(120), unique=True, nullable=False)
#     password = Column(String(200), nullable=False)
#     role = Column(String(50), nullable=False)

from extensions import db
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.dialects.postgresql import BOOLEAN

# ---------- User Table ----------
class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(200), nullable=False)
    role = Column(String(50), nullable=False)
<<<<<<< Updated upstream
    dob = Column(Date, nullable=True)
    profile = Column(String(250), nullable=True)
    bio = Column(String(250), nullable=True)
    gender = Column(String(50), nullable=True)
    isActive = Column(BOOLEAN, default=True)

# ---------- WBS Form Table ----------
# class wbsForm(db.Model):
#     id = Column(Integer, primary_key=True)
#     projectname = Column(String(50), nullable=False)
#     domain = Column(String(50), nullable=False)
#     projectdescription = Column(String(100), nullable=False)
#     techstack = Column(String(50), nullable=False)
#     developmentmethod = Column(String(50), nullable=False)
#     surveymethod = Column(String(50), nullable=False)
#     nonfunreq = Column(String(500), nullable=False)
#     funreq = Column(String(500), nullable=False)
#     startdate = Column(Date, nullable=False)
#     enddate = Column(Date, nullable=False)
#     projectmilstone = Column(String(100), nullable=False)
#     additionalinstruction = Column(String(100), nullable=False)

# ---------- Company Table ----------
class compTable(db.Model):
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(250), nullable=False)
    email = Column(String(250), unique=True, nullable=False)
    isActive = Column(BOOLEAN, default=True)

# ---------- User Role Table ----------
class userRole(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)

    company_id = Column(Integer, ForeignKey('comp_table.id'), nullable=False)
    role = Column(String(250), nullable=False)

# ---------- Team Table ----------
class team(db.Model):
    id = Column(Integer, primary_key=True)
    created_by = Column(Integer, ForeignKey('user.id'), nullable=False)
    company_id = Column(Integer, ForeignKey('comp_table.id'), nullable=False)
    team_name = Column(String(250), nullable=False)

# ---------- Team Member Table ----------
class teamMember(db.Model):
    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    team_id = Column(Integer, ForeignKey('team.id'), nullable=False)
=======
>>>>>>> Stashed changes
