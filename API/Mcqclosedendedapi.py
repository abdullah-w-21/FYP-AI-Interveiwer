from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as Genai
import json

app = Flask(__name__)
CORS(app)
load_dotenv()
Genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


def get_mcq_questions(topic, role, difficulty, num_questions):
    model = Genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})
    prompt = f"""Generate {num_questions} multiple-choice questions (MCQs) for the topic "{topic}", considering the role of "{role}" and difficulty level "{difficulty}". Each MCQ should have 4 options (A, B, C, D) with only one correct answer. Include an explanation for the correct answer. Structure your response as a JSON array.

Output Example:
{{
  "MCQs": [
    {{
      "question": "What is the primary purpose of the 'self' parameter in Python class methods?",
      "options": {{
        "A": "To create a new instance of the class",
        "B": "To refer to the current instance of the class",
        "C": "To define class variables",
        "D": "To import external modules"
      }},
      "correct_answer": "B",
      "explanation": "The 'self' parameter in Python class methods is used to refer to the current instance of the class. It allows access to the attributes and methods of the class within its own methods."
    }}
  ]
}}
"""
    response = model.generate_content(prompt)
    return json.loads(response.text)


@app.route('/generate_mcq', methods=['POST'])
def generate_mcq():
    data = request.get_json()
    topic = data.get('topic')
    role = data.get('role')
    difficulty = data.get('difficulty')
    num_questions = data.get('num_questions')

    if not all([topic, role, difficulty, num_questions]):
        return jsonify({"error": "Please provide all required fields: topic, role, difficulty, num_questions"}), 400

    mcq_questions = get_mcq_questions(topic, role, difficulty, num_questions)
    return jsonify(mcq_questions)


@app.route('/grade_mcq', methods=['POST'])
def grade_mcq():
    data = request.get_json()
    user_answer = data.get('user_answer')
    correct_answer = data.get('correct_answer')
    explanation = data.get('explanation')

    if not all([user_answer, correct_answer, explanation]):
        return jsonify({"error": "Please provide all required fields: user_answer, correct_answer, explanation"}), 400

    is_correct = user_answer.upper() == correct_answer.upper()
    score = 1 if is_correct else 0
    feedback = "Way to go! Great job!" if is_correct else "Let's practice more. You've got this!"

    response = {
        "score": score,
        "feedback": feedback,
        "explanation": explanation,
        "is_correct": is_correct
    }

    return jsonify(response)


if __name__ == '__main__':
    print("MCQ Flask API is ready to take input!")
    app.run(port=5000)