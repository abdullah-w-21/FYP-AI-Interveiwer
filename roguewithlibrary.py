from rouge_score import rouge_scorer


def compare_paragraphs(paragraph1, paragraph2):
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)

    # calculate scores
    scores = scorer.score(paragraph1, paragraph2)
    rouge1_score = scores['rouge1']
    rouge2_score = scores['rouge2']
    rougeL_score = scores['rougeL']

    print("ROUGE-1 (1-gram) Precision: {:.4f}, Recall: {:.4f}, F1: {:.4f}".format(
        rouge1_score.precision, rouge1_score.recall, rouge1_score.fmeasure))
    print("ROUGE-2 (2-gram) Precision: {:.4f}, Recall: {:.4f}, F1: {:.4f}".format(
        rouge2_score.precision, rouge2_score.recall, rouge2_score.fmeasure))
    print("ROUGE-L (Longest Common Subsequence) Precision: {:.4f}, Recall: {:.4f}, F1: {:.4f}".format(
        rougeL_score.precision, rougeL_score.recall, rougeL_score.fmeasure))

    final_similarity_score = (rouge1_score.fmeasure + rouge2_score.fmeasure + rougeL_score.fmeasure) / 3
    print("Final Similarity Score: {:.2f}%".format(final_similarity_score * 100))

paragraph1 = "The quick brown fox jumps over the lazy dog."
paragraph2 = "A swift auburn fox leaps over the sleepy hound."

compare_paragraphs(paragraph1, paragraph2)
