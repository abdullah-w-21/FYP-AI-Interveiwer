import { CircularProgress, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import MuiAlert from "@mui/material/Alert";
import {
  isEmailAlreadyRegistered,
  signIn,
} from "../../Redux/Actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import { resetAuth, signInError } from "../../Redux/Reducers/AuthReducers";
import mylogo from './mylogo.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let loginError = useSelector((state) => state.auth.error);

  useEffect(() => {
    if (loginError === "Incorrect email or password.") {
      setSnackbarMessage("Incorrect email or password.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setEmail("");
      setPassword("");
      setIsLoading(false);
      //   dispatch(resetAuth());
    } else if (loginError) {
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setEmail("");
      setPassword("");
      setIsLoading(false);
    }
  }, [loginError]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

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
        setIsLoading(false);
        dispatch(signInError(""));
      } else if (!regex.test(email)) {
        setSnackbarMessage("Please enter valid email!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setEmail("");
        setPassword("");
        setIsLoading(false);
      } else if (!registered) {
        setSnackbarMessage("Email does not exist, want to sign up?");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setEmail("");
        setPassword("");
        setIsLoading(false);
      } else {
        dispatch(signIn(email, password, navigate));
        setSnackbarMessage("Logged in successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setSnackbarMessage("Unexpected error occured, please try again!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="form-contents form-body">
      <form onSubmit={handleSubmit} className="row g-3 log-sig">
      <img src={mylogo} alt="" style={{  }} />

        <h3 style={{ textAlign: "center" }}>Sign In</h3>
        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="form-control email"
            id="email"
            aria-describedby="emailHelp"
            required
          />
        </div>
        <div className="password-container mb-3">
          <input
            type={passwordVisible ? "text" : "password"}
            onChange={handlePasswordChange}
            value={password}
            placeholder="Enter your password"
            className="form-control password"
            id="password"
            required
          />
          <span
            className="input-group-text"
            id="togglePassword"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <i className="bi bi-eye-slash">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-slash-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                </svg>
              </i>
            ) : (
              <i className="bi bi-eye">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                </svg>
              </i>
            )}
          </span>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? (
            <CircularProgress sx={{ color: "white" }} size={24} />
          ) : (
            "Login"
          )}
        </button>
        <div
          className="container"
          style={{  backgroundColor: '#121d3d;', marginTop: '5%'  }}
        >
          <p>
            Do not have an account?{" "}
            <Link component={RouterLink} to="/signup">
              Sign Up
            </Link>
          </p>
          <Link component={RouterLink} to="/forgotpassword">
            Forgot password?
          </Link>
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

export default Login;
