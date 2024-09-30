import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetGeneration } from "../../../Redux/Reducers/QuestionsReducer";

const History = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state) => state.auth.user.uid);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch(resetGeneration());
    const fetchHistoryData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/api/history/${userId}`
        );
        setHistoryData(response.data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [userId, historyData]);

  const handleCardClick = (quiz) => {
    navigate("/feedback", { state: { quizData: quiz } });
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDelete = (quizId, e) => {
    e.stopPropagation();
    setQuizToDelete(quizId);
    setDeleteConfirmationOpen(true);
  };
  const cancelDeleteConfirmation = () => {
    setQuizToDelete("");
    setDeleteConfirmationOpen(false);
  };
  const confirmDeleteConfirmation = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5001/api/quiz/${quizToDelete}`);
      setHistoryData((prevData) =>
        prevData.filter((q) => q._id !== quizToDelete)
      );
      setDeleteConfirmationOpen(false);
      setIsLoading(false);
      setSnackbarMessage("Quiz deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      setDeleteConfirmationOpen(false);
      setIsLoading(false);
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (loading)
    return (
      <Typography
        variant="h1"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        Loading...
      </Typography>
    );

  return (
    <Box style={{ paddingTop: "5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={"bold"} variant="h4" gutterBottom>
          History
        </Typography>
      </div>
      <Grid container spacing={2}>
        {historyData.map((entry, index) => {
          const scores = entry.questions.map((q) => {
            const score = parseFloat(q.score);
            return entry.quizType.includes("mcqs") ? score * 100 : score;
          });
          const totalScore = scores.reduce((acc, score) => acc + score, 0);
          const averageScore = scores.length ? totalScore / scores.length : 0;

          return (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                variant="outlined"
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  boxShadow: "5px 5px 5px 5px grey",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(entry)}
              >
                <CardContent>
                  <Typography variant="h4">Quiz {index + 1}</Typography>
                  <Typography variant="body1" style={{ fontSize: "1.2rem" }}>
                    Average Score: {averageScore.toFixed(2)}%
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={(e) => handleDelete(entry._id, e)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={cancelDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the quiz permanently?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelDeleteConfirmation}
            color="error"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteConfirmation}
            color="primary"
            variant="contained"
            disabled={isLoading}
            autoFocus
          >
            {isLoading ? <CircularProgress size={24} /> : "Yes, Delete"}
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

export default History;
