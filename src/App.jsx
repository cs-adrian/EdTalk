import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import FeedbackForm from "./components/FeedbackForm";
import StudentProfile from "./pages/StudentProfile";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ProfessorProfile from "./pages/ProfessorProfile";
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      {/* Student Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute requiredRole="student">
            <StudentDashboard /> 
          </PrivateRoute>  
        } 
      />
      <Route 
        path="/feedback-form" 
        element={
          <PrivateRoute requiredRole="student">
            <FeedbackForm />
          </PrivateRoute>
        }
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute requiredRole="student">
            <StudentProfile />
          </PrivateRoute>
        } 
      />

      {/* Professor Routes */}
      <Route 
        path="/professor-dashboard" 
        element={
          <PrivateRoute requiredRole="professor">
            <ProfessorDashboard /> 
          </PrivateRoute>  
        } 
      />
      <Route 
        path="/professor-profile" 
        element={
          <PrivateRoute requiredRole="professor">
            <ProfessorProfile />
          </PrivateRoute>  
        } 
      />
    </Routes>

    
  );
}

export default App;
