#!/usr/bin/env python3
from models.user import User
from models.exam import Exam, user_exam_association
from app import app
from db import db
from sqlalchemy import update

with app.app_context():
    result = Exam.query.filter_by(id=2).first()
    print(result.is_accessable)
    result.is_accessable = True
    print(result.is_accessable)
    db.session.commit()