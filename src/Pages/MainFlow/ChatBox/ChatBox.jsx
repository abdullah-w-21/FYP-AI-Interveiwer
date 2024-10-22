import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Snackbar,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import MicIcon from "@mui/icons-material/Mic";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGeneration,
  toggleLock,
  generateSuccess,
  setGrading,
  resetGeneration,
} from "../../../Redux/Reducers/QuestionsReducer";
import { useNavigate } from "react-router-dom";
import TypingEffect from "./TypingEffect";
import axios from "axios";

const ChatBox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questionsArray = useSelector((state) => state.questions.quiz);
  const lockedState = useSelector((state) => state.questions.quiz);
  const quizType = useSelector((state) => state.questions.quizType);
  const userId = useSelector((state) => state.auth.user.uid);
  const [lockedIndex, setLockedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userResponses, setUserResponses] = useState([]);
  const [lockConfirmationOpen, setLockConfirmationOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorGrading, setErrorGrading] = useState(false);
  const [lastUserResponse, setLastUserResponse] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [micActive, setMicActive] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";
      setRecognition(recognitionInstance);
    }
  }, []);

  const handleAnswerChange = (event, index) => {
    const newResponses = [...userResponses];
    newResponses[index] = event.target.value;
    setUserResponses(newResponses);
  };

  const handleMicClick = (index) => {
    if (!recognition) {
      setSnackbarMessage(
        "Speech Recognition is not supported on this browser."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (micActive) {
      recognition.stop();
      setMicActive(false);
    } else {
      recognition.start();
      setMicActive(true);

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        const newResponses = [...userResponses];
        newResponses[index] = speechResult;
        setUserResponses(newResponses);
      };

      recognition.onerror = (event) => {
        // setSnackbarMessage("Speech Recognition Error: " + event.error);
        // setSnackbarSeverity("error");
        // setSnackbarOpen(true);
        setMicActive(false);
      };

      recognition.onend = () => {
        setMicActive(false);
      };
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLocking = (index) => {
    if (!userResponses[index]) {
      setSnackbarMessage("Please provide an answer before locking!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setLockedIndex(index);
    setLockConfirmationOpen(true);
  };

  const cancelLockConfirmation = () => {
    setLockedIndex(null);
    setLockConfirmationOpen(false);
  };

  const confirmLockConfirmation = (e) => {
    e.preventDefault();
    dispatch(toggleLock({ index: lockedIndex }));
    setLockConfirmationOpen(false);
  };

  const handleSubmitAnswers = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(updateGeneration(userResponses));
    console.log("Submitted Answers:", userResponses);
    let gradingResults = [];

    try {
      for (let i = 0; i < userResponses.length; i++) {
        const response = await axios.post(`{process.env.BASE_URL}/grade`, {
          api_answer: questionsArray[i].answer,
          user_answer: userResponses[i],
        });

        const grading = response.data;
        console.log(grading);
        const similarityScore = parseFloat(
          grading.similarity_score.replace("%", "")
        );

        const averageScore = (parseFloat(grading.score) + similarityScore) / 2;
        dispatch(
          setGrading({
            index: i,
            score: averageScore,
            feedback: grading.feedback,
            explanation: grading.explanation,
          })
        );

        gradingResults.push({
          question: questionsArray[i].question,
          answer: questionsArray[i].answer,
          userResponse: userResponses[i] || "",
          score: averageScore || "0",
          feedback: grading.feedback || "",
          explanation: grading.explanation || "",
        });
        setLastUserResponse(userResponses[i]);
      }

      await axios.post("https://depserver.vercel.app/api/quiz", {
        quizId: userId,
        questions: gradingResults,
        quizType: "open ended",
      });
      setIsLoading(false);
      dispatch(toggleLock({ index: questionsArray.length - 1 }));
      dispatch(resetGeneration());
      navigate("/history");
    } catch (error) {
      console.error("Error grading answers:", error);
      setIsLoading(false);
      setErrorGrading(true);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      {questionsArray.map((questionsData, index) =>
        !lockedState[index].locked && quizType === "open ended" ? (
          <Card
            key={index}
            variant="outlined"
            style={{ marginBottom: "1rem", minWidth: "100%" }}
          >
            <CardContent>
              <Typography variant="body1" sx={{ fontSize: "x-large" }}>
                Question {index + 1}:{" "}
                <TypingEffect
                  text={questionsData.question}
                  questionsArray={questionsArray}
                  index={index}
                />
              </Typography>
              <TextField
                label="Your Answer"
                variant="outlined"
                onChange={(e) => handleAnswerChange(e, index)}
                value={
                  errorGrading && index === questionsArray.length
                    ? lastUserResponse
                    : userResponses[index] || ""
                }
                multiline
                rows={5}
                fullWidth
                margin="normal"
                required
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleMicClick(index)}
                >
                  <MicIcon
                    sx={{
                      color: micActive ? "#ffffff" : "#1976d2",
                      backgroundColor: micActive ? "#ff4d4d" : "white",
                      height: "2em",
                      width: "2em",
                      borderRadius: "50%",
                      boxShadow: micActive
                        ? "0 0 15px rgba(255, 77, 77, 0.6), 0 0 25px rgba(255, 77, 77, 0.8)"
                        : "0 4px 10px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s ease",
                      animation: micActive
                        ? "pulse 1.5s infinite ease-in-out"
                        : "none",
                      "@keyframes pulse": {
                        "0%": {
                          transform: "scale(1)",
                          boxShadow:
                            "0 0 15px rgba(255, 77, 77, 0.6), 0 0 25px rgba(255, 77, 77, 0.8)",
                        },
                        "50%": {
                          transform: "scale(1.1)",
                          boxShadow:
                            "0 0 20px rgba(255, 77, 77, 1), 0 0 30px rgba(255, 77, 77, 1)",
                        },
                        "100%": {
                          transform: "scale(1)",
                          boxShadow:
                            "0 0 15px rgba(255, 77, 77, 0.6), 0 0 25px rgba(255, 77, 77, 0.8)",
                        },
                      },
                    }}
                  />
                </IconButton>
                {index + 1 !== questionsArray.length && (
                  <IconButton
                    variant="contained"
                    color="error"
                    onClick={() => handleLocking(index)}
                  >
                    <LockIcon />
                  </IconButton>
                )}
              </div>
            </CardContent>
            {index + 1 === questionsArray.length && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{ marginBottom: "2rem" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={handleSubmitAnswers}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress sx={{ color: "primary" }} size={24} />
                  ) : (
                    "Submit Answers"
                  )}
                </Button>
              </div>
            )}
          </Card>
        ) : null
      )}

      <Dialog
        open={lockConfirmationOpen}
        onClose={cancelLockConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Lock Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to lock the answer? You will not be able to
            re-attempt it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelLockConfirmation}
            color="error"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmLockConfirmation}
            color="primary"
            variant="contained"
            disabled={isLoading}
            autoFocus
          >
            {isLoading ? <CircularProgress size={24} /> : "Yes, Lock"}
          </Button>
        </DialogActions>
      </Dialog>
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
export default ChatBox;
