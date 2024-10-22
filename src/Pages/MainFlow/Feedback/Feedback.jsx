import React, { useEffect, useState } from "react";
import FeedbackIcon from '@mui/icons-material/Feedback';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
  Divider,
  Rating,
  Grid,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetGeneration } from "../../../Redux/Reducers/QuestionsReducer";

const Feedback = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { quizData } = location.state || { quizData: { questions: [] } };
  const [expandedIndex, setExpandedIndex] = useState(-1);

  useEffect(() => {
    dispatch(resetGeneration());
  }, []);

  const handleToggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };

  const getColorForScore = (score) => {
    if (quizData.quizType === "simple mcqs" || quizData.quizType === "adaptive mcqs") {
      return score === 1;  
      
      // ? "green" : "red"
    }
    // if (score >= 75) return "green";
    // if (score >= 50) return "orange";
    // return "red";
  };

  const getStarRating = (score) => {
    return score >= 75 ? 4 : score >= 50 ? 3 : score >= 20 ? 2 : 1;
  };

  const renderResultIcon = (score) => {
    return score >= 50 ? (
      <CheckCircleIcon sx={{ color: "green", marginLeft: "0.5rem" }} />
    ) : (
      <CancelIcon sx={{ color: "red", marginLeft: "0.5rem" }} />
    );
  };

  return (
    <Box sx={{ paddingTop: "5rem", paddingX: "2rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <Typography variant="h3" fontWeight="600">
          Feedback
        </Typography>
        <FeedbackIcon fontSize="large" sx={{ marginLeft: "0.5rem", color: "#153969" }} />
      </Box>

      {quizData.questions.map((questionsData, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
            width: "90%",
            margin: "1rem auto",
            borderRadius: "12px",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                <Avatar sx={{ bgcolor: "#153969" }}>{index + 1}</Avatar>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                  Question {index + 1}: {questionsData.question}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ marginY: "1rem" }} />

            <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
              <strong>Answer:</strong> {questionsData.userResponse}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Typography variant="body1" sx={{ marginRight: "0.5rem" }}>
                <strong>Result:</strong>
              </Typography>
              {renderResultIcon(Math.round(questionsData.score))}
            </Box>

            {/* Star Rating on a New Line */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Rating
                name="score-rating"
                value={getStarRating(parseInt(questionsData.score))}
                readOnly
                precision={0.5}
                size="large"
                sx={{ color: getColorForScore(parseInt(questionsData.score)),  }}
              />
            </Box>

            <Divider sx={{ marginBottom: "1rem" }} />

            <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
              <strong>Feedback:</strong> {questionsData.feedback}
            </Typography>

            <Box display="flex" alignItems="center">
              <Typography variant="body1">
                <strong>Explanation:</strong>
              </Typography>
              <IconButton
                aria-label={expandedIndex === index ? "collapse" : "expand"}
                onClick={() => handleToggleExpand(index)}
                size="small"
              >
                {expandedIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
              <Typography variant="body2" sx={{ marginTop: "1rem", color: "#555" }}>
                {questionsData.explanation}
              </Typography>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Feedback;
