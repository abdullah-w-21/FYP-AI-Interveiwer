const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Replace with your MongoDB URI
const mongoURI = "your-mongodb-connection-string";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define Quiz Schema
const quizSchema = new mongoose.Schema({
  question: String,
  answer: String,
  userResponse: String,
  score: String,
  feedback: String,
  explanation: String,S
});

// Create Quiz model
const Quiz = mongoose.model("Quiz", quizSchema);

// API endpoint to save quiz data
app.post("/api/quiz", async (req, res) => {
  try {
    const quizData = req.body; // Array of quiz objects
    await Quiz.insertMany(quizData); // Save array of quiz objects to MongoDB
    res.status(201).json({ message: "Quiz data saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save quiz data" });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
