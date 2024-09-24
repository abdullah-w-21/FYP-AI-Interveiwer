import requests
import json

BASE_URL = "http://127.0.0.1:5000"


def test_upload_pdf():
    endpoint = f"{BASE_URL}/upload_pdf"

    with open("Abdullah Wasim data scientist.pdf", "rb") as pdf_file:
        files = {"pdf": pdf_file}
        data = {
            "topic": "Machine Learning",
            "role": "Generative AI Engineer",
            "difficulty": "Beginner",
            "num_questions": 3
        }

        response = requests.post(endpoint, files=files, data=data)

    if response.status_code == 200:
        print("Questions Generated Successfully:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    print("Testing PDF Upload and Question Generation:")
    test_upload_pdf()