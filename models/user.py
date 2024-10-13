from flask_security import UserMixin, RoleMixin, AsaList
from db import db
from sqlalchemy.ext.mutable import MutableList
from models.exam import Exam, user_exam_association
from sqlalchemy import update

# Define the Role and User models

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)

# class UserExam(db.Model):
#     __tablename__ = 'user_exam'

#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
#     exam_id = db.Column(db.Integer, db.ForeignKey('exam.id'), primary_key=True)
#     score = db.Column(db.Integer, nullable=True)


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer(), primary_key=True)
    first_name = db.Column(db.String(150), unique=True)
    last_name = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(255))
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean(), default=True)
    roles = db.relationship('Role', secondary='user_roles')
    type = db.Column(db.String(25))
    student_id = db.Column(db.Integer())
    grades = db.Column(MutableList.as_mutable(AsaList()))
    exams = db.relationship('Exam', secondary=user_exam_association, back_populates='user')

    def add_grade_of_exam(self, exam_id, score=0, answers=[]):
        existing_entry = db.session.query(user_exam_association).filter_by(
                user_id=self.id,
                exam_id=exam_id
            ).first()

        if existing_entry:
            # Update the score if the entry exists
            print("score updated")
            stmt = update(user_exam_association).where(
                    (user_exam_association.c.user_id == self.id) &
                    (user_exam_association.c.exam_id == exam_id)
                ).values(score=score, answers=answers)
            db.session.execute(stmt)
        else:
            # Create a new association if it does not exist
            print("score added")
            new_entry = user_exam_association.insert().values(
                user_id=self.id,
                exam_id=exam_id,
                score=score,
                answers=answers
            )
            db.session.execute(new_entry)
        db.session.commit()
    
    def get_exam_result(self, exam_id):
        existing_entry = db.session.query(user_exam_association).filter_by(
                user_id=self.id,
                exam_id=exam_id
            ).first()

        if existing_entry:
            # Update the score if the entry exists
            score = existing_entry.score
            answers = existing_entry.answers
            print(existing_entry)
            return {"score": score, "answers":answers, "name": self.first_name}
        else:
            return {"message": "no data found"}

    def get_exams(self):
        results = db.session.query(user_exam_association).filter_by(user_id=self.id).all()
        exams_list = []
        for result in results:
            exam = Exam.query().filter_by(id=exam.id).first()
            exam_dict = {"exam_name": exam.name, "answers": result.answers,
                    "score": result.score}
            
    def exam_is_taken(self, exam_id):
        entery = db.session.query(user_exam_association).filter_by(
            user_id=self.id,
            exam_id=exam_id
        ).first()
        if entery:
            return True
        return False
        

class UserRoles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))
