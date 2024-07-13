import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();
  const questionsArray = useSelector((state) => state.questions.quiz);
  const [isLoading, setIsLoading] = useState(false);
  const [userResponses, setUserResponses] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(-1); // Track which card is expanded, -1 for none

  const handleToggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? -1 : index); // Toggle collapse/expand
  };

  // Handle submit answers function
  const handleSubmitAnswers = () => {
    setIsLoading(true);
    // Dispatch update generation action with userResponses
    console.log("Submitted Answers:", userResponses);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/feedback");
    }, 2000);
  };

  return (
    <div style={{ paddingTop: "5rem" }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography fontWeight={'bold'} variant="h4" gutterBottom>
          Feedbacks
        </Typography>
      </div>
      {questionsArray.map((questionsData, index) => (
        <Card
          key={index}
          variant="outlined"
          style={{ marginBottom: "3rem", boxShadow: "5px 5px 5px 5px grey" }}
        >
          <CardContent>
            <div style={{ display: 'flex', flexDirection: "column" }}>
              <Typography variant="body1" style={{ fontSize: "large" }}>
                <span style={{ fontWeight: "bold" }}>Question {index + 1}:</span>{" "}
                {questionsData.question}
              </Typography>
              <br />
              <Typography variant="body1" style={{ fontSize: "large" }}>
                <span style={{ fontWeight: "bold" }}>Answer:</span>{" "}
                {questionsData.userResponse}
              </Typography>
              <br />
              <Typography
                variant="body1"
                style={{
                  color: questionsData.score >= 75 ? "green" : "orange",
                  fontSize: "large",
                }}
              >
                <span style={{ fontWeight: "bold", color: "black" }}>Score:</span>{" "}
                {questionsData.score}
              </Typography>
              <br />
              <Typography variant="body1" style={{ fontSize: "large" }}>
                <span style={{ fontWeight: "bold" }}>Feedback:</span>{" "}
                {questionsData.feedback}
              </Typography>
              <br />
              {/* Toggleable explanation */}
              <Typography variant="body1" style={{ display: "flex", alignItems: "center", fontSize: "large" }}>
                <span style={{ fontWeight: "bold" }}>Explanation:</span>{" "}
                <IconButton
                  aria-label={expandedIndex === index ? "collapse" : "expand"}
                  onClick={() => handleToggleExpand(index)}
                  size="small"
                >
                  {expandedIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Typography>
              <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
                <Typography variant="body1" style={{ fontSize: "large" }}>
                  {questionsData.explanation}
                </Typography>
              </Collapse>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Feedback;
