import { CircularProgress, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import MuiAlert from "@mui/material/Alert";
import { isEmailAlreadyRegistered, signUp } from '../../Redux/Actions/AuthActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import { signInError } from '../../Redux/Reducers/AuthReducers';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);
  const [password, setPassword] = useState("");
  const isLoading = useSelector((state) => state.auth.isLoading);


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleuserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const registered = await isEmailAlreadyRegistered(email)

      if (password.length < 6) {
        setSnackbarMessage("Password should atleast be of 6 characters!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setPassword("");
      } else if (!regex.test(email)) {
        setSnackbarMessage("Please enter valid email!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setEmail("");
        setPassword("");
      } else if (registered) {
        setSnackbarMessage("Email already exists!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setEmail("");
        setPassword("");
      } else {
        dispatch(signUp(userName, email, password, navigate))
        setSnackbarMessage("Signed up successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
      setDisable(false);
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="form-contents form-body">
      <form className="row g-3 log-sig" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', border: '1px solid', fontWeight: 'bold', background: '#1976d2', color: "white", borderRadius: 'inherit', padding: 'inherit' }}>iPrepare</h2>
        <h3 style={{ textAlign: 'center' }}>Sign Up</h3>
        <div className="mb-3">
          <input type="username" onChange={handleuserNameChange} value={userName} placeholder="Enter your username" className="form-control username" id="username" required />
        </div>
        <div className="mb-3">
          <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" className="form-control email" id="email" aria-describedby="emailHelp" required />
        </div>
        <div className="password-container mb-3">
          <input type={passwordVisible ? "text" : "password"} onChange={handlePasswordChange} value={password} placeholder="Enter your password" className="form-control password" id="password" required />
          <span className="input-group-text" id="togglePassword" onClick={togglePasswordVisibility}>
            {passwordVisible ? (
              <i className="bi bi-eye-slash">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                </svg>
              </i>
            ) : (
              <i className="bi bi-eye">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                </svg>
              </i>
            )}
          </span>
        </div>

        <button type="submit" disabled={disable || isLoading} className="btn btn-primary">{isLoading || disable ? (
          <CircularProgress sx={{ color: "white" }} size={24} />
        ) : (
          "Sign Up"
        )}</button>
        <div className="container" style={{ backgroundColor: '#f1f1f1', marginTop: '5%' }}>
          <p>Already have an account? <Link component={RouterLink} to="/">
            Login
          </Link></p>
        </div>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Signup;
