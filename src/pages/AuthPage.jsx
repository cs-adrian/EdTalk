import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth_page.css";

function AuthPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role.");
      return;
    }

    navigate("/dashboard");
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
                
              />

              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
