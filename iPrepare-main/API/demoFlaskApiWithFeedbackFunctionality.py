#import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import nest_asyncio
from dotenv import load_dotenv
import google.generativeai as Genai
#import pickle

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Apply nest_asyncio to allow asynchronous operations
nest_asyncio.apply()

# Load environment variables
load_dotenv()

##################
# Gemini Feedback Engine
Genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Getting response from the model & send params
def get_response(topic, role, difficulty, num_questions):
    model = Genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})
    response = model.generate_content([prompt[0],topic, role, difficulty, num_questions])
    return response.text

prompt=[
"""Your role is to assist in generating interview questions and answers, leveraging the knowledge you posses. The content should cover a range of topics, including fundamental concepts, algorithms, and real-world applications. As you craft each question-answer pair, aim for clarity and depth, ensuring that users gain valuable insights into the field. Remember, the questions should be open-ended and challenging, allowing interviewees to showcase their understanding and critical thinking skills.  You will be provide 4 things in order to generate Topic, Role, Difficulty and Number of Question-Answer pair(Only generate the required number of question-answer pair given to you no more than that). Structure your response as a JSON array.
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

prompt2=[
    """
    You are an expert grader for a set of responses. Your job is to compare a user's answer to the correct answer and provide a score between 1 and 100 based on the accuracy and context of the user's answer. Your response should include:

1. A score between 1 and 100 based on the correctness and completeness of the user's answer.
2. Feedback based on the score:
   - For scores between 70 and 100: Provide supportive and congratulative feedback in a single sentence.
   - For scores below 70: Provide constructive feedback to encourage improvement in a single sentence.
3. An explanation of the correct answer to help the user understand better.

Here is the format of your response:

Score: [score]
Feedback: [feedback]
Explanation: [detailed explanation of the correct answer]


Use the following criteria for scoring and feedback:

- If the user's answer is completely correct and matches the context of the correct answer, give a score of 100.
- If the user's answer is mostly correct but has minor errors or omissions, give a score between 70 and 99.
- If the user's answer is partially correct or shows some understanding but has significant errors, give a score between 40 and 69.
- If the user's answer is incorrect or shows little understanding, give a score below 40.

Now, here are the answers for you to grade:

User's Answer: {user_answer}

Correct Answer: {correct_answer}

Please provide the score, feedback, and explanation in json format based on the above criteria. Score's key and value both should be in string.


"score" : str,
"feedback" : str,
"explanation : str

    """
]


# Flask routes
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

def get_feedback(api_answer,user_answer,prompt):
    model = Genai.GenerativeModel('gemini-pro')
    response = model.generate_content([prompt[0],api_answer,user_answer])
    return response.text

@app.route('/grade', methods=['POST'])
def grade_answer():
    # Get API answer and user's answer from request
    api_answer = request.json.get('api_answer')
    user_answer = request.json.get('user_answer')

    # Compare answers using Gemini API
    response = get_feedback("user_answer:"+str(user_answer),"correct_answer:"+str(api_answer),prompt2)
    print(response)

    # Return JSON response using jsonify()
    return jsonify(response)


# Run the Flask app
if __name__ == '__main__':
    print("Local Flask API is ready to take input!")
    app.run(port=5000)


"""

"""