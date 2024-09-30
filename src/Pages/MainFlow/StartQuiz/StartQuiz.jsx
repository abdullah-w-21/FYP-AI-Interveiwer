import React, { useEffect, useState } from "react";
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
import {
  generateSuccess,
  resetGeneration,
  updateQuizType,
} from "../../../Redux/Reducers/QuestionsReducer";
import { useDispatch, useSelector } from "react-redux";
import { startQuiz } from "../../../Redux/Actions/AuthActions";

const StartQuiz = () => {
  const userId = useSelector((state) => state.auth.user.uid);
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetGeneration());
  }, []);
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
      let response;
      const currentTopic = pdfFile ? "topic of book" : customTopic || topic;

      if (pdfFile) {
        const formData = new FormData();
        formData.append("pdf", pdfFile);
        formData.append("topic", currentTopic);
        formData.append("role", role);
        formData.append("difficulty", difficulty);
        formData.append("num_questions", numQuestions.toString());

        response = await axios.post(
          "http://127.0.0.1:5004/upload_pdf",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post("http://127.0.0.1:5002", {
          topic: currentTopic,
          role,
          difficulty,
          num_questions: numQuestions.toString(),
        });
      }
      startQuiz(userId);
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
      if (pdfFile) {
        setSnackbarMessage("Try uploading pdf of 20 pages or less!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      setSnackbarMessage("Could not get response, please try again!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching data:", error);
    } finally {
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
                setCustomTopic("");
              }
            }}
            fullWidth
            margin="normal"
            required
            disabled={!!pdfFile}
          >
            <MenuItem value="Programming Fundamentals">
              Programming Fundamentals
            </MenuItem>
            <MenuItem value="Data Structures and Algorithms">
              Data Structures and Algorithms
            </MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>

          {topic === "Others" && !pdfFile && (
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
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            onClick={() => setShowPdfUpload((prev) => !prev)}
            sx={{ marginY: 2 }}
          >
            Upload PDF to generate questions from it (Optional)
          </Button>

          {showPdfUpload && (
            <TextField
              type="file"
              variant="outlined"
              onChange={(e) => setPdfFile(e.target.files[0])}
              fullWidth
              margin="normal"
              inputProps={{ accept: "application/pdf" }}
            />
          )}

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
                (!customTopic && topic === "Others" && !pdfFile) ||
                (!topic && !pdfFile) ||
                !role ||
                !difficulty ||
                !numQuestions ||
                isLoading
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
