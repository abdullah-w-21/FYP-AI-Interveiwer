from flask import Flask, render_template, request, jsonify
import interviewbot as intbot

#flask ka package install krlena phir run hoga (command => pip install flask) paste command in terminal

app = Flask(__name__)

# app route normal route hoga (uska goto)
@app.route("/")
def home():
    return render_template("index.html")

# Conversational tracking
conversation_context = {
    "current_question": None,
}

@app.route("/interview", methods=["GET", "POST"])
def interview():
    if request.method == "GET":
        # If first question then get (function of first question)
        if conversation_context["current_question"] is None:
            first_question = intbot.get_first_question()
            conversation_context["current_question"] = first_question
            return jsonify(result=first_question)
        else:
            return jsonify(result="Your response is expected.")
    elif request.method == "POST":
        user_response = request.form["user_response"]
        current_question = conversation_context["current_question"]
        next_question, feedback = intbot.get_next_question_and_feedback(current_question, user_response)
        conversation_context["current_question"] = next_question
        return jsonify(feedback=feedback, next_question=next_question)

if __name__ == "__main__":
    app.run()