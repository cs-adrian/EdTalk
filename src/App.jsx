import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import FeedbackForm from "./components/FeedbackForm";
import StudentProfile from "./pages/StudentProfile";
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <StudentDashboard /> 
          </PrivateRoute>  
        } 
      />
      <Route 
        path="/feedback-form" 
        element={
          <PrivateRoute>
            <FeedbackForm />
          </PrivateRoute>
        }
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <StudentProfile />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;
