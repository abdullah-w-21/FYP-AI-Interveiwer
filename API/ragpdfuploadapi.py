from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import nest_asyncio
from dotenv import load_dotenv
import google.generativeai as Genai
import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from io import BytesIO

app = Flask(__name__)
CORS(app)
nest_asyncio.apply()
load_dotenv()
Genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize HuggingFace embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")





def create_embeddings(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    vectorstore = FAISS.from_texts(chunks, embeddings)
    return vectorstore


def generate_questions(vectorstore, topic, role, difficulty, num_questions):
    model = Genai.GenerativeModel('gemini-1.5-pro')
    context = vectorstore.similarity_search(f"{topic} {role} {difficulty}", k=3)
    context_text = "\n".join([doc.page_content for doc in context])

    prompt = f"""Based on the following context, generate {num_questions} interview questions and answers for the topic "{topic}", considering the role of "{role}" and difficulty level "{difficulty}". The questions should be challenging and open-ended, allowing interviewees to showcase their understanding and critical thinking skills.

Context:
{context_text}

Output the result as a JSON array in the following format:
{{
  "Interview Questions": [
    {{
      "question": "Your generated question here",
      "answer": "The corresponding answer here"
    }},
    ...
  ]
}}
"""

    response = model.generate_content(prompt)
    return response.text


from PyPDF2.errors import PdfReadError


def extract_text_from_pdf(pdf_file):
    try:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except (PdfReadError, KeyError) as e:
        print(f"Error reading PDF: {str(e)}")
        return None


@app.route('/upload_pdf', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file uploaded"}), 400

    pdf_file = request.files['pdf']
    topic = request.form.get('topic')
    role = request.form.get('role')
    difficulty = request.form.get('difficulty')
    num_questions = int(request.form.get('num_questions', 1))

    if not all([topic, role, difficulty]):
        return jsonify({"error": "Please provide all required fields: topic, role, difficulty"}), 400

    try:
        # Check PDF page count
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        if len(pdf_reader.pages) > 19:
            return jsonify({"error": "PDF must be 15 pages or less"}), 400

        # Extract text and create embeddings
        pdf_file.seek(0)  # Reset file pointer
        pdf_text = extract_text_from_pdf(pdf_file)

        if pdf_text is None:
            return jsonify({
                               "error": "Failed to extract text from the PDF. The file might be corrupted or password-protected."}), 400

        vectorstore = create_embeddings(pdf_text)

        # Generate questions
        questions = generate_questions(vectorstore, topic, role, difficulty, num_questions)

        return jsonify(questions)
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        return jsonify(
            {"error": "An error occurred while processing the PDF. Please try again with a different file."}), 500
if __name__ == '__main__':
    print("PDF RAG API is ready to take input!")
    app.run(port=5004)