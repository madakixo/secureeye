import cv2
import threading
import time
from ai_engine.processor import AIEngine
from models import db, Detection, Camera, User

class StreamManager:
    def __init__(self, app):
        self.app = app
        self.engine = AIEngine()
        self.active_streams = {}

    def start_stream(self, camera_id):
        if camera_id in self.active_streams: return
        thread = threading.Thread(target=self._run_stream, args=(camera_id,))
        thread.daemon = True
        thread.start()
        self.active_streams[camera_id] = thread

    def _run_stream(self, camera_id):
        with self.app.app_context():
            camera = Camera.query.get(camera_id)
            if not camera: return
            user = User.query.get(camera.user_id)
            encodings = [p.encoding for p in user.reference_photos if p.encoding is not None]
            labels = [p.label for p in user.reference_photos if p.encoding is not None]
            self.engine.update_known_faces(encodings, labels)
            cap = cv2.VideoCapture(camera.stream_url)
            frame_count = 0
            while camera.is_active:
                ret, frame = cap.read()
                if not ret:
                    time.sleep(5)
                    cap = cv2.VideoCapture(camera.stream_url)
                    continue
                if frame_count % 30 == 0:
                    results = self.engine.process_frame(frame, {'face_recognition': True, 'alpr': True, 'object_detection': True})
                    for res in results:
                        db.session.add(Detection(camera_id=camera_id, type=res['type'], label=res['label']))
                    db.session.commit()
                frame_count += 1
                time.sleep(0.01)
            cap.release()
