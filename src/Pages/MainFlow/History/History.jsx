import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.user.uid);

  useEffect(() => {
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
  }, [userId]);

  const handleCardClick = (quiz) => {
    navigate("/feedback", { state: { quizData: quiz } });
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
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default History;
