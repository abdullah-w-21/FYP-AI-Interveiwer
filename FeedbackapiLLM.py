from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import nest_asyncio
from dotenv import load_dotenv
import google.generativeai as Genai
import numpy as np
import gensim.downloader as api
import nltk
from nltk.corpus import stopwords
import string
import json

app = Flask(__name__)
CORS(app)
nest_asyncio.apply()
load_dotenv()
Genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Download stopwords
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))

# Load pretrained word embedding model
model = api.load("glove-wiki-gigaword-50")


def preprocess_text(text):
    text = text.lower().translate(str.maketrans('', '', string.punctuation))
    words = [word for word in text.split() if word not in stop_words]
    return words


def get_average_word_embedding(words, model):
    embeddings = [model[word] for word in words if word in model]
    if not embeddings:
        return np.zeros(model.vector_size)
    return np.mean(embeddings, axis=0)


def calculate_cosine_similarity(vector1, vector2):
    dot_product = np.dot(vector1, vector2)
    norm1 = np.linalg.norm(vector1)
    norm2 = np.linalg.norm(vector2)
    return dot_product / (norm1 * norm2) if norm1 > 0 and norm2 > 0 else 0.0


def calculate_embedding_cosine_similarity(paragraph1, paragraph2):
    paragraph1_words = preprocess_text(paragraph1)
    paragraph2_words = preprocess_text(paragraph2)
    embedding1 = get_average_word_embedding(paragraph1_words, model)
    embedding2 = get_average_word_embedding(paragraph2_words, model)
    cosine_sim = calculate_cosine_similarity(embedding1, embedding2)
    return cosine_sim * 100


# Getting response from the model & send params
def get_response(topic, role, difficulty, num_questions):
    model = Genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})
    response = model.generate_content([prompt[0],topic, role, difficulty, num_questions])
    return response.text

prompt=[
"""Your role is to assist in generating interview questions and answers, leveraging the knowledge you posses. The content should cover a range of topics, including fundamental concepts, algorithms, and real-world applications. As you craft each question-answer pair, aim for clarity and depth, ensuring that users gain valuable insights into the field. Remember, the questions should be open-ended and challenging, allowing interviewees to showcase their understanding and critical thinking skills.  You will be provided 4 things in order to generate Topic, Role, Difficulty and Number of Question-Answer pair(Only generate the required number of question-answer pair given to you no more than that). Do not add new line \n in your response and make sure the question and answer pairs are interview oriented not too long and please donot include examples in your output. Structure your response as a JSON array remember to close the json array at the end of response.
    Output Example:
    {
  "Interview Questions": [
    {
      "question": "Can you explain what a decision tree is and its significance in data science?",
      "answer": "A decision tree is a flowchart-like structure in which each internal node represents a feature, each branch represents a decision rule, and each leaf node represents an outcome. It's a type of supervised learning algorithm that is mostly used in classification problems. They are simple to understand and interpret, making them a good choice for data science tasks. They can handle both numerical and categorical data, and can easily handle multi-output problems."
    },
    {
      "question": "What is the role of a TNode in the context of a decision tree?",
      "answer": "A TNode in the context of a decision tree is a Python class that represents a tree node. Each node has attributes such as the features, response data (X and y), and the depth at which the node is placed in the tree. The root node has a depth of 0. Each node can calculate its contribution to the squared-error training loss. The TNode class initializes the optimal split parameters and children, which are initially set to None."
    },
    {
      "question": "How is a regression tree built in the BasicTree.py implementation?",
      "answer": "In the BasicTree.py implementation, a regression tree is built by first generating training and test data using the makedata() function. The main() function then uses the training data to build a regression tree and predicts the responses of the test set. The tree is built by creating a root node at depth 0 and then recursively calling the Construct_Subtree() function to build the tree up to a maximum depth of maxdepp. The Predict() function is then used to make predictions based on the built tree."
    }
  ]
}

"""
]


@app.route('/', methods=['POST'])
def generate_interview_questions():
    data = request.get_json()
    topic = data.get('topic')
    role = data.get('role')
    difficulty = data.get('difficulty')
    num_questions = data.get('num_questions')

    # Validate input data
    if not all([topic, role, difficulty, num_questions]):
        return jsonify({"error": "Please provide all required fields: topic, role, difficulty, num_questions"}), 400

    response = get_response(topic, role, difficulty, num_questions)
    print(response)
    # Extract the content from the response
    response_content = response.content if hasattr(response, 'content') else str(response)

    # Parse the response content to JSON if it's a string
    #try:
     #   response_json = json.loads(response_content)
    #except json.JSONDecodeError:
     #   return jsonify({"error": "Failed to parse the response from the language model"}), 500
    #print(response_json)
    # Return JSON response using jsonify()
    return jsonify(response)


def get_feedback(api_answer, user_answer):
    model = Genai.GenerativeModel('gemini-pro')
    prompt = f"""You are an expert grader for a set of responses. Your job is to compare a user's answer to the correct answer and provide a score between 1 and 100 based on the accuracy and context of the user's answer. Your response should include:
1. A score between 1 and 100 based on the correctness and completeness of the user's answer.
2. Feedback based on the score:
   - For scores between 70 and 100: Provide supportive and congratulative feedback in a single sentence e.g Great work keep answering like that and you will ace your interviews.
   - For scores below 70: Provide constructive feedback to encourage improvement in a single sentence e.g With enough practice anyone can get it right, keep on practicing.
3. An explanation of the correct answer to help the user understand better: Make sure never to use the term 'correct answer', 'your answer' just explain the whole of the concept in detail in the manner of teaching the user or making him understand the questions answer.

Use the following criteria for scoring and feedback:
- If the user's answer is completely correct and matches the context of the correct answer, give a score of 100.
- If the user's answer is mostly correct but has minor errors or omissions, give a score between 70 and 99.
- If the user's answer is partially correct or shows some understanding but has significant errors, give a score between 40 and 69.
- If the user's answer is incorrect or shows little understanding, give a score below 40.

Now, here are the answers for you to grade:
User's Answer: {user_answer}
Correct Answer: {api_answer}

Please provide the score, feedback, and explanation in JSON format based on the above criteria. The score should be a string value.

{{
  "score": "string",
  "feedback": "string",
  "explanation": "string"
}}
"""
    response = model.generate_content(prompt)
    return response.text


@app.route('/grade', methods=['POST'])
def grade_answer():
    api_answer = request.json.get('api_answer')
    user_answer = request.json.get('user_answer')

    # Calculate similarity score
    similarity_score = calculate_embedding_cosine_similarity(api_answer, user_answer)

    response = get_feedback(api_answer, user_answer)
    grading_result = json.loads(response)

    # Add similarity score to the result
    grading_result['similarity_score'] = f"{similarity_score:.2f}%"
    print(grading_result)
    return jsonify(grading_result)


if __name__ == '__main__':
    print("Local Flask API is ready to take input!")
    app.run(port=5000)