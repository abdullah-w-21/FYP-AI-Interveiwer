import { useState, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button, 
  useTheme,
  useMediaQuery 
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import QuizIcon from "@mui/icons-material/Quiz";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from "axios";
import "./Dashboard.css";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery('(max-width:600px)');
  const isSmall = useMediaQuery('(max-width:900px)');
  const username = useSelector((state) => state.auth.user.username);
  const userId = useSelector((state) => state.auth.user.uid);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    totalQuizzes: 0,
    averageScore: 0
  });

  const calculateTotalAttempts = (quizzes) => {
    return quizzes.reduce((total, quiz) => total + quiz.questions.length, 0);
  };

  //  average score for  quiz
  const calculateAverageScore = (quiz) => {
    const scores = quiz.questions.map((q) => {
      const score = parseFloat(q.score);
      return quiz.quizType.includes("mcqs") ? score : score;
    });
    return scores.length ? scores.reduce((acc, score) => acc + score, 0) / scores.length : 0;
  };

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await axios.get(
          `https://depserver.vercel.app/api/history/${userId}`
        );
        setHistoryData(response.data);
        
        // Calculate stats
        const totalQuizzes = response.data.length;
        const totalAttempts = response.data.reduce((acc, quiz) => acc + quiz.questions.length, 0);
        const averageScore = totalQuizzes ? 
          response.data.reduce((acc, quiz) => acc + calculateAverageScore(quiz), 0) / totalQuizzes : 0;

        setStats({
          totalAttempts,
          totalQuizzes,
          averageScore: averageScore.toFixed(1)
        });

      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [userId]);

  // Chart data
  const chartData = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5', 'Quiz 6', 'Quiz 7'],
    datasets: [
      {
        label: 'Quiz Scores',
        data: historyData.slice(-7).map(quiz => calculateAverageScore(quiz)),
        backgroundColor: 'rgba(21, 57, 105, 0.6)',
        borderColor: 'rgba(21, 57, 105, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !isExtraSmall,
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    }
  };

  // Stats Card Component
  const StatsCard = ({ title, value, icon, isGradient }) => (
    <Card 
      className={isGradient ? "gradient" : ""} 
      sx={{ 
        borderRadius: '15px',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              backgroundColor: isGradient ? 'rgba(255,255,255,0.2)' : 'rgba(21,57,105,0.1)',
              borderRadius: '50%',
              p: 2
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div> 
      <Box className="main_box" sx={{ p: isExtraSmall ? 2 : 4, marginTop:'50px'}}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {username}
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatsCard
              title="Total Questions"
              value={stats.totalAttempts}
              icon={<AssessmentIcon sx={{ fontSize: 32, color: '#153969' }} />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard
              title="Total Quizzes"
              value={stats.totalQuizzes}
              icon={<QuizIcon sx={{ fontSize: 32 }} />}
              isGradient
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard
              title="Average Score"
              value={`${stats.averageScore}%`}
              icon={<EmojiEventsIcon sx={{ fontSize: 32, color: '#153969' }} />}
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Chart Section */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Performance Overview
                </Typography>
                <Box sx={{ height: 400, pt: 2 }}>
                  <Bar data={chartData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* User Profile & Actions */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* User Profile Card */}
              <Card sx={{ borderRadius: '15px' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{ 
                        backgroundColor: 'rgba(21,57,105,0.1)', 
                        borderRadius: '50%', 
                        p: 1 
                      }}
                    >
                      <AccountCircleIcon sx={{ fontSize: 40, color: '#153969' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dashboard Overview
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card sx={{ borderRadius: '15px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/typeselect"
                      className="gradient"
                      sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none',
                        py: 1.5
                      }}
                    >
                      Start Your Interview

                    </Button>
                    <Button
                      variant="outlined"
                      component={RouterLink}
                      to="/history"
                      sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none',
                        py: 1.5,
                      }}
                    >
                      View History
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
