import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";

import LoginPage from "./components/StartupPages/Loginpage";
import SignupPage from "./components/StartupPages/SignupPage";
import ForgotPasswordPage from "./components/StartupPages/ForgotPasswordPage";
import OtpVerificationPage from "./components/OtpverificationPage";
import Container from "./components/Container/Container";
import ResetPasswordPage from "./components/StartupPages/ResetPasswordPage"; // Assuming you have this
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading application...</div>; // Or a proper spinner/loader
  }
  return user ? children : <Navigate to="/login" replace />;
};

// PublicRoute component (redirects if logged in, e.g., for login/signup pages)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading application...</div>;
  }
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Startup Pages (Public Routes) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <OtpVerificationPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />{" "}
          {/* Example for reset password form */}
          {/* Main Application (Protected Routes) */}
          <Route
            path="/*" // Catches all routes for the authenticated app
            element={
              <ProtectedRoute>
                <Container />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
