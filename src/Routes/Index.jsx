import React from 'react'
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import UnProtectedRoutes from "./UnprotectedRoutes";
import Signup from "../Pages/AuthFlow/Signup";
import Login from "../Pages/AuthFlow/Login";
import Forgotpassword from "../Pages/AuthFlow/Forgotpassword";
import Layout from "../Layout/Layout";
import Dashboard from "../Pages/MainFlow/Dashboard/Dashboard";

const RoutesIndex = () => {
  return (
    <Layout>
    <Routes>
      {
        <>
          <Route path="/" element={<UnProtectedRoutes Component={Login} />} />
          <Route path="/signup" element={<UnProtectedRoutes Component={Signup} />} />
          <Route path="/forgotpassword" element={<UnProtectedRoutes Component={Forgotpassword} />} />
          <Route path="/dashboard" element={<ProtectedRoutes Component={Dashboard} />} />
          {/* <Route path="/allaccounts" element={<ProtectedRoutes Component={AllAccounts} />} />
          <Route path="/allcategories" element={<ProtectedRoutes Component={AllCategories} />} />
          <Route path="/performtransaction" element={<ProtectedRoutes Component={PerformTransactions} />} />
          <Route path="/alltransactions" element={<ProtectedRoutes Component={AllTransactions} />} /> */}
        </>
      }
    </Routes>
    </Layout>
  )
}

export default RoutesIndex
