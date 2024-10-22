import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import 'dotenv/config';


const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = process.env.REACT_APP_mongodb;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const quizSchema = new mongoose.Schema({
  quizId: String,
  quiz: Number,
  quizType: String,
  createdAt: { type: Date, default: Date.now },
  questions: [
    {
      question: String,
      answer: String,
      userResponse: String,
      score: String,
      feedback: String,
      explanation: String,
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);

app.post("/api/quiz", async (req, res) => {
  try {
    const quizData = req.body;

    if (
      !quizData ||
      !quizData.questions ||
      !Array.isArray(quizData.questions)
    ) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const lastQuiz = await Quiz.findOne({ quizId: quizData.quizId }).sort({
      quiz: -1,
    });

    const newQuizNumber = lastQuiz ? lastQuiz.quiz + 1 : 1;

    const newQuiz = new Quiz({
      quizId: quizData.quizId,
      quiz: newQuizNumber,
      quizType: quizData.quizType,
      questions: quizData.questions,
    });

    await newQuiz.save();
    res.status(201).json({ message: "Quiz data saved successfully" });
  } catch (err) {
    console.error("Failed to save quiz data:", err);
    res.status(500).json({ error: "Failed to save quiz data" });
  }
});

app.get("/api/history/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const history = await Quiz.find({ quizId });
    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history data" });
  }
});

app.delete("/api/quiz/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;

    const deletedQuiz = await Quiz.findOneAndDelete({ _id: quizId });

    if (!deletedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (err) {
    console.error("Failed to delete quiz:", err);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});


const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
