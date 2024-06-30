import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateGeneraion } from "../../../Redux/Reducers/QuestionsReducer";
import { useNavigate } from "react-router-dom";

const ChatBox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questionsArray = useSelector((state) => state.questions.quiz);
  const [isLoading, setIsLoading] = useState(false);
  const [userResponses, setUserResponses] = useState([]);

  const handleAnswerChange = (event, index) => {
    const newResponses = [...userResponses];
    newResponses[index] = event.target.value;
    setUserResponses(newResponses);
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
    <div style={{ padding: "5rem" }}>
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
    </div>
  );
};

export default ChatBox;
