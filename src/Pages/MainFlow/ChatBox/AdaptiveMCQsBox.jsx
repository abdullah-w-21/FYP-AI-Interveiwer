import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGeneration,
  toggleLock,
  setGrading,
  adaptiveQuizUpdate,
  resetGeneration,
} from "../../../Redux/Reducers/QuestionsReducer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TypingEffect from "./TypingEffect";

const AdaptiveMCQsBox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user.uid);
  const questionsArray = useSelector((state) => state.questions.quiz);
  console.log(questionsArray);
  const quizData = useSelector((state) => state.questions.quizData);
  const quizType = useSelector((state) => state.questions.quizType);
  const [isLoading, setIsLoading] = useState(false);
  const [userResponses, setUserResponses] = useState([]);
  const [lockedIndex, setLockedIndex] = useState(null);
  const [lockConfirmationOpen, setLockConfirmationOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOptionChange = (event, index) => {
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
      setSnackbarMessage("Please select an option before locking!");
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

  const [adaptiveResponses, setAdaptiveResponses] = useState([
    ...questionsArray,
  ]);
  console.log(adaptiveResponses);
  const confirmLockConfirmation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const currentQuestionData = questionsArray[lockedIndex];
    const userAnswer = userResponses[lockedIndex];
    if (!userAnswer) {
      setSnackbarMessage("Please select an option before locking!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`{process.env.BASE_URL}/adaptive_mcq`, {
        topic: quizData.topic,
        role: quizData.role,
        difficulty: quizData.difficulty,
        user_answer: userAnswer,
        previous_question: currentQuestionData.question,
        previous_answer: currentQuestionData.correct_answer,
      });

      const updatedResponses = [...adaptiveResponses, response.data];
      setAdaptiveResponses(updatedResponses);
      dispatch(
        setGrading({
          index: lockedIndex,
          score: response.data.grading_result.score,
          feedback: response.data.grading_result.feedback,
          explanation: response.data.grading_result.explanation,
        })
      );
      dispatch(adaptiveQuizUpdate(response.data.next_question));
      dispatch(toggleLock({ index: lockedIndex }));
      setLockConfirmationOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending adaptive data:", error);
      setSnackbarMessage("Failed to send data. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  const [submitReady, setSubmitReady] = useState(false);

  useEffect(() => {
    if (submitReady) {
      const submitFinalAnswers = async () => {
        const updatedQFinalArray = questionsArray.map((data, index) => ({
          ...data,
          userResponse: data.options[userResponses[index]],
        }));
        try {
          await axios.post("https://depserver.vercel.app/api/quiz", {
            quizId: userId,
            questions: updatedQFinalArray,
            quizType: "adaptive mcqs",
          });
          // dispatch(toggleLock({ index: lockedIndex + 1 }));
          dispatch(resetGeneration());
          navigate("/history");
          setIsLoading(false);
        } catch (error) {
          console.error("Error submitting final answers:", error);
          setSnackbarMessage("There was an error submitting your answers.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setIsLoading(false);
        }
      };

      submitFinalAnswers();
      setSubmitReady(false);
    }
  }, [questionsArray, submitReady, userId, navigate]);

  const handleSubmitAnswers = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const lastQuestionData = questionsArray[questionsArray.length - 1];
    const userAnswer = userResponses[questionsArray.length - 1];
    if (!userAnswer) {
      setSnackbarMessage("Please select an option before locking!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`{process.env.BASE_URL}/adaptive_mcq`, {
        topic: quizData.topic,
        role: quizData.role,
        difficulty: quizData.difficulty,
        user_answer: userAnswer,
        previous_question: lastQuestionData.question,
        previous_answer: lastQuestionData.correct_answer,
      });

      dispatch(
        setGrading({
          index: lockedIndex + 1,
          score: response.data.grading_result.score,
          feedback: response.data.grading_result.feedback,
          explanation: response.data.grading_result.explanation,
        })
      );

      setSubmitReady(true);
    } catch (error) {
      console.error("Error submitting final answers:", error);
      setSnackbarMessage("There was an error submitting your answers.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
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
      {questionsArray.map((questionData, index) =>
        !questionsArray[index].locked && quizType === "adaptive mcqs" ? (
          <Card
            key={index}
            variant="outlined"
            style={{ marginBottom: "1rem", minWidth: "100%" }}
          >
            <CardContent>
              <Typography variant="body1" sx={{ fontSize: "x-large" }}>
                Question {index + 1}:{" "}
                <TypingEffect
                  text={questionData.question}
                  questionsArray={questionsArray}
                  index={index}
                />
              </Typography>
              <FormControl component="fieldset">
                <FormLabel component="legend">Options</FormLabel>
                <RadioGroup
                  value={userResponses[index] || ""}
                  onChange={(e) => handleOptionChange(e, index)}
                >
                  {Object.entries(questionData.options).map(([key, option]) => (
                    <FormControlLabel
                      key={key}
                      value={key}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              {quizData.numQuestions !== questionsArray.length ? (
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
            {quizData.numQuestions === questionsArray.length && (
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
            {isLoading ? (
              <CircularProgress sx={{ color: "primary" }} size={24} />
            ) : (
              "Yes,Lock "
            )}
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

export default AdaptiveMCQsBox;
