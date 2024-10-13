#!/usr/bin/env python3
from models.user import User
from models.exam import Exam, user_exam_association
from app import app
from db import db
from sqlalchemy import update

with app.app_context():
    resutl = Exam.query.all()
    print(resutl)