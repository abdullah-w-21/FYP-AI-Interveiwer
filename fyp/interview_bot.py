import json
from transformers import DistilBertForSequenceClassification, DistilBertTokenizer
import torch

# Load the trained model
model = DistilBertForSequenceClassification.from_pretrained("interview_model")
tokenizer = DistilBertTokenizer.from_pretrained("interview_model")

# Load interview questions and answers from the JSON file.
with open("Questions.json", "r") as json_file:
    interview_data = json.load(json_file)

questions = list(interview_data.keys())  # Extract questions


def ask_questions(question, answer):
    print(question)
    user_response = input("Your answer: ")

    # Tokenize user response
    inputs = tokenizer(question, user_response, padding=True, truncation=True, return_tensors="pt", max_length=128)

    # Classify the user response
    outputs = model(**inputs)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1)

    if predicted_class == 0:
        print("Correct!\n")
        return 1
    else:
        print("Incorrect. The correct answer is:", answer, "\n")
        return 0


def interview_bot():
    score = 0
    total_questions = len(questions)

    print("Welcome to the Interview Bot\n")

    correct_answers = {}

    for question, answer in interview_data.items():
        score += ask_questions(question, answer)

        # Store correct answers in the dictionary
        correct_answers[question] = answer

    # Save correct answers to a JSON file
    with open("correct_answers.json", "w") as json_file:
        json.dump(correct_answers, json_file, indent=4)

    user_score = (score / total_questions) * 100
    print(f"You scored {user_score:.2f} out of 100 in this interview.")


if __name__ == "__main__":
    interview_bot()
