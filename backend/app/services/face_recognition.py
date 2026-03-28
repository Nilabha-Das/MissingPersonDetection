from typing import List

import cv2
import numpy as np


def extract_embedding(image_path: str) -> List[float]:
    """Extract a simple face embedding from an image using OpenCV only.

    This avoids heavy dependencies (DeepFace / TensorFlow) so it works on
    Python 3.14. For a production system you may later swap this out for a
    stronger model, but the rest of the backend API can stay the same.
    """

    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Could not read image file")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Use OpenCV's built-in Haar cascade for face detection
    face_cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(face_cascade_path)

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    if len(faces) == 0:
        raise ValueError("No face detected in the image")

    # Take the largest detected face
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    face_roi = gray[y : y + h, x : x + w]

    # Resize to a fixed size and flatten as a simple embedding
    face_resized = cv2.resize(face_roi, (128, 128))
    face_normalized = face_resized.astype("float32") / 255.0
    embedding = face_normalized.flatten()

    return embedding.tolist()


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    a = np.array(vec1, dtype="float32")
    b = np.array(vec2, dtype="float32")
    if a.shape != b.shape:
        raise ValueError("Embedding vectors must have the same dimension")

    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)
