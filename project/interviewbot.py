import spacy
import json

# ye wala code se download karlena model: spacy.cli.download("en_core_web_lg")
# Load Spacy model
nlp = spacy.load('en_core_web_lg')

# Load questions and answers from the JSON file
with open('Questions.json', 'r') as file:
    questions_and_answers = json.load(file)

# Correct responses loaded for future use, retraining, etc
user_correct_responses = {}
try:
    with open('user_correct_responses.json', 'r') as user_responses_file:
        user_correct_responses = json.load(user_responses_file)
except FileNotFoundError:
    pass

# Preprocessing function (pre process karna zarori hoga because nlp itself is token aur humein token k sath comparision karni
def preprocess_text(text):
    doc = nlp(text)
    return [token.text for token in doc if not token.is_punct]

# Answer validation function
def validate_answer(question, user_answer, threshold=0.9): # threshhold : ye humary comparision k liye hota hai kyuke similarity ka function output float mai deta hai
    question_tokens = preprocess_text(question)
    user_answer_tokens = preprocess_text(user_answer)

    question_doc = nlp(" ".join(question_tokens))
    user_answer_doc = nlp(" ".join(user_answer_tokens))
    similarity = question_doc.similarity(user_answer_doc)

    return similarity >= threshold

# Function to get the first question (flask app mai use hoga)
def get_first_question():

    return list(questions_and_answers.keys())[0]

# Function for getting the next Q & A (flask app mai use hoga)
def get_next_question_and_feedback(current_question, user_response):
    next_question = None
    feedback = None

    # looks up the correct answer for the current question
    correct_answer = questions_and_answers.get(current_question, "")

    if validate_answer(correct_answer, user_response):
        feedback = "Correct!"
    else:
        feedback = f"Incorrect. The correct answer is: {correct_answer}"

    # gets the next question
    current_question_index = list(questions_and_answers.keys()).index(current_question)
    if current_question_index < len(questions_and_answers) - 1:
        next_question = list(questions_and_answers.keys())[current_question_index + 1]

    return next_question, feedback

# Interview conduct functions start interview
def conduct_interview():
    user_score = 0  # Initialize user score
    current_question = get_first_question()  # Initialize the current question

    while current_question is not None:
        user_response = input(f"Q: {current_question}\nA: ")

        next_question, feedback = get_next_question_and_feedback(current_question, user_response)

        print(feedback)

        if feedback == "Correct!":
            user_score += 1

        current_question = next_question

    # Score calculation
    user_score_percentage = (user_score / 20) * 100

    print(f"Your score: {user_score_percentage:.2f}%")

    # Saving correct responses
    with open('user_correct_responses.json', 'w') as user_responses_file:
        json.dump(user_correct_responses, user_responses_file)