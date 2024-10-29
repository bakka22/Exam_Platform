#!/usr/bin/env python3
from models.user import User
from models.exam import Exam, user_exam_association
from app import app, user_datastore
from db import db
from sqlalchemy import update

with app.app_context():
    user = user_datastore.create_user(first_name="Adil", last_name="Mageet", email="examiner@gmail.com", password="fuck", type='Examiner')
    db.session.commit()