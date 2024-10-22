import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  ArrowBack, 
  Email, 
  Lock 
} from '@mui/icons-material';
import { isEmailAlreadyRegistered, signIn } from "../../Redux/Actions/AuthActions";
import { signInError } from "../../Redux/Reducers/AuthReducers";
import loginImg from './images/login3.png';
import logo from './images/logo2.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  let loginError = useSelector((state) => state.auth.error);

  useEffect(() => {
    if (loginError === "Incorrect email or password.") {
      setSnackbarMessage("Incorrect email or password.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setEmail("");
      setPassword("");
      setIsLoading(false);
    } else if (loginError) {
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setEmail("");
      setPassword("");
      setIsLoading(false);
    }
  }, [loginError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const registered = await isEmailAlreadyRegistered(email);

      if (loginError == "Incorrect email or password.") {
        setSnackbarMessage(loginError);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setEmail("");
        setPassword("");
        dispatch(signInError(""));
      } else if (!regex.test(email)) {
        setSnackbarMessage("Please enter valid email!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setEmail("");
        setPassword("");
      } else if (!registered) {
        setSnackbarMessage("Email does not exist, want to sign up?");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setEmail("");
        setPassword("");
      } else {
        dispatch(signIn(email, password, navigate));
        setSnackbarMessage("Logged in successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log(error);
      setSnackbarMessage("Unexpected error occurred, please try again!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        position: 'relative'
      }}
    >
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'text.secondary'
        }}
      >
        <ArrowBack />
      </IconButton>
      
      <Card
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: '1000px',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Form Section */}
          <CardContent 
            sx={{ 
              flex: '1 1 50%', 
              p: { xs: 3, md: 6 },
              background: "linear-gradient(45deg, #153969, #718bab)",
              color: 'white'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <img 
                src={logo} 
                alt="Logo" 
                style={{
                  width: '200px',
                  marginBottom: '20px'
                }}
              />
              <Typography variant="h4" component="h2" sx={{ color: 'white', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Sign in to continue
              </Typography>
            </Box>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'white' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Remember me
                    </Typography>
                  }
                />
                <Button
                  onClick={() => navigate('/forgotpassword')}
                  sx={{ 
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Forgot password?
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  bgcolor: '#153969',
                  width: '50%',
                  mx: 'auto',
                  borderRadius: '20px',
                  '&:hover': {
                    bgcolor: '#0f2d4f'
                  }
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Signing in...</span>
                  </Box>
                ) : (
                  'Sign In'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Don't have an account?{' '}
                  <Button
                    onClick={() => navigate('/signup')}
                    sx={{ 
                      color: 'white',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Sign up
                  </Button>
                </Typography>
              </Box>
            </form>
          </CardContent>

          {/* Image Section */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              flex: '1 1 50%',
              backgroundImage: `url(${loginImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </Box>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;