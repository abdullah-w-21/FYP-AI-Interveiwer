import React, { useState } from "react";
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
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch, useSelector } from "react-redux";
import { updateGeneraion } from "../../../Redux/Reducers/QuestionsReducer";
import { useNavigate } from "react-router-dom";

const ChatBox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questionsArray = useSelector((state) => state.questions.quiz);
  const [isLoading, setIsLoading] = useState(false);
  const [userResponses, setUserResponses] = useState([]);
  const [lockConfirmationOpen, setLockConfirmationOpen] = useState(false);


  const handleAnswerChange = (event, index) => {
    const newResponses = [...userResponses];
    newResponses[index] = event.target.value;
    setUserResponses(newResponses);
  };
  const handleDeleteTransaction = () => {
    setLockConfirmationOpen(true);
  };
  const cancelLockConfirmation = () => {
    setLockConfirmationOpen(false);
  };
  const confirmLockConfirmation = () => {
    
  };
  const handleSubmitAnswers = () => {
    setIsLoading(true);
    dispatch(updateGeneraion(userResponses));
    console.log("Submitted Answers:", userResponses);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/feedback");
    }, 2000);
  };

  return (
    <div style={{ paddingTop: "5rem" }}>
      {questionsArray.map((questionsData, index) => (
        <Card key={index} variant="outlined" style={{ marginBottom: "1rem" }}>
          <CardContent>
            <Typography variant="body1">
              Question {index + 1}: {questionsData.question}
            </Typography>
            <TextField
              label="Your Answer"
              variant="outlined"
              onChange={(e) => handleAnswerChange(e, index)}
              fullWidth
              margin="normal"
              required
            />
            <IconButton
              variant="contained"
              color="error"
              onClick={() => handleDeleteTransaction()}
            >
              <LockIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}
      {questionsArray.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
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
            disabled={isLoading && isLocking}
            autoFocus
          >
            {isLoading && isLocking ? (
              <CircularProgress size={24} />
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatBox;
