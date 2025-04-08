from deepface import DeepFace
def verify_faces(img1_path, img2_path):
    try:
        result = DeepFace.verify(img1_path, img2_path, model_name='Facenet')
        return result['verified']
    except Exception as e:
        return False

