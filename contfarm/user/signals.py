import easyocr
import re
def extract_text_from_image(image_path):
    reader = easyocr.Reader(['en']) 
    results = reader.readtext(image_path)
    extracted_text = " ".join([res[1] for res in results])
    return extracted_text

def extract_aadhaar_details(text):
    details = {}
    name_match = re.search(r"([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)", text)
    details["name"] = name_match.group(0) if name_match else None
    dob_match = re.search(r"(\d{2}[/-]\d{2}[/-]\d{4})", text)
    details["dob"] = dob_match.group(0) if dob_match else None
    aadhaar_match = re.search(r"\b\d{4}\s\d{4}\s\d{4}\b", text)
    details["aadhaar_number"] = aadhaar_match.group(0) if aadhaar_match else None
    return details


def verify(data,image_path):
    dict=extract_aadhaar_details(extract_text_from_image(image_path))
    if dict['name']==data['name'] and dict['dob']==data['dob']:
        return True
    else:
        return False
