import spacy
import json

# Step 2: Load the SpaCy Model
nlp = spacy.load('en_core_web_lg')

# Step 1: Load questions and answers from the JSON file
with open('Questions.json', 'r') as file:
    questions_and_answers = json.load(file)

# Initialize user score and maximum possible score
user_score = 0
max_score = 20

# Load the user's previous correct responses from a JSON file
user_correct_responses = {}
try:
    with open('user_correct_responses.json', 'r') as user_responses_file:
        user_correct_responses = json.load(user_responses_file)
except FileNotFoundError:
    pass

# Step 3: Preprocessing
def preprocess_text(text):
    doc = nlp(text)
    return [token.text for token in doc if not token.is_punct]

# Step 4: Answer Validation
def validate_answer(question, user_answer, threshold=0.9):
    question_tokens = preprocess_text(question)
    user_answer_tokens = preprocess_text(user_answer)

    question_doc = nlp(" ".join(question_tokens))
    user_answer_doc = nlp(" ".join(user_answer_tokens))
    similarity = question_doc.similarity(user_answer_doc)

    return similarity >= threshold

# Step 5: Scoring
def score_answer(question, user_answer):
    return validate_answer(question, user_answer)

# Define the interview function

def conduct_interview():
    for question, answer in questions_and_answers.items():
        user_response = input(f"Q: {question}\nA: ")

        if validate_answer(answer, user_response):
            print("Correct!")
            user_score = 0
            user_score += 1

            # Store the correct response in the user_correct_responses dictionary
            user_correct_responses[question] = user_response
        else:
            print("Incorrect. The correct answer is:", answer)

    # Calculate the score out of 100
    user_score_percentage = (user_score / 20) * 100

    # Display the user's score as a percentage
    print(f"Your score: {user_score_percentage:.2f}%")

    # Save the user's correct responses to a JSON file
    with open('user_correct_responses.json', 'w') as user_responses_file:
        json.dump(user_correct_responses, user_responses_file)

# Call the interview function
conduct_interview()
