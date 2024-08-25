import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
import string


nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    words = [word for word in text.split() if word not in stop_words]
    return " ".join(words)

def calculate_tfidf_cosine_similarity(paragraph1, paragraph2):
    paragraph1 = preprocess_text(paragraph1)
    paragraph2 = preprocess_text(paragraph2)

    # create TF-IDF vectorizer
    vectorizer = TfidfVectorizer()

    tfidf_matrix = vectorizer.fit_transform([paragraph1, paragraph2])

    # calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

    print(f"TF-IDF Cosine Similarity Score: {cosine_sim * 100:.2f}%")

paragraph1 = "Geographic Information Systems (GIS) have revolutionized the field of den- drochronology, the scientific method of dating tree rings to understand the age and historical context of forests. This integration is particularly notable for its impact  on environmental monitoring, forest management, and conservation efforts. GIS technology enables the collection, storage, manipulation, and analysis of geograph- ically-referenced data, facilitating a deeper understanding of forest ecosystems and the interactions between various environmental factors. The synergy between GIS and dendrochronology has led to significant advancements in modeling the potential impacts of activities such as logging and conservation, allowing for more informed decision-making to protect forest health and biodiversity. The historical context of dendrochronology, which has seen contributions from re- searchers like Charles-Wesley Ferguson and projects in northern Swedish Lapland and Western Europe, underscores its importance in understanding long-term climatic and ecological changes. The field has evolved with multiproxy studies and the incorporation of GIS technology, enhancing the accuracy and reliability of historical climate reconstructions. Noteworthy projects, such as those involving tree-ring series from the Theodosian harbor at Yenikap1 in Istanbul, illustrate the enriched historical context provided by combining GIS and dendrochronology."
paragraph2 = "Geographic Information Systems (GIS) have transformed dendrochronology, the science of dating tree rings to understand forest age and history. This integration has improved environmental monitoring, forest management, and conservation by enabling comprehensive data analysis. The collaboration enhances modeling of logging and conservation impacts, leading to better decisions for forest health and biodiversity. Dendrochronology, supported by researchers like Charles-Wesley Ferguson and projects in northern Swedish Lapland and Western Europe, is crucial for understanding climatic changes. The field has advanced with multiproxy studies and GIS, improving historical climate reconstructions. Projects such as those analyzing tree-ring data from the Theodosian harbor at Yenikapı in Istanbul showcase the valuable insights gained from this combination."


calculate_tfidf_cosine_similarity(paragraph1, paragraph2)
