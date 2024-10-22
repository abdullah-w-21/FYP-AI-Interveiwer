import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import UnProtectedRoutes from "./UnprotectedRoutes";
import Signup from "../Pages/AuthFlow/Signup";
import Login from "../Pages/AuthFlow/Login";
import Forgotpassword from "../Pages/AuthFlow/Forgotpassword";
import Layout from "../Layout/Layout";
import Dashboard from "../Pages/MainFlow/Dashboard/Dashboard";
import StartQuiz from "../Pages/MainFlow/StartQuiz/StartQuiz";
import ChatBox from "../Pages/MainFlow/ChatBox/ChatBox";
import Feedback from "../Pages/MainFlow/Feedback/Feedback";
import History from "../Pages/MainFlow/History/History";
import StartmcqQuiz from "../Pages/MainFlow/StartMCQQuiz/StartmcqQuiz";
import TypeSelect from "../Pages/MainFlow/TypeSelect/TypeSelect";
import MCQsBox from "../Pages/MainFlow/ChatBox/MCQsBox";
import AdaptiveMCQsBox from "../Pages/MainFlow/ChatBox/AdaptiveMCQsBox";
import LandingPage from "../Pages/AuthFlow/Landingpage";

const RoutesIndex = () => {
  return (
    <Layout>
      <Routes>
        {
          <>
          <Route path="/" element={<UnProtectedRoutes Component={LandingPage} />} />
            <Route path="/login" element={<UnProtectedRoutes Component={Login} />} />
            <Route
              path="/signup"
              element={<UnProtectedRoutes Component={Signup} />}
            />
            <Route
              path="/forgotpassword"
              element={<UnProtectedRoutes Component={Forgotpassword} />}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoutes Component={Dashboard} />}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoutes Component={Dashboard} />}
            />
            <Route
              path="/typeselect"
              element={<ProtectedRoutes Component={TypeSelect} />}
            />
            <Route
              path="/startquiz"
              element={<ProtectedRoutes Component={StartQuiz} />}
            />
            <Route
              path="/startmcqquiz"
              element={<ProtectedRoutes Component={StartmcqQuiz} />}
            />
            <Route
              path="/chatbox"
              element={<ProtectedRoutes Component={ChatBox} />}
            />
            <Route
              path="/mcqsbox"
              element={<ProtectedRoutes Component={MCQsBox} />}
            />
            <Route
              path="/adaptivemcqsbox"
              element={<ProtectedRoutes Component={AdaptiveMCQsBox} />}
            />
            <Route
              path="/feedback"
              element={<ProtectedRoutes Component={Feedback} />}
            />
            <Route
              path="/history"
              element={<ProtectedRoutes Component={History} />}
            />
          </>
        }
      </Routes>
    </Layout>
  );
};

export default RoutesIndex;
