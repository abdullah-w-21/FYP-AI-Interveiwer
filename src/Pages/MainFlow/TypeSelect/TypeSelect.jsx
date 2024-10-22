import { Box, Grid, Button, Typography, Container, Card, CardContent } from '@mui/material';
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetGeneration } from "../../../Redux/Reducers/QuestionsReducer";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import workgif from './selection.jpg';

const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85%',
  height: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '16px',
  overflow: 'hidden',
};

const cardStyle = {
  padding: "1.5rem",
  textAlign: "center",
  borderRadius: "12px",
  cursor: "pointer",
  width: "80%",
  margin: "20px auto",
  transition: "transform 0.3s, box-shadow 0.3s",
  '&:hover': {
    transform: "scale(1.05)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    // background: "linear-gradient(135deg, #3657ff, #000080)",
    background: "linear-gradient(45deg, #153969, #718bab)",

    color: "#fff",
  },
};

const TypeSelect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetGeneration());
  }, []);

  return (
    <div style={{
      background: `url('/api/placeholder/1920/1080') no-repeat center center fixed`,
      backgroundSize: 'cover',
      height: '100vh',
      color: '#f5f5f5',
      position: 'relative',
    }}>
      <Box sx={boxStyle}>
        <Grid container>
          {/* Left Section with GIF */}
          <Grid item xs={12} sm={12} lg={6}>
            <img src={workgif} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Work in progress" />
          </Grid>

          {/* Right Section with Options */}
          <Grid item xs={12} sm={12} lg={6}>
            <Box
              sx={{
                height: '100%',
                padding: '3rem 2rem',
                // background: 'linear-gradient(-45deg, #000080, #3657ff)',
                background: 'linear-gradient(45deg, #153969, #718bab)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Container>
                <Typography variant="h4" fontWeight="600" color="white" gutterBottom>
                  Select Quiz Type
                </Typography>

                {/* MCQ Based Test */}
                <Card
                  variant="outlined"
                  sx={cardStyle}
                  onClick={() => navigate("/startmcqquiz")}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="600">
                      MCQ's Based Test
                    </Typography>
                  </CardContent>
                </Card>

                {/* Open-ended Test */}
                <Card
                  variant="outlined"
                  sx={cardStyle}
                  onClick={() => navigate("/startquiz")}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="600">
                      Open-ended Conceptual Test
                    </Typography>
                  </CardContent>
                </Card>
              </Container>

              {/* Back Button */}
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
                sx={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  // background: 'linear-gradient(-45deg, #000080, #3657ff)',
                  background: "linear-gradient(45deg, #153969, #718bab)",

                  padding: '10px 20px',
                  transition: "transform 0.3s, box-shadow 0.3s",
                  '&:hover': {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    background: "#153969",
                  }
                }}
              >
                <ArrowBackIcon /> Back
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default TypeSelect;
