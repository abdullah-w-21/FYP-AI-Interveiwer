import spacy
import json
import pandas as pd

#spacy.cli.download("en_core_web_lg")

# Load the SpaCy Model
nlp = spacy.load('en_core_web_lg')

# Load questions and answers from the JSON file
with open('questions.json', 'r') as file:
    questions_and_answers = json.load(file)

# Created a DataFrame to hold the data
data = {'question': [], 'user_response': [], 'label': []}

def validate_answer(question, user_answer, threshold=0.7):
    question_tokens = preprocess_text(question)
    user_answer_tokens = preprocess_text(user_answer)

    question_doc = nlp(" ".join(question_tokens))
    user_answer_doc = nlp(" ".join(user_answer_tokens))
    similarity = question_doc.similarity(user_answer_doc)

    return similarity >= threshold

# Preprocessing functions
def preprocess_text(text):
    doc = nlp(text)
    return " ".join([token.text for token in doc if not token.is_punct])

# Prepare data
for question, answer in questions_and_answers.items():
    user_response = input(f"Q: {question}\nA: ")

    preprocessed_user_response = preprocess_text(user_response)
    data['question'].append(question)
    data['user_response'].append(preprocessed_user_response)
    data['label'].append(1 if validate_answer(answer, user_response) else 0)

# create pandas dataframe
df = pd.DataFrame(data)

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# Machine Learning implementation
# Split the data into training and testing sets
X = df['user_response']
y = df['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Vectorize the text data
vectorizer = TfidfVectorizer()
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train a logistic regression classifier
classifier = LogisticRegression()
classifier.fit(X_train_vec, y_train)

# Make predictions on the test set
y_pred = classifier.predict(X_test_vec)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")

# Save the model and vectorizer for future use
joblib.dump(classifier, 'interview_classifier.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')

import joblib

with open('questions.json', 'r') as file:
    questions_and_answers = json.load(file)

# Load the trained model and vectorizer
classifier = joblib.load('interview_classifier.pkl')
vectorizer = joblib.load('vectorizer.pkl')


# Interview from the trained model
def conduct_interview(questions_and_answers, classifier, vectorizer):
    user_score = 0

    for question, answer in questions_and_answers.items():
        user_response = input(f"Q: {question}\nA: ")
        preprocessed_user_response = preprocess_text(user_response)

        # Vectorize the user response
        user_response_vec = vectorizer.transform([preprocessed_user_response])

        # Predict using the trained classifier
        prediction = classifier.predict(user_response_vec)

        if prediction[0] == 1:
            print("Correct!")
            user_score += 1
        else:
            print("Incorrect. The correct answer is:", answer)


    max_score = 20
    user_score_percentage = (user_score / max_score) * 100
    print(f"Your score: {user_score_percentage:.2f}%")



conduct_interview(questions_and_answers, classifier, vectorizer)
