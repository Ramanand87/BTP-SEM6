from user.models import FarmerProfile, ContractorProfile
from django.contrib.auth import authenticate
# import requests
# import easyocr
# import re

def authen(username, password):
    if username.isdigit():
        try:
            prof = FarmerProfile.objects.get(phoneno=username)
            return authenticate(username=prof.user.username, password=password)
        except FarmerProfile.DoesNotExist:
            pass
        try:
            prof = ContractorProfile.objects.get(phoneno=username)
            return authenticate(username=prof.user.username, password=password)
        except ContractorProfile.DoesNotExist:
            return None 
    return authenticate(username=username, password=password)
    
# def validate_gstin(gstin):
#     API_KEY = "3ee09f1237ec707a448236687c82585b" 
#     GSTIN_API_URL = f"https://api.example.com/validate_gstin?gstin={gstin}&apikey={API_KEY}" 

#     try:
#         response = requests.get(GSTIN_API_URL)
#         if response.status_code == 200:
#             data = response.json()
#             return data.get("valid", False)
#         return False
#     except Exception as e:
#         print(e)
#         return False
# def extract_text_from_image(image_path):
#     reader = easyocr.Reader(['en']) 
#     results = reader.readtext(image_path)
#     extracted_text = " ".join([res[1] for res in results])
#     return extracted_text

# def extract_aadhaar_details(text):
#     details = {}
#     name_match = re.search(r"([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)", text)
#     details["name"] = name_match.group(0) if name_match else None
#     dob_match = re.search(r"(\d{2}[/-]\d{2}[/-]\d{4})", text)
#     details["dob"] = dob_match.group(0) if dob_match else None
#     aadhaar_match = re.search(r"\b\d{4}\s\d{4}\s\d{4}\b", text)
#     details["aadhaar_number"] = aadhaar_match.group(0) if aadhaar_match else None
#     return details


# def verify(data, image_file):
#     extracted_text = extract_text_from_image(image_file)
#     aadhaar_details = extract_aadhaar_details(extracted_text)

#     extracted_name = aadhaar_details.get("name", "")
#     input_name = data.get("name", "")

#     if extracted_name and input_name in extracted_name:
#         return True
#     return False

