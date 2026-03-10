# SecureEye: Next-Gen AI CCTV Monitoring SaaS

SecureEye is a professional-grade AI-powered surveillance system designed for homes, offices, and high-security installations. Featuring a sleek **Metallic Gray** interface and high-performance AI analytics, it transforms any IP camera into an intelligent security agent.

## Core Features
- **Intelligent Matrix View**: Monitor 1 to 15 IP cameras simultaneously in a dynamic grid.
- **Advanced AI Analytics**:
  - **Motion & Object Detection**: Powered by YOLOv8 for precise person and vehicle identification.
  - **Facial Recognition**: Whitelist staff or family members; detect unknown intruders in real-time.
  - **ALPR (Automated License Plate Recognition)**: Extract and log license plates using state-of-the-art OCR.
- **Enhanced Onboarding**: Seamless profile setup including Email, WhatsApp, and Location tracking.
- **Flexible Tiered Pricing**:
  - **Standard (1-4 Cameras)**: Base monthly subscription.
  - **Business (5-9 Cameras)**: +30% volume adjustment.
  - **Enterprise (10-15 Cameras)**: +45% volume adjustment.
- **Metallic Dark UI**: Professional, high-contrast dark theme for optimal low-light monitoring.

## Technology Stack
- **Frontend**: React (Vite), Tailwind CSS (Metallic Theme), Lucide Icons.
- **Backend**: Flask (Python), SQLAlchemy (PostgreSQL), Flask-JWT-Extended.
- **AI Processing**: OpenCV, YOLOv8 (ultralytics), face_recognition, EasyOCR.
- **Payments**: Flutterwave (Bank Transfer & Card Support).
- **Infrastructure**: Docker-ready, optimized for Render deployment.

## Getting Started
1. **Prerequisites**: Ensure you have Python 3.11+ and Node.js 18+ installed.
2. **Installation**:
   ```bash
   # Clone & Install Backend
   cd backend && pip install -r requirements.txt

   # Install Frontend
   cd ../frontend && npm install
   ```
3. **Configuration**: Set up your environment variables in `backend/.env` (Refer to `deploymentGuide.md`).
4. **Execution**:
   ```bash
   # Run Backend
   python app.py

   # Run Frontend (Dev mode)
   cd frontend && npm run dev
   ```

## Testing AI Capabilities
Verify the AI engine's object detection, OCR, and face recognition modules without connecting a live stream:
```bash
cd backend
python test_ai.py
```

## Deployment
Refer to the comprehensive [Deployment Guide](deploymentGuide.md) for instructions on hosting SecureEye on Render with Docker and PostgreSQL.

## License
MIT License. Created by jamaludeen madaki.
