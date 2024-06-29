import React, { useState } from 'react';
import { Card, CardContent, TextField, Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';

const ChatBox = () => {
  // State to store questions and answers
  const questionsArray = useSelector(state => state.questions.user);

  // Function to handle input change for answers
  const handleAnswerChange = (event, index) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = event.target.value;
    setQuestions(newQuestions);
  };
  
  const handleSubmitAnswers = () => {
    // Replace with actual logic to handle submitted answers
    console.log('Submitted Answers:', questions);
  };

  return (
    <div style={{ padding: '5rem' }}>
      {questionsArray.map((questionsData, index) => (
        <Card key={index} variant="outlined" style={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography variant="body1">Question: {questionsData.question}</Typography>
            <TextField
              label="Your Answer"
              variant="outlined"
              // value={questionsData.answer}
              fullWidth
              margin="normal"
              required
            />
          </CardContent>
        </Card>
      ))}
      {questionsArray.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitAnswers}
        >
          Submit Answers
        </Button>
      )}
    </div>
  );
};

export default ChatBox;
