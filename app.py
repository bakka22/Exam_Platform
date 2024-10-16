#!/usr/bin/env python3
""" flask app """
from flask import Flask, render_template, redirect, url_for, request, abort, jsonify
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required, current_user
from models.user import User, Role
from models.exam import Exam
from db import db

# Initialize the Flask application
app = Flask(__name__)

# Configure the SQLAlchemy database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'mysecret'
app.config['SECURITY_PASSWORD_SALT'] = 'mysalt'

#initialize the database with flask app
db.init_app(app)

# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

@app.route('/')
@login_required
def home():
    print(current_user.type)
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    print("custom login")
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = user_datastore.get_user(email)
        if user and user.verify_password(password):
            login_user(user)
            return redirect(url_for('home'))
        else:
            # Handle invalid login
            return "Invalid credentials"

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        email = request.form['email']
        password = request.form['password']
        student_id = request.form['student_id']
        user = user_datastore.create_user(first_name=first_name, last_name=last_name, email=email, password=password, student_id=student_id, type='Student')
        db.session.commit()
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/add_exam', methods=['GET', 'POST'], strict_slashes=False)
@login_required
def add_exam():
    if request.method == 'POST':
        correct_answers = []
        exam_name = request.form['exam_name']
        examiner = request.form['examiner']
        number_of_questions = request.form['number_of_questions']
        exam = Exam(name=exam_name, examiner=examiner,
            question_count=number_of_questions)
        db.session.add(exam)
        db.session.commit()
        print(number_of_questions)
        for i in range(int(number_of_questions)):
            content = request.form[f'content{i}']
            print(request.form[f'choices{i}'])
            choices = request.form[f'choices{i}'].split('|;|;')[:-1]
            print(choices)
            time_limit = request.form[f'time_limit{i}']
            correct_answer = int(request.form[f'correct{i}'])
            correct_answers.append(str(correct_answer))
            print(correct_answer)
            exam.add_question(content, choices, time_limit, correct_answer, i)
        exam.answers = correct_answers
        db.session.commit()
        print(exam.answers)
        return redirect(url_for('home'))
    return render_template('add_exam.html', current_user=current_user)

@app.route('/edit_exam/<exam_id>', methods=['GET', 'POST'], strict_slashes=False)
@login_required
def edit_exam(exam_id):
    correct_answers = []
    exam = Exam.query.filter_by(id=exam_id).first()
    if request.method == 'POST':
        exam.delete_questions()
        number_of_questions = request.form['number_of_questions']
        exam.question_count = number_of_questions
        for i in range(int(number_of_questions)):
            content = request.form[f'content{i}']
            print(request.form[f'choices{i}'])
            choices = request.form[f'choices{i}'].split('|;|;')[:-1]
            print(choices)
            time_limit = request.form[f'time_limit{i}']
            correct_answer = int(request.form[f'correct{i}'])
            correct_answers.append(correct_answer)
            print(correct_answer)
            exam.add_question(content, choices, time_limit, correct_answer, i)
        exam.answers = correct_answers
        db.session.commit()
        return redirect(url_for('home'))
    return render_template('edit_exam.html', exam_id=exam_id)

@app.route('/take_exam/<exam_id>', methods=['GET', 'POST'], strict_slashes=False)
@login_required
def take_exam(exam_id):
    exam = Exam.query.filter_by(id=exam_id).first()
    if current_user.exam_is_taken(exam_id) or not exam.is_accessable:
        return redirect(url_for('home'))
    if request.method == 'POST':
        answers = request.form['answers'].split("|;|;")[:-1]
        answers = ['0' if x == 'undefined' else x for x in answers]
        score = exam.calculate_score(answers)
        print(score)
        current_user.add_grade_of_exam(exam.id, score, answers)
        return redirect(url_for('home'))
    return render_template('take_exam.html', exam_id=exam_id)

@app.route('/get_exam/<exam_id>')
def get_exam(exam_id):
    exam = Exam.query.filter_by(id=exam_id).first()
    print(exam.Question)
    return jsonify(exam.to_dict())

@app.route('/get_exam_result/<exam_id>', methods=["GET"], strict_slashes=False)
@login_required
def get_exam_result(exam_id):
    if not exam_id:
        return jsonify({"message": "no data"})
    return jsonify(current_user.get_exam_result(exam_id))

@app.route('/get_exam_answers/<exam_id>', methods=["GET"], strict_slashes=False)
@login_required
def get_exam_answers(exam_id):
    exam = Exam.query.filter_by(id=exam_id).first()
    print(exam.answers)
    return jsonify(exam.answers)

@app.route('/exams', methods=["GET"], strict_slashes=False)
@login_required
def exams():
    return render_template('exams.html')

@app.route('/exams/<exam_id>', methods=["GET"], strict_slashes=False)
@login_required
def exam_result(exam_id):
    return render_template('exam_result.html', exam_id=exam_id)

@app.route('/delete_all', methods=['GET'], strict_slashes=False)
@login_required
def delete_all():
    Exam.delete_all()
    return redirect(url_for('home'))

if __name__ == '__main__':
    with app.app_context():  # Create the application context
        db.create_all()  # Create the database tables
    app.run(debug=True)
