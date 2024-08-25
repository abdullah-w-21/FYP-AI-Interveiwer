import numpy as np
import gensim.downloader as api
import nltk
from nltk.corpus import stopwords
import string

# stopwords
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))

# pretrained word embedding model
model = api.load("glove-wiki-gigaword-50")

# preprocess and remove stopwords and make all text lowercase
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

    print(f"Word Embedding Cosine Similarity Score: {cosine_sim * 100:.2f}%")

paragraph1 = "The quick brown fox jumps over the lazy dog."
paragraph2 = "A swift auburn fox leaps over the sleepy hound."


calculate_embedding_cosine_similarity(paragraph1, paragraph2)
