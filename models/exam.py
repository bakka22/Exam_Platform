from db import db
from flask_security import AsaList
from sqlalchemy.ext.mutable import MutableList


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
        print(self.Question)
        questions = []
        for question in self.Question:
            questions.append(question)
        for idx, answer in enumerate(answers):
            question = questions[idx]
            if question.correct_answer == int(answer):
                score += 1
        return score



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