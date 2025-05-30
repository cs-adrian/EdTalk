import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createInitialFeedbackDocuments } from "../services/feedbackDataService";
import { auth } from "../firebase";
import "../styles/auth_page.css";

function AuthPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (role === "student") {
        
        navigate("/dashboard");
      } else {
        alert("Only students can log in right now");

        await auth.signOut(); //Just in case an educator accidentally logs in
      }
    } catch (err) {
      console.error(err);
      setError("Invalid Email or Password"); 
    }

  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <div className="auth-header">
        <div className="auth-logo-bar">
          <div className="auth-logo">
            <img src="/assets/logo.svg" alt="EdTalk Logo" />
          </div>
        </div>
      </div>

      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left-panel">
          <div className="auth-text-section">
            <h1>
              Collect and manage<br />feedback that <span>matters.</span>
            </h1>
            <p>
              Streamline the feedback process, prioritize student insights, and
              make informed decisions to enhance teaching and learning
              experiences.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right-panel">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Login</h2>
            </div>

            <form className="auth-form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src={showPassword ? "/assets/see_password.svg" : "/assets/hide_password.svg"}
                  alt="Toggle Password"
                  className="auth-toggle-password"
                  onClick={togglePassword}
                />
              </div>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>Select your role</option>
                <option value="student">Student</option>
                <option value="educator">Educator</option>
              </select>

              <button type="submit" className="auth-primary-btn">
                Login
              </button>

              {error && <p className="auth-error">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
