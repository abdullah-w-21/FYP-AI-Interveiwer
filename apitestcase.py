import requests
import json


BASE_URL = "http://127.0.0.1:5000"


def test_generate_interview_questions():
    endpoint = f"{BASE_URL}/"

    payload = {
        "topic": "Python Programming",
        "role": "Software Developer",
        "difficulty": "beginner",
        "num_questions": "4"
    }

    response = requests.post(endpoint, json=payload)

    if response.status_code == 200:
        print("Interview Questions Generated Successfully:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)


def test_grade_answer():
    endpoint = f"{BASE_URL}/grade"

    payload = {
        "api_answer": "Python is a high-level, interpreted programming language known for its simplicity and readability. It supports multiple programming paradigms including procedural, object-oriented, and functional programming.",
        "user_answer": "i dont know"
    }

    response = requests.post(endpoint, json=payload)

    if response.status_code == 200:
        print("Answer Graded Successfully:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    test_generate_interview_questions()
    test_grade_answer()

