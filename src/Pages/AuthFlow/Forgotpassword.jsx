import { CircularProgress, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from 'react-redux';
import { isEmailAlreadyRegistered, passwordReset } from '../../Redux/Actions/AuthActions';

const Forgotpassword = () => {
    const dispatch = useDispatch();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [email, setEmail] = useState("");
    const isLoading = useSelector((state) => state.auth.isLoading);
    const [disable, setDisable] = useState(false);

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
        setDisable(true);
        try {
          const registered = await isEmailAlreadyRegistered(email)
    
          if (!regex.test(email)) {
            setSnackbarMessage("Please enter valid email!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setEmail("");
          }else if (!registered) {
            setSnackbarMessage("Email does not exist, want to sign up?");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setEmail("");
          } else {
            dispatch(passwordReset(email));
            setSnackbarMessage("Password reset email sent successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setEmail("");
          } 
          setDisable(false);
        } catch (error) {
          console.log(error)
        }
    
      }

    return (
        <div className="form-contents form-body">
            <form className="row g-3 log-sig" onSubmit={handleSubmit}>
                <h2 style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid', background: '#1976d2', color: "white", borderRadius: 'inherit', padding: 'inherit' }}>iPrepare</h2>
                <h3 style={{ textAlign: 'center' }}>Forgot Password</h3>
                <div className="mb-3">
                <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" className="form-control email" id="email" aria-describedby="emailHelp" required />
                </div>
                <button type="submit" disabled={disable || isLoading} className="btn btn-primary">{isLoading || disable ? (
                    <CircularProgress sx={{ color: "white" }} size={24} />
                ) : (
                    "Reset Password"
                )}</button>
                <div className="container" style={{ backgroundColor: '#f1f1f1', marginTop: '5%' }}>
                    <a href="/">Go back</a>
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
}

export default Forgotpassword;
