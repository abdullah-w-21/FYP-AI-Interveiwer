import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { resetGeneration } from "../../../Redux/Reducers/QuestionsReducer";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button,
  IconButton,
  Container,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import QuizIcon from '@mui/icons-material/Quiz';
import QuizHistoryTable from './QuizHistoryTable.jsx';
import "./history.css";


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state) => state.auth.user.uid);
  const username = useSelector((state) => state.auth.user.username);
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
          `https://depserver.vercel.app/api/history/${userId}`
        );
        setHistoryData(response.data);
      } catch (error) {
        console.error("Error fetching history data:", error);
        setSnackbarMessage("Error loading history data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [userId, dispatch]);

  const handleViewDetails = (quiz) => {
    navigate("/feedback", { state: { quizData: quiz } });
  };

  const handleDelete = (quizId, e) => {
    e.stopPropagation();
    setQuizToDelete(quizId);
    setDeleteConfirmationOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const cancelDeleteConfirmation = () => {
    setQuizToDelete("");
    setDeleteConfirmationOpen(false);
  };

  const confirmDeleteConfirmation = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`https://depserver.vercel.app/api/quiz/${quizToDelete}`);
      setHistoryData((prevData) =>
        prevData.filter((q) => q._id !== quizToDelete)
      );
      setSnackbarMessage("Quiz deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      setSnackbarMessage(error.message || "Error deleting quiz");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      setDeleteConfirmationOpen(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAverageScore = (quiz) => {
    const scores = quiz.questions.map((q) => {
      const score = parseFloat(q.score);
      return quiz.quizType.includes("mcqs") ? score  : score;
    });
    return scores.length ? scores.reduce((acc, score) => acc + score, 0) / scores.length : 0;
  };

  // Aggregate stats calculation
  const aggregateStats = {
    totalQuizzes: historyData.length,
    averageScore: historyData.length ? 
      historyData.reduce((acc, quiz) => acc + calculateAverageScore(quiz), 0) / historyData.length : 0,
    totalQuestions: historyData.reduce((acc, quiz) => acc + quiz.questions.length, 0)
  };

  // Chart data preparation
  const chartData = {
    labels: historyData.slice().reverse().map(item => formatDate(item.createdAt)),
    datasets: [{
      label: 'Quiz Scores',
      data: historyData.slice().reverse().map(item => calculateAverageScore(item)),
      borderColor: '#153969',
      backgroundColor: 'rgba(21, 57, 105, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="history_main_box" sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4,my: 5 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            {username}'s Quiz History
          </Typography>
          <AccessTimeIcon sx={{ fontSize: 32, color: '#153969' }} />
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              title: "Total Quizzes",
              value: aggregateStats.totalQuizzes,
              icon: <BarChartIcon sx={{ fontSize: 32 }} />,
              gradient: true
            },
            {
              title: "Average Score",
              value: `${(aggregateStats.averageScore).toFixed(1)}%`,
              icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />,
              gradient: false
            },
            {
              title: "Total Questions",
              value: aggregateStats.totalQuestions,
              icon: <QuizIcon sx={{ fontSize: 32 }} />,
              gradient: true
            }
          ].map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  background: stat.gradient ? 
                    'linear-gradient(45deg, #153969, #718bab)' : 
                    'white',
                  color: stat.gradient ? 'white' : 'inherit',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        bgcolor: stat.gradient ? 'rgba(255,255,255,0.2)' : 'rgba(21,57,105,0.1)',
                        borderRadius: '50%',
                        p: 1.5
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Performance Chart */}
        {/* <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Performance Trend
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card> */}

        {/* Quiz History Cards */}
        <Grid container spacing={3}>
          {historyData.map((quiz, index) => {
            const averageScore = calculateAverageScore(quiz);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                <Card 
                  sx={{ 
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Quiz {index + 1}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(quiz.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={(e) => handleDelete(quiz._id, e)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography color="text.secondary">Score</Typography>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold"
                          color={getScoreColor(averageScore)}
                        >
                          {averageScore.toFixed(1)}%
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${quiz.questions.length} Questions`}
                          size="small"
                        />
                        <Chip 
                          label={quiz.quizType}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="text"
                      color="primary"
                      endIcon={<ChevronRightIcon />}
                      onClick={() => handleViewDetails(quiz)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {historyData.length === 0 && (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No History Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You haven't taken any quizzes yet. Start a quiz to build your history!
            </Typography>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmationOpen}
          onClose={cancelDeleteConfirmation}
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 1,
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>Delete Quiz</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this quiz? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button
              onClick={cancelDeleteConfirmation}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteConfirmation}
              variant="contained"
              color="error"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
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
      </Container>
    </Box>
  );
};

export default HistoryPage;
