import requests
import json

BASE_URL = "http://127.0.0.1:5000"


def test_adaptive_mcq():
    endpoint = f"{BASE_URL}/adaptive_mcq"

    # get the first question
    initial_payload = {
        "topic": "Python Programming",
        "role": "Software Developer",
        "difficulty": "Hard"
    }

    response = requests.post(endpoint, json=initial_payload)

    if response.status_code == 200:
        print("Initial MCQ Generated:")
        print(json.dumps(response.json(), indent=2))
        first_question = response.json()['next_question']
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return

    # answering the question incorrectly
    incorrect_answer_payload = {
        "topic": "Python Programming",
        "role": "Software Developer",
        "difficulty": "Hard",
        "user_answer": "A",  # Assuming this is incorrect
        "previous_question": first_question['question'],
        "previous_answer": "A"
    }

    response = requests.post(endpoint, json=incorrect_answer_payload)

    if response.status_code == 200:
        print("\nResponse after incorrect answer:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    print("Testing Adaptive MCQ API:")
    test_adaptive_mcq()