from collections import Counter
import re
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
import string

# Initialize the stemmer
stemmer = PorterStemmer()


def preprocess_text(text):
    # Lowercase the text
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Tokenize the text into words
    words = word_tokenize(text)
    # Stem each word
    words = [stemmer.stem(word) for word in words]
    return words


def get_ngrams(words, n):
    return [tuple(words[i:i + n]) for i in range(len(words) - n + 1)]


def calculate_precision_recall_f1(reference_ngrams, candidate_ngrams):
    reference_count = Counter(reference_ngrams)
    candidate_count = Counter(candidate_ngrams)

    overlap = sum((min(reference_count[ngram], candidate_count[ngram]) for ngram in reference_count))

    precision = overlap / len(candidate_ngrams) if candidate_ngrams else 0
    recall = overlap / len(reference_ngrams) if reference_ngrams else 0

    f1 = 2 * precision * recall / (precision + recall) if precision + recall > 0 else 0

    return precision, recall, f1


def lcs(X, Y):
    # Create a table to store lengths of longest common subsequence
    m = len(X)
    n = len(Y)
    L = [[0] * (n + 1) for i in range(m + 1)]

    # Build the LCS table
    for i in range(m + 1):
        for j in range(n + 1):
            if i == 0 or j == 0:
                L[i][j] = 0
            elif X[i - 1] == Y[j - 1]:
                L[i][j] = L[i - 1][j - 1] + 1
            else:
                L[i][j] = max(L[i - 1][j], L[i][j - 1])

    # Length of LCS is in L[m][n]
    return L[m][n]


def calculate_rouge_l(reference_words, candidate_words):
    lcs_length = lcs(reference_words, candidate_words)
    precision = lcs_length / len(candidate_words) if candidate_words else 0
    recall = lcs_length / len(reference_words) if reference_words else 0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall > 0 else 0
    return precision, recall, f1


def calculate_rouge(reference, candidate):
    # Preprocess the reference and candidate texts
    reference_words = preprocess_text(reference)
    candidate_words = preprocess_text(candidate)

    # Calculate ROUGE scores for 1-gram, 2-gram, and ROUGE-L
    rouge1_p, rouge1_r, rouge1_f1 = calculate_precision_recall_f1(get_ngrams(reference_words, 1),
                                                                  get_ngrams(candidate_words, 1))
    rouge2_p, rouge2_r, rouge2_f1 = calculate_precision_recall_f1(get_ngrams(reference_words, 2),
                                                                  get_ngrams(candidate_words, 2))
    rougeL_p, rougeL_r, rougeL_f1 = calculate_rouge_l(reference_words, candidate_words)

    # Averaging F1 scores for ROUGE-1, ROUGE-2, and ROUGE-L
    final_similarity_score = (rouge1_f1 + rouge2_f1 + rougeL_f1) / 3

    print("ROUGE-1 (1-gram) Precision: {:.4f}, Recall: {:.4f}, F1: {:.4f}".format(rouge1_p, rouge1_r, rouge1_f1))
    print("ROUGE-2 (2-gram) Precision: {:.4f}, Recall: {:.4f}, F1: {:.4f}".format(rouge2_p, rouge2_r, rouge2_f1))
    print(
        "ROUGE-L (Longest Common Subsequence) Precision: {:.4f}, Recall: {:.4f}, F1: {:.4f}".format(rougeL_p, rougeL_r,
                                                                                                    rougeL_f1))

    print("Final Similarity Score: {:.2f}%".format(final_similarity_score * 100))


# Example paragraphs to compare
paragraph1 = "Geographic Information Systems (GIS) have revolutionized the field of den- drochronology, the scientific method of dating tree rings to understand the age and historical context of forests. This integration is particularly notable for its impact  on environmental monitoring, forest management, and conservation efforts. GIS technology enables the collection, storage, manipulation, and analysis of geograph- ically-referenced data, facilitating a deeper understanding of forest ecosystems and the interactions between various environmental factors. The synergy between GIS and dendrochronology has led to significant advancements in modeling the potential impacts of activities such as logging and conservation, allowing for more informed decision-making to protect forest health and biodiversity. The historical context of dendrochronology, which has seen contributions from re- searchers like Charles-Wesley Ferguson and projects in northern Swedish Lapland and Western Europe, underscores its importance in understanding long-term climatic and ecological changes. The field has evolved with multiproxy studies and the incorporation of GIS technology, enhancing the accuracy and reliability of historical climate reconstructions. Noteworthy projects, such as those involving tree-ring series from the Theodosian harbor at Yenikap1 in Istanbul, illustrate the enriched historical context provided by combining GIS and dendrochronology.."
paragraph2 = "Geographic Information Systems (GIS) have transformed dendrochronology, the science of dating tree rings to understand forest age and history. This integration has improved environmental monitoring, forest management, and conservation by enabling comprehensive data analysis. The collaboration enhances modeling of logging and conservation impacts, leading to better decisions for forest health and biodiversity. Dendrochronology, supported by researchers like Charles-Wesley Ferguson and projects in northern Swedish Lapland and Western Europe, is crucial for understanding climatic changes. The field has advanced with multiproxy studies and GIS, improving historical climate reconstructions. Projects such as those analyzing tree-ring data from the Theodosian harbor at Yenikapı in Istanbul showcase the valuable insights gained from this combination."
# Compare the paragraphs
calculate_rouge(paragraph1, paragraph2)
