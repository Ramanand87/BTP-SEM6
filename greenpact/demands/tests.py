from deepface import DeepFace

def verify_faces(img1_path, img2_path):
    try:
        result = DeepFace.verify(img1_path, img2_path, model_name='Facenet')
        return result['verified']
    except Exception as e:
        return False

img1 = "C:\\Users\\ASUS\\Downloads\\btp6Zip\\btp6\\img1.png"
img2 = "C:\\Users\\ASUS\\Downloads\\btp6Zip\\btp6\\img3.jpg"

print(verify_faces(img1, img2))