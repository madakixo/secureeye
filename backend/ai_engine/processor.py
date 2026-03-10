import cv2
import numpy as np
from ultralytics import YOLO
import face_recognition
import easyocr
import torch

class AIEngine:
    def __init__(self):
        self.model = YOLO('yolov8n.pt')
        self.reader = easyocr.Reader(['en'], gpu=torch.cuda.is_available())
        self.known_face_encodings = []
        self.known_face_labels = []

    def update_known_faces(self, encodings, labels):
        self.known_face_encodings = encodings
        self.known_face_labels = labels

    def process_frame(self, frame, config):
        results = []
        detections = self.model(frame, verbose=False)[0]
        for box in detections.boxes:
            cls = int(box.cls[0])
            label = self.model.names[cls]
            conf = float(box.conf[0])
            if conf < 0.4: continue
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            if label == 'person' and config.get('face_recognition'):
                face_locations = face_recognition.face_locations(frame[y1:y2, x1:x2])
                if face_locations:
                    face_encodings = face_recognition.face_encodings(frame[y1:y2, x1:x2], face_locations)
                    for encoding in face_encodings:
                        matches = face_recognition.compare_faces(self.known_face_encodings, encoding)
                        name = "Unknown"
                        if True in matches:
                            first_match_index = matches.index(True)
                            name = self.known_face_labels[first_match_index]
                        results.append({'type': 'face', 'label': name, 'box': [x1, y1, x2, y2]})
            elif label in ['car', 'truck', 'motorcycle'] and config.get('alpr'):
                vehicle_crop = frame[y1:y2, x1:x2]
                ocr_results = self.reader.readtext(vehicle_crop)
                for (bbox, text, ocr_conf) in ocr_results:
                    if ocr_conf > 0.5:
                        results.append({'type': 'plate', 'label': text, 'box': [x1, y1, x2, y2]})
                results.append({'type': 'object', 'label': label, 'box': [x1, y1, x2, y2]})
            elif config.get('object_detection'):
                results.append({'type': 'object', 'label': label, 'box': [x1, y1, x2, y2]})
        return results

def get_face_encoding(image_path):
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)
    return encodings[0] if encodings else None
