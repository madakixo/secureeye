from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(120))
    whatsapp = db.Column(db.String(50))
    location = db.Column(db.String(256))
    profile_pic = db.Column(db.String(500))
    is_paid = db.Column(db.Boolean, default=False)
    cameras = db.relationship('Camera', backref='owner', lazy=True)
    payments = db.relationship('Payment', backref='user', lazy=True)
    reference_photos = db.relationship('ReferencePhoto', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Camera(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    stream_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)

class ReferencePhoto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    label = db.Column(db.String(120), nullable=False)
    photo_path = db.Column(db.String(500), nullable=False)
    encoding = db.Column(db.PickleType)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')
    flw_ref = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Detection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    camera_id = db.Column(db.Integer, db.ForeignKey('camera.id'), nullable=False)
    type = db.Column(db.String(50))
    label = db.Column(db.String(120))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
