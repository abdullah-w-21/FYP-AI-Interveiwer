import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { generateSuccess, updateQuizType } from "../../../Redux/Reducers/QuestionsReducer";
import { useDispatch } from "react-redux";

const StartQuiz = () => {
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState(""); // New state for custom topic
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleStartQuiz = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSnackbarMessage("Wait! Generating questions....");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    try {
      const response = await axios.post("http://127.0.0.1:5002", {
        topic: customTopic || topic, // Use custom topic if provided
        role,
        difficulty,
        num_questions: numQuestions.toString(),
      });
      setSnackbarOpen(false);
      setSnackbarMessage("Get ready....");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      const questionsArray = JSON.parse(response.data);
      const interviewQuestions = questionsArray["Interview Questions"].map(
        (item, index) => ({
          question: item.question,
          answer: item.answer,
          locked: index === 0 ? false : true,
          isGenerated: false,
        })
      );

      dispatch(updateQuizType({ quizType: "open ended" }));
      dispatch(generateSuccess(interviewQuestions));
      navigate("/chatbox");
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbarMessage("Could not get response, please try again!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Container maxWidth="md" sx={{ alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={"bold"} variant="h4" gutterBottom>
            Start Quiz
          </Typography>
        </div>
        <form onSubmit={handleStartQuiz}>
          <TextField
            select
            label="Select Topic"
            variant="outlined"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (e.target.value === "Others") {
                setCustomTopic(""); // Reset custom topic when selecting "Others"
              }
            }}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Programming Fundamentals">
              Programming Fundamentals
            </MenuItem>
            <MenuItem value="Data Structures and Algorithms">
              Data Structures and Algorithms
            </MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>

          {/* Conditional rendering for custom topic input */}
          {topic === "Others" && (
            <TextField
              label="Enter Custom Topic"
              variant="outlined"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          )}

          <TextField
            select
            label="Select Role"
            variant="outlined"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Project Manager">Project Manager</MenuItem>
            <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
            <MenuItem value="MERN Stack Developer">
              MERN Stack Developer
            </MenuItem>
            <MenuItem value="SQA Engineer">SQA Engineer</MenuItem>
            <MenuItem value="Others" disabled>
              Others
            </MenuItem>
          </TextField>
          <TextField
            select
            label="Select Difficulty"
            variant="outlined"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </TextField>
          <TextField
            select
            label="Select No. of Questions"
            variant="outlined"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value={2}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </TextField>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                (!customTopic && topic === "Others") || // Disable if custom topic is empty and "Others" is selected
                !topic || !role || !difficulty || !numQuestions || isLoading
              }
              sx={{ backgroundColor: "#1976d2" }}
            >
              {isLoading ? (
                <CircularProgress sx={{ color: "primary" }} size={24} />
              ) : (
                "Start Quiz"
              )}
            </Button>
          </div>
        </form>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default StartQuiz;
