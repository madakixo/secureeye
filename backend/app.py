import os
import uuid
import base64
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Camera, ReferencePhoto, Payment, Detection
from dotenv import load_dotenv
from ai_engine.processor import get_face_encoding
from ai_engine.stream_manager import StreamManager

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/secureeye')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')

CORS(app)
db.init_app(app)
jwt = JWTManager(app)
stream_manager = None

with app.app_context():
    db.create_all()

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "User already exists"}), 400
    user = User(email=data['email'], name=data.get('name'))
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user={"email": user.email, "name": user.name, "is_paid": user.is_paid}), 200
    return jsonify({"msg": "Bad email or password"}), 401

@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.json
    user.whatsapp = data.get('whatsapp', user.whatsapp)
    user.location = data.get('location', user.location)
    user.profile_pic = data.get('profile_pic', user.profile_pic)
    db.session.commit()
    return jsonify({"msg": "Profile updated"}), 200

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"email": user.email, "name": user.name, "is_paid": user.is_paid}), 200

@app.route('/api/cameras', methods=['GET', 'POST'])
@jwt_required()
def manage_cameras():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if request.method == 'POST':
        global stream_manager
        if stream_manager is None:
            stream_manager = StreamManager(app)
        data = request.json
        camera = Camera(user_id=user_id, name=data['name'], stream_url=data['stream_url'])
        db.session.add(camera)
        db.session.commit()

        # Only start the AI stream if the user has paid
        if user.is_paid:
            stream_manager.start_stream(camera.id)

        return jsonify({"msg": "Camera added", "id": camera.id, "stream_started": user.is_paid}), 201
    cameras = Camera.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": c.id, "name": c.name, "stream_url": c.stream_url} for c in cameras])

@app.route('/api/payments/initiate', methods=['POST'])
@jwt_required()
def initiate_payment():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    amount = request.json['amount']
    tx_ref = str(uuid.uuid4())
    payment = Payment(user_id=user_id, amount=amount, flw_ref=tx_ref)
    db.session.add(payment)
    db.session.commit()
    headers = {"Authorization": f"Bearer {os.getenv('FLW_SECRET_KEY')}"}
    payload = {
        "tx_ref": tx_ref, "amount": str(amount), "currency": "NGN",
        "redirect_url": f"{request.host_url}api/payments/callback",
        "payment_options": "card,banktransfer",
        "customer": {"email": user.email, "name": user.name},
        "customizations": {"title": "SecureEye Subscription", "description": "Payment for AI CCTV Services"}
    }
    response = requests.post("https://api.flutterwave.com/v3/payments", json=payload, headers=headers)
    return jsonify(response.json()['data'])

@app.route('/api/payments/webhook', methods=['POST'])
def flutterwave_webhook():
    data = request.json
    if data['status'] == 'successful':
        tx_ref = data['tx_ref']
        payment = Payment.query.filter_by(flw_ref=tx_ref).first()
        if payment:
            payment.status = 'completed'
            user = User.query.get(payment.user_id)
            user.is_paid = True
            db.session.commit()
    return jsonify({"status": "success"}), 200

@app.route('/api/detections', methods=['GET'])
@jwt_required()
def get_detections():
    user_id = get_jwt_identity()
    detections = Detection.query.join(Camera).filter(Camera.user_id == user_id).order_by(Detection.timestamp.desc()).limit(50).all()
    return jsonify([{"id": d.id, "type": d.type, "label": d.label, "timestamp": d.timestamp.isoformat()} for d in detections])

@app.route('/api/reference-photos', methods=['POST'])
@jwt_required()
def upload_reference_photo():
    user_id = get_jwt_identity()
    data = request.json
    label = data['label']
    image_data = data['image']
    img_name = f"{user_id}_{label}_{uuid.uuid4().hex}.jpg"
    img_path = os.path.join('uploads', img_name)
    os.makedirs('uploads', exist_ok=True)
    with open(img_path, "wb") as f:
        f.write(base64.b64decode(image_data.split(',')[1]))
    encoding = get_face_encoding(img_path)
    ref_photo = ReferencePhoto(user_id=user_id, label=label, photo_path=img_path, encoding=encoding)
    db.session.add(ref_photo)
    db.session.commit()
    return jsonify({"msg": "Reference photo added"}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
