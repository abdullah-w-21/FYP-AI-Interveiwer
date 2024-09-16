import React from "react";
import { useSelector } from "react-redux";
import { Link, Link as RouterLink } from "react-router-dom";

const Dashboard = () => {
  const username = useSelector((state) => state.auth.user.username);

  return (
    <div className="dashboard-container">
      <h1>
        {" "}
        Hello {username}! Welcome to your dashboard. We are under construction
        at the moment, yet you can use our questions generation part!{" "}
        <Link
          component={RouterLink}
          to="/typeselect"
          style={{ textDecoration: "none" }}
        >
          Start Quiz
        </Link>{" "}
        :)
      </h1>
    </div>
  );
};

export default Dashboard;
