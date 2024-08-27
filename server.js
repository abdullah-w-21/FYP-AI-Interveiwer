import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = "mongodb://localhost:27017/iPrepare";

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define Schema and Model
const quizSchema = new mongoose.Schema({
  quizId: String,
  quiz: Number,
  totalScore: Number,
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

// Endpoint to save quiz data
app.post("/api/quiz", async (req, res) => {
  try {
    const quizData = req.body;
    
    if (!quizData || !quizData.questions || !Array.isArray(quizData.questions)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Find the last quiz number for this user
    const lastQuiz = await Quiz.findOne({ quizId: quizData.quizId }).sort({ quiz: -1 });

    // Increment the quiz number for the new quiz
    const newQuizNumber = lastQuiz ? lastQuiz.quiz + 1 : 1;

    // Create a new quiz document
    const newQuiz = new Quiz({
      quizId: quizData.quizId,
      quiz: newQuizNumber,
      questions: quizData.questions,
    });
    
    await newQuiz.save();
    res.status(201).json({ message: "Quiz data saved successfully" });
  } catch (err) {
    console.error("Failed to save quiz data:", err);
    res.status(500).json({ error: "Failed to save quiz data" });
  }
});

// Endpoint to fetch history data
app.get('/api/history/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const history = await Quiz.find({ quizId });
    res.status(200).json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history data' });
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
