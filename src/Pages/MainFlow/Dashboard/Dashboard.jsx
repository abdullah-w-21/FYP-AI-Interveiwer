import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Chart, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { getQuizAttemptsCount } from "../../../Redux/Actions/AuthActions";
import { resetGeneration } from "../../../Redux/Reducers/QuestionsReducer";

Chart.register(CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const dispatch = useDispatch();
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [averageScores, setAverageScores] = useState([]);
  const userId = useSelector((state) => state.auth.user.uid);

  useEffect(() => {
    dispatch(resetGeneration());
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/api/history/${userId}`
        );
        console.log(response.data);
        const attemptsCount = await getQuizAttemptsCount(userId);
        setTotalAttempts(attemptsCount);
        setTotalQuizzes(response.data.length);

        const scores = response.data.map((quizAttempt) => {
          const questionScores = quizAttempt.questions.map((question) =>
            quizAttempt.quizType.includes("mcqs")
              ? parseFloat(question.score * 100)
              : parseFloat(question.score)
          );
          const averageScore =
            questionScores.reduce((acc, score) => acc + score, 0) /
            questionScores.length;
          return averageScore || 0;
        });

        setAverageScores(scores);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const data = {
    labels: averageScores.map((_, index) => `Quiz ${index + 1}`),
    datasets: [
      {
        label: "Average Scores",
        data: averageScores,
        backgroundColor: "rgba(30, 144, 255, 0.5)",
        borderColor: "rgba(30, 144, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box style={{ padding: "2rem", paddingTop: "3rem" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              padding: "2rem",
              backgroundColor: "#1976d2",
              color: "white",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Total Attempts</Typography>
            <Typography variant="h4">{totalAttempts}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              padding: "2rem",
              backgroundColor: "#4caf50",
              color: "white",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Total Quizzes</Typography>
            <Typography variant="h4">{totalQuizzes}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              padding: "2rem",
              backgroundColor: "#ff9800",
              color: "white",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Average Score</Typography>
            <Typography variant="h4">
              {totalQuizzes
                ? (
                    averageScores.reduce((a, b) => a + b, 0) /
                    averageScores.length
                  ).toFixed(2)
                : 0}
              %
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: "2rem" }}>
        <Bar data={data} />
      </Box>
    </Box>
  );
};

export default Dashboard;
