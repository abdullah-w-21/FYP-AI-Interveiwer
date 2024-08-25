import requests
import json

BASE_URL = "http://127.0.0.1:5000"


def test_generate_mcq():
    endpoint = f"{BASE_URL}/generate_mcq"

    payload = {
        "topic": "Python Programming",
        "role": "Software Developer",
        "difficulty": "Intermediate",
        "num_questions": 2
    }

    response = requests.post(endpoint, json=payload)

    if response.status_code == 200:
        print("MCQs Generated Successfully:")
        print(json.dumps(response.json(), indent=2))
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None


def test_grade_mcq(mcq):
    endpoint = f"{BASE_URL}/grade_mcq"

    question = mcq['MCQs'][0]

    correct_payload = {
        "user_answer": question['correct_answer'],
        "correct_answer": question['correct_answer'],
        "explanation": question['explanation']
    }

    correct_response = requests.post(endpoint, json=correct_payload)

    print("\nGrading with Correct Answer:")
    print(json.dumps(correct_response.json(), indent=2))

    incorrect_answer = 'A' if question['correct_answer'] != 'A' else 'B'
    incorrect_payload = {
        "user_answer": incorrect_answer,
        "correct_answer": question['correct_answer'],
        "explanation": question['explanation']
    }

    incorrect_response = requests.post(endpoint, json=incorrect_payload)

    print("\nGrading with Incorrect Answer:")
    print(json.dumps(incorrect_response.json(), indent=2))


if __name__ == "__main__":
    print("Testing Generate MCQ API:")
    mcq_questions = test_generate_mcq()
    if mcq_questions:
        print("\nTesting Grade MCQ API:")
        test_grade_mcq(mcq_questions)
