import React, { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import QuizIcon from '@mui/icons-material/Quiz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { generateSuccess, resetGeneration, updateQuizData, updateQuizType } from "../../../Redux/Reducers/QuestionsReducer";
import { useDispatch, useSelector } from "react-redux";
import { startQuiz } from "../../../Redux/Actions/AuthActions";

const StartmcqQuiz = () => {
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
  const userId = useSelector((state) => state.auth.user.uid);

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

    const apiUrl =
      difficulty === "Easy"
        ? `{process.env.BASE_URL}/generate_mcq`
        : `{process.env.BASE_URL}/adaptive_mcq`;

    try {
      startQuiz(userId);
      const requestData =
        difficulty === "Easy"
          ? {
              topic: customTopic || topic,
              role,
              difficulty,
              num_questions: numQuestions.toString(),
            }
          : { topic: customTopic || topic, role, difficulty };

      const response = await axios.post(apiUrl, requestData, { timeout: 30000 });

      setSnackbarOpen(false);
      setSnackbarMessage("Get ready....");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);

      let mcqQuestions;

      if (difficulty === "Easy") {
        mcqQuestions = response.data.MCQs.map((item, index) => ({
          question: item.question,
          options: item.options,
          correct_answer: item.correct_answer,
          explanation: item.explanation,
          locked: index === 0 ? false : true,
          isGenerated: false,
        }));
        dispatch(updateQuizType({ quizType: "simple mcqs" }));
        dispatch(generateSuccess(mcqQuestions));
        navigate("/mcqsbox");
      } else {
        const adaptiveResponse = response.data.next_question;
        mcqQuestions = [
          {
            question: adaptiveResponse.question,
            options: adaptiveResponse.options,
            correct_answer: adaptiveResponse.correct_answer,
            explanation: adaptiveResponse.explanation,
            locked: false,
            isGenerated: false,
          },
        ];
        dispatch(
          updateQuizData({
            topic: customTopic || topic,
            role,
            difficulty,
            numQuestions,
          })
        );
        dispatch(updateQuizType({ quizType: "adaptive mcqs" }));
        dispatch(generateSuccess(mcqQuestions));
        navigate("/adaptivemcqsbox");
      }
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
      <Button
        variant="contained"
        onClick={() => navigate("/typeselect")}
        sx={{
          // background: 'linear-gradient(135deg, #3657ff, #000080)',
          background: 'linear-gradient(45deg, #153969, #718bab)',
          transition: "transform 0.3s, box-shadow 0.3s",
          '&:hover': {
            transform: "scale(1.05)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            // background: "linear-gradient(135deg, #3657ff, #000080)",
            background: "#153969",
            color: "#fff",
          },
        }}
      >
        <ArrowBackIcon />
      </Button>

      <Container
        maxWidth="md"
        sx={{
          p: 4,
          mt: 3,
          borderRadius: '20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" fontWeight="bold">
            Start Quiz
          </Typography>
          <QuizIcon fontSize="large" sx={{ color: '#153969' }} />
        </Stack>

        <form onSubmit={handleStartQuiz}>
          <TextField
            select
            label="Select Topic"
            variant="outlined"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (e.target.value !== "Others") {
                setCustomTopic(""); // Clear custom topic if a different option is selected
              }
            }}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Programming Fundamentals">Programming Fundamentals</MenuItem>
            <MenuItem value="Data Structures and Algorithms">Data Structures and Algorithms</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>

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
            <MenuItem value="MERN Stack Developer">MERN Stack Developer</MenuItem>
            <MenuItem value="SQA Engineer">SQA Engineer</MenuItem>
            <MenuItem value="Others" disabled>Others</MenuItem>
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

          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                padding: '10px 20px',
                // background: 'linear-gradient(-45deg, #000080, #3657ff)',
                background: 'linear-gradient(45deg, #153969, #718bab)',
                transition: "transform 0.3s, box-shadow 0.3s",
                '&:hover': {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  // background: "linear-gradient(135deg, #3657ff, #000080)",
                  background: "#153969",

                  color: "#fff",
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : <><PlayArrowIcon sx={{ pr: 1 }} /> Start</>}
            </Button>
          </Stack>
        </form>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default StartmcqQuiz;
