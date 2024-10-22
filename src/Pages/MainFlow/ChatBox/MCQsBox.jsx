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
  Grid,
  Box,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGeneration,
  toggleLock,
  setGrading,
  resetGeneration,
} from "../../../Redux/Reducers/QuestionsReducer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TypingEffect from "./TypingEffect";

const MCQsBox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user.uid);
  const questionsArray = useSelector((state) => state.questions.quiz);
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

  const confirmLockConfirmation = (e) => {
    e.preventDefault();
    dispatch(toggleLock({ index: lockedIndex }));
    setLockConfirmationOpen(false);
  };

  const handleSubmitAnswers = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(updateGeneration(userResponses));

    let gradingResults = [];

    try {
      for (let i = 0; i < userResponses.length; i++) {
        const response = await axios.post(`{process.env.BASE_URL}/grade_mcq`, {
          user_answer: userResponses[i],
          correct_answer: questionsArray[i].correct_answer,
          explanation: questionsArray[i].explanation,
        });

        const grading = response.data;
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
          options: questionsArray[i].options,
          userResponse: questionsArray[i].options[userResponses[i]] || "",
          score: grading.score || 0,
          feedback: grading.feedback || "",
          explanation: grading.explanation || "",
        });
      }

      await axios.post("https://depserver.vercel.app/api/quiz", {
        quizId: userId,
        questions: gradingResults,
        quizType: "simple mcqs",
      });
      setIsLoading(false);
      dispatch(toggleLock({ index: questionsArray.length - 1 }));
      dispatch(resetGeneration());
      navigate("/history");
    } catch (error) {
      console.error("Error grading answers:", error);
      setSnackbarMessage(
        "There was an error processing your answers. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        padding: "1rem",
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        {questionsArray.map((questionData, index) =>
          !questionsArray[index].locked && quizType === "simple mcqs" ? (
            <Grid item xs={12} md={8} key={index}>
              <Card
                variant="elevation"
                elevation={3}
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    Question {index + 1}:
                    <TypingEffect
                      text={questionData.question}
                      questionsArray={questionsArray}
                      index={index}
                    />
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Options</FormLabel>
                    <RadioGroup
                      value={userResponses[index] || ""}
                      onChange={(e) => handleOptionChange(e, index)}
                    >
                      {Object.entries(questionData.options).map(([key, option]) => (
                        <FormControlLabel
                          key={key}
                          value={key}
                          control={<Radio color="primary" />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  {index + 1 !== questionsArray.length && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                      <IconButton
                        variant="contained"
                        color="error"
                        onClick={() => handleLocking(index)}
                      >
                        <LockIcon />
                      </IconButton>
                    </div>
                  )}
                </CardContent>
                {index + 1 === questionsArray.length && (
                  <Box display="flex" justifyContent="center" mb={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitAnswers}
                      disabled={isLoading}
                      sx={{
                        borderRadius: "20px",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          opacity: 0.9,
                        },
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress sx={{ color: "white" }} size={24} />
                      ) : (
                        "Submit Answers"
                      )}
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ) : null
        )}
      </Grid>

      <Dialog
        open={lockConfirmationOpen}
        onClose={cancelLockConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Lock Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to lock the answer? You will not be able to re-attempt it.
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
            autoFocus
          >
            Yes, Lock
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
    </Box>
  );
};

export default MCQsBox;
