# Deployment Guide: SecureEye AI CCTV on Render

This guide provides step-by-step instructions for deploying the SecureEye system.

## 1. Database Setup (PostgreSQL)
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **PostgreSQL**.
3. Name: `secureeye-db`
4. Region: Choose the one closest to you.
5. Plan: **Free** (or Starter for production).
6. Once created, copy the **Internal Database URL** for the backend or **External Database URL** for local testing.

## 2. Backend Deployment (Docker)
1. Click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Service Name: `secureeye-backend`
4. Environment: **Docker**.
5. Dockerfile Path: `backend/Dockerfile`.
6. Add the following **Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL URL from Step 1.
   - `JWT_SECRET_KEY`: A long, random string (e.g., `openssl rand -base64 32`).
   - `FLW_PUBLIC_KEY`: Your Flutterwave Public Key.
   - `FLW_SECRET_KEY`: Your Flutterwave Secret Key.
   - `FLW_ENCRYPTION_KEY`: Your Flutterwave Encryption Key.
7. Click **Deploy Web Service**.

## 3. Frontend Deployment (Static Site)
1. Click **New +** > **Static Site**.
2. Connect your GitHub repository.
3. Service Name: `secureeye-frontend`
4. Build Command: `cd frontend && npm install && npm run build`
5. Publish Directory: `frontend/dist`
6. **Important**: Since we use React Router, add a **Rewrite/Redirect Rule**:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: **Rewrite** (200)
7. Click **Deploy Static Site**.

## 4. Flutterwave Configuration
1. Go to your Flutterwave Dashboard > **Settings** > **Webhooks**.
2. Set the Webhook URL to: `https://secureeye-backend.onrender.com/api/payments/webhook`.
3. Secret Hash: (Optional) Set a hash and verify it in the backend for extra security.

## 5. Usage
1. Register an account on the frontend.
2. Go to **Pricing** and choose a plan.
3. After payment, your account will be marked as "Paid".
4. Go to the **Dashboard** and add a camera (e.g., an RTSP link or a local video file path for testing).
5. The AI engine will automatically start processing frames and showing alerts.

---
*Note: AI processing (YOLO, Face Recognition) is CPU intensive. For best performance on Render, consider upgrading to a "Starter" or "Pro" instance with more RAM.*
