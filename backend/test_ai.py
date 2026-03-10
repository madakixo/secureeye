import cv2
import numpy as np
import torch
from ai_engine.processor import AIEngine
import os

def test_ai_pipeline():
    print("--- Initializing SecureEye AI Test Suite ---")
    try:
        engine = AIEngine()
        print("[✓] AI Engine Initialized (YOLOv8, EasyOCR, Face Recognition)")
    except Exception as e:
        print(f"[✗] Failed to initialize AI Engine: {e}")
        return

    # Create a dummy frame (640x480 black image)
    frame = np.zeros((480, 640, 3), dtype=np.uint8)

    # Add a white rectangle representing a car for object detection test
    cv2.rectangle(frame, (100, 100), (300, 300), (255, 255, 255), -1)

    print("Testing Object Detection...")
    results = engine.process_frame(frame, {'object_detection': True})
    print(f"[✓] Object detection processed. Found {len(results)} objects.")

    print("Testing Face Recognition module...")
    # This might fail without actual face data but we check if it runs without crashing
    results = engine.process_frame(frame, {'face_recognition': True})
    print("[✓] Face recognition module executed.")

    print("Testing OCR (ALPR) module...")
    # This might fail without actual text but we check if it runs
    results = engine.process_frame(frame, {'alpr': True})
    print("[✓] OCR module executed.")

    print("--- AI Test Suite Completed Successfully ---")

if __name__ == "__main__":
    test_ai_pipeline()
