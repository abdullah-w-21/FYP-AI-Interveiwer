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


def generate_mcq(topic, role, difficulty, previous_question=None, previous_answer=None):
    model = Genai.GenerativeModel('gemini-1.5-pro', generation_config={"response_mime_type": "application/json"})

    if previous_question and previous_answer:
        prompt = f"""Generate a multiple-choice question (MCQ) for the topic "{topic}", considering the role of "{role}" and difficulty level "{difficulty}". The question should be related to the following previous question that the user answered incorrectly:

Previous Question: {previous_question}
User's Incorrect Answer: {previous_answer}

The new question should target the weak points demonstrated by the incorrect answer. Include 4 options (A, B, C, D) with only one correct answer. Provide an explanation for the correct answer.

Output the result in the following JSON format:
{{
  "question": "Your generated question here",
  "options": {{
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  }},
  "correct_answer": "The correct option (A, B, C, or D)",
  "explanation": "Explanation for the correct answer"
}}
"""
    else:
        prompt = f"""Generate a multiple-choice question (MCQ) for the topic "{topic}", considering the role of "{role}" and difficulty level "{difficulty}". Include 4 options (A, B, C, D) with only one correct answer. Provide an explanation for the correct answer.

Output the result in the following JSON format:
{{
  "question": "Your generated question here",
  "options": {{
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  }},
  "correct_answer": "The correct option (A, B, C, or D)",
  "explanation": "Explanation for the correct answer"
}}
"""

    response = model.generate_content(prompt)
    return json.loads(response.text)


def grade_mcq(user_answer, correct_answer, explanation):
    is_correct = user_answer.upper() == correct_answer.upper()
    score = 1 if is_correct else 0
    feedback = "Excellent work! You've got it right." if is_correct else "Not quite. Let's focus on improving this area."

    return {
        "score": score,
        "feedback": feedback,
        "explanation": explanation,
        "is_correct": is_correct
    }


@app.route('/adaptive_mcq', methods=['POST'])
def adaptive_mcq():
    data = request.get_json()
    topic = data.get('topic')
    role = data.get('role')
    difficulty = data.get('difficulty')
    user_answer = data.get('user_answer')
    previous_question = data.get('previous_question')
    previous_answer = data.get('previous_answer')

    if not all([topic, role, difficulty]):
        return jsonify({"error": "Please provide all required fields: topic, role, difficulty"}), 400

    if user_answer:
        # Grade the previous question
        mcq = generate_mcq(topic, role, difficulty, previous_question, previous_answer)
        grading_result = grade_mcq(user_answer, mcq['correct_answer'], mcq['explanation'])

        # Generate a new question based on the result
        if not grading_result['is_correct']:
            new_mcq = generate_mcq(topic, role, difficulty, mcq['question'], user_answer)
        else:
            new_mcq = generate_mcq(topic, role, difficulty)

        response = {
            "grading_result": grading_result,
            "next_question": new_mcq
        }
    else:
        # Generate the first question
        response = {
            "next_question": generate_mcq(topic, role, difficulty)
        }

    return jsonify(response)


if __name__ == '__main__':
    print("Adaptive MCQ Flask API is ready to take input!")
    app.run(port=5000)