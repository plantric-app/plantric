from extensions import db
from sqlalchemy import Column, Integer, String , Date

class User(db.Model):
    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(200), nullable=False)

class wbsForm(db.Model):
    id= Column(Integer, primary_key=True)
    projectname= Column(String(50), nullable=False)
    domain= Column(String(50), nullable=False)
    projectdescription=Column(String(100), nullable=False)
    techstack= Column(String(50), nullable=False)
    developmentmethod=Column(String(50), nullable=False)
    surveymethod=Column(String(50), nullable=False)
    nonfunreq=Column(String(500), nullable=False)
    funreq=Column(String(500), nullable=False)
    startdate = Column(Date, nullable=False)
    enddate = Column(Date, nullable=False)
    projectmilstone=Column(String(100), nullable=False)
    additionalinstruction=Column(String(100), nullable=False)