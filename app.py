#!/usr/bin/env python3
""" flask app """
from flask import Flask, render_template, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required, current_user

# Initialize the Flask application
app = Flask(__name__)

# Configure the SQLAlchemy database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'mysecret'
#app.config['SECURITY_REGISTERABLE'] = True
app.config['SECURITY_PASSWORD_SALT'] = 'mysalt'

# Initialize the database
db = SQLAlchemy(app)

# Define the Role and User models
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(255))
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean(), default=True)
    roles = db.relationship('Role', secondary='user_roles')

class UserRoles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))

# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

@app.route('/')
@login_required
def home():
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
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
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        user = user_datastore.create_user(username=username, email=email, password=password)
        db.session.commit()
        return redirect(url_for('login'))

    return render_template('register.html')

if __name__ == '__main__':
    with app.app_context():  # Create the application context
        db.create_all()  # Create the database tables
    app.run(debug=True)
