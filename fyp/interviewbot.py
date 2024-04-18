import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Dense, Activation, Dropout
from tensorflow.keras.optimizers import SGD
from tensorflow.keras.callbacks import LearningRateScheduler

lemmatizer = WordNetLemmatizer()

def load_interview_data():
    with open('Questions.json', 'r') as json_file:
        interview_data = json.load(json_file)
    return interview_data

def load_words_and_classes():
    words = pickle.load(open('interview_words.pkl', 'rb'))
    classes = pickle.load(open('interview_classes.pkl', 'rb'))
    return words, classes

def load_existing_model():
    model = load_model('interview_model.h5')  # Use the improved model file
    return model

def interview_bot():
    interview_data = load_interview_data()
    words, classes = load_words_and_classes()
    model = load_existing_model()

    score = 0
    total_questions = len(interview_data)
    correct_answers = {}  # Dictionary to store correct responses

    print("Welcome to the Interview Bot\n")

    for question, answer in interview_data.items():
        print("Question:", question)
        user_input = input("Your answer: ").lower()

        # Tokenize and preprocess user input
        user_words = nltk.word_tokenize(user_input)
        user_words = [lemmatizer.lemmatize(word) for word in user_words]

        # Create a bag of words
        user_bag = [0] * len(words)
        for user_word in user_words:
            for i, word in enumerate(words):
                if word == user_word:
                    user_bag[i] = 1

        # Make predictions using the model
        predictions = model.predict(np.array([user_bag]))
        predicted_class_index = np.argmax(predictions)
        response = classes[predicted_class_index]

        if response == answer:
            score += 1
            print("Correct!\n")
            correct_answers[question] = user_input  # Save correct response
        else:
            print("Incorrect. The correct answer is:", answer, "\n")

    user_score = (score / total_questions) * 100
    print(f"You scored {user_score:.2f} out of 100 in this interview.")

    # Save the correct responses in a JSON file
    with open("correct_answers.json", "w") as json_file:
        json.dump(correct_answers, json_file, indent=4)


