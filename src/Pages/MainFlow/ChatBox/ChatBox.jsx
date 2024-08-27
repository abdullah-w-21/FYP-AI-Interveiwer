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
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGeneration,
  toggleLock,
  generateSuccess,
  setGrading,
} from "../../../Redux/Reducers/QuestionsReducer";
import { useNavigate } from "react-router-dom";
import TypingEffect from "./TypingEffect";
import axios from "axios";

const ChatBox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questionsArray = useSelector((state) => state.questions.quiz);
  const lockedState = useSelector((state) => state.questions.quiz);
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


  const handleAnswerChange = (event, index) => {
    const newResponses = [...userResponses];
    newResponses[index] = event.target.value;
    setUserResponses(newResponses);
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
        const response = await axios.post("http://127.0.0.1:5000/grade", {
          api_answer: questionsArray[i].answer,
          user_answer: userResponses[i],
        });

        const grading = JSON.parse(response.data);
        dispatch(
          setGrading({
            index: i,
            score: grading.score,
            feedback: grading.feedback,
            explanation: grading.explanation,
          })
        );

        gradingResults.push({
          question: questionsArray[i].question,
          answer: questionsArray[i].answer,
          userResponse: userResponses[i] || "",
          score: grading.score || "0",
          feedback: grading.feedback || "",
          explanation: grading.explanation || "",
        });
      }

      // Send the entire array as a single document
      await axios.post("http://127.0.0.1:5001/api/quiz", {
        quizId: userId,
        questions: gradingResults,
      });

      setIsLoading(false);
      navigate("/history");
    } catch (error) {
      console.error("Error grading answers:", error);
      setIsLoading(false);
      setErrorGrading(true);
    }

    setTimeout(() => {
      dispatch(toggleLock({ index: questionsArray.length - 1 }));
      setIsLoading(false);
    }, 2000);
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
        !lockedState[index].locked ? (
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
                  errorGrading && index === questionsArray.length - 1
                    ? lastUserResponse
                    : userResponses[index] || ""
                }
                multiline
                rows={5}
                fullWidth
                margin="normal"
                required
              />
              {index + 1 !== questionsArray.length ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    variant="contained"
                    color="error"
                    onClick={() => handleLocking(index)}
                  >
                    <LockIcon />
                  </IconButton>
                </div>
              ) : null}
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
