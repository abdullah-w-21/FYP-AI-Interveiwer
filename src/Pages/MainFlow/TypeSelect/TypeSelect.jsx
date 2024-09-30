import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import StartQuiz from "../StartQuiz/StartQuiz"; // Assuming StartQuiz is located here
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetGeneration } from "../../../Redux/Reducers/QuestionsReducer";

const TypeSelect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetGeneration());
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "20px",
          paddingTop: "5rem",
        }}
      >
        <Card
          variant="outlined"
          style={{
            padding: "1rem",
            textAlign: "center",
            boxShadow: "5px 5px 5px 5px grey",
            cursor: "pointer",
          }}
          onClick={() => navigate("/startmcqquiz")}
        >
          <CardContent>
            <Typography variant="h6">MCQ's Based Test</Typography>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          style={{
            padding: "1rem",
            textAlign: "center",
            boxShadow: "5px 5px 5px 5px grey",
            cursor: "pointer",
          }}
          onClick={() => navigate("/startquiz")}
        >
          <CardContent>
            <Typography variant="h6">Open-ended Conceptual Test</Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TypeSelect;
