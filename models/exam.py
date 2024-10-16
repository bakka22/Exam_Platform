from db import db
from flask_security import AsaList
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import JSON


user_exam_association = db.Table('user_exam',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('exam_id', db.Integer, db.ForeignKey('exam.id')),
    db.Column('score', db.Integer, nullable=True),  # Store score here
    db.Column('answers', MutableList.as_mutable(AsaList()))
)

class Exam(db.Model):
    __tablename__ = 'exam'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    examiner = db.Column(db.String(80), nullable=True)
    Question = db.relationship('Question', back_populates='exam', lazy=True)
    question_count = db.Column(db.Integer())
    user = db.relationship('User', secondary=user_exam_association)
    answers = db.Column('answers', MutableList.as_mutable(JSON))
    is_accessable = db.Column(db.Boolean, default=True)

    def add_question(self, content, choices, time_limit, correct_answer, order):
        question = Question(
            content=content, choices=choices,
            number_of_choices=len(choices),
            time_limit=time_limit, exam_id=self.id,
            correct_answer=correct_answer,
            order=order)
        db.session.add(question)
        db.session.commit()

    def to_dict(self):
        questions = []
        for question in self.Question:
            questions.append(question.to_dict())
        dic = {"id": self.id, "name": self.name,
            "examiner": self.examiner, "questions": questions,
            "question_count": self.question_count}
        return dic
    
    def calculate_score(self, answers):
        score = 0
        for idx, answer in enumerate(answers):
            if int(self.answers[idx]) == int(answer):
                score += 1
        return score
    
    def delete_questions(self):
        questions = Question.query.filter_by(exam_id=self.id).all()
        for question in questions:
            db.session.delete(question)
        db.session.commit()

    @staticmethod
    def delete_all():
        db.session.query(Exam).delete()



class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer(), primary_key=True)
    content = db.Column(db.Text(), nullable=False)
    number_of_choices = db.Column(db.Integer())
    choices = db.Column(MutableList.as_mutable(AsaList()))
    time_limit = db.Column(db.Integer())
    correct_answer = db.Column(db.Integer())
    order = db.Column(db.Integer())
    exam = db.relationship('Exam', back_populates='Question')
    exam_id = db.Column(db.Integer(), db.ForeignKey('exam.id'), nullable=False)
    
    def to_dict(self):
        dic = {"id": self.id, "content": self.content,
            "number_of_choices": self.number_of_choices,
            "choices": self.choices,
            "time_limit": self.time_limit}
        return dic