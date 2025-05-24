import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import FeedbackForm from "./components/FeedbackForm";
import StudentProfile from "./pages/StudentProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/feedback-form" element={<FeedbackForm />} />
      <Route path="/profile" element={<StudentProfile />} />
    </Routes>
  );
}

export default App;
