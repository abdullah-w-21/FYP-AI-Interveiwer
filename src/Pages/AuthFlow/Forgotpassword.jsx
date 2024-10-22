import { CircularProgress, Snackbar } from "@mui/material";
import React, { useState } from "react";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  isEmailAlreadyRegistered,
  passwordReset,
} from "../../Redux/Actions/AuthActions";
import { Link, Link as RouterLink } from "react-router-dom";
import forgotpass from './images/forgotpass.png'


const Forgotpassword = () => {
  const dispatch = useDispatch();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const registered = await isEmailAlreadyRegistered(email);

      if (!regex.test(email)) {
        setSnackbarMessage("Please enter valid email!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setEmail("");
        setIsLoading(false);
      } else if (!registered) {
        setSnackbarMessage("Email does not exist, want to sign up?");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setEmail("");
        setIsLoading(false);
      } else {
        dispatch(passwordReset(email));
        setSnackbarMessage("Password reset email sent successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setEmail("");
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
      <form className="row g-3 log-sig" onSubmit={handleSubmit}>
      <img src={forgotpass} alt="" />

        <h3 style={{ textAlign: "center" }}>Forgot Password</h3>
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
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
          style={{ backgroundColor: "#153969" }}

          
        >
          {isLoading ? (
            <CircularProgress sx={{ color: "white" }} size={24} />
          ) : (
            "Reset Password"
          )}
        </button>
        <div
          className="container"
          style={{ backgroundColor: "#f1f1f1", marginTop: "5%" }}
        >
          <Link component={RouterLink} to="/login">
            Go back!
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

export default Forgotpassword;
