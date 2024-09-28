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
import { useLocation } from "react-router-dom";

const Feedback = () => {
  const location = useLocation();
  const { quizData } = location.state || { quizData: { questions: [] } };
  console.log(quizData);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const handleToggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };

  return (
    <div style={{ paddingTop: "5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={"bold"} variant="h4" gutterBottom>
          Feedbacks
        </Typography>
      </div>
      {quizData.questions.map((questionsData, index) => (
        <Card
          key={index}
          variant="outlined"
          style={{ marginBottom: "3rem", boxShadow: "5px 5px 5px 5px grey" }}
        >
          <CardContent>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body1" style={{ fontSize: "large" }}>
                <span style={{ fontWeight: "bold" }}>
                  Question {index + 1}:
                </span>{" "}
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
                  color:
                    quizData.quizType === "simple mcqs" ||
                    quizData.quizType === "adaptive mcqs"
                      ? parseInt(questionsData.score) === 1
                        ? "green"
                        : "red"
                      : parseInt(questionsData.score) >= 75
                      ? "green"
                      : parseInt(questionsData.score) >= 50
                      ? "orange"
                      : "red",

                  fontSize: "large",
                }}
              >
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Score:
                </span>{" "}
                {Math.round(questionsData.score)}
              </Typography>
              <br />
              <Typography variant="body1" style={{ fontSize: "large" }}>
                <span style={{ fontWeight: "bold" }}>Feedback:</span>{" "}
                {questionsData.feedback}
              </Typography>
              <br />
              {/* Toggleable explanation */}
              <Typography
                variant="body1"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "large",
                }}
              >
                <span style={{ fontWeight: "bold" }}>Explanation:</span>{" "}
                <IconButton
                  aria-label={expandedIndex === index ? "collapse" : "expand"}
                  onClick={() => handleToggleExpand(index)}
                  size="small"
                >
                  {expandedIndex === index ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Typography>
              <Collapse
                in={expandedIndex === index}
                timeout="auto"
                unmountOnExit
              >
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
