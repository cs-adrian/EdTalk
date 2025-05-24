import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/dashboard_style.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Dummy professor data - ideally this would come from a backend/API
  const professors = [
    {
      initials: "DP",
      name: "Dr. Patricia Johnson",
      subject: "Computer Science",
      feedbackStatus: "submitted",
      rating: 5,
      feedbackText:
        "Dr. Johnson explains complex concepts clearly and is always available during office hours. Her assignments are challenging but fair.",
    },
    {
      initials: "RB",
      name: "Dr. Robert Brown",
      subject: "Mathematics",
      feedbackStatus: "pending",
    },
  ];

  const handleAddFeedback = () => {
    navigate("/feedback-form");
  };

  const handleEditFeedback = () => {
    navigate("/feedback-form?edit=true");
  };

  const handleDeleteFeedback = () => {
    const confirmed = window.confirm("Are you sure you want to delete this feedback?");
    if (confirmed) {
      alert("Feedback deleted (functionality not implemented yet).");
    }
  };

  const filteredProfessors = professors.filter((prof) =>
    prof.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <Header />

      <div className="dashboard-header">
        <div className="my-feedback">My Feedback</div>
        <div className="manage-your-feedback-to-professors">
          Manage your feedback to professors
        </div>
      </div>

      <div className="action-bar">
        <div className="search-bar">
          <img
            className="search-icon"
            src="/assets/search-icon0.svg"
            alt="Search"
          />
          <input
            type="text"
            className="search-professors"
            placeholder="Search educators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="student-dashboard">
        <div className="professor-list">
          {filteredProfessors.map((prof, index) => (
            <div className="professor-card" key={index}>
              <div className="professor-info">
                <div className="prof-details">
                  <div className="educator_avatar">
                    <div className="educator_initials">{prof.initials}</div>
                  </div>
                  <div className="name-info">
                    <div className="educator_name">{prof.name}</div>
                    <div className="educator_subject">{prof.subject}</div>
                  </div>
                </div>
                <div className={`status${prof.feedbackStatus === "pending" ? "2" : ""}`}>
                  {prof.feedbackStatus === "submitted" ? (
                    <div className="feedback-submitted">Feedback Submitted</div>
                  ) : (
                    <div className="pending-feedback">Pending Feedback</div>
                  )}
                </div>
              </div>

              {prof.feedbackStatus === "submitted" && (
                <div className="feedback-summary">
                  <div className="rating">
                    <div className="your-rating">Your rating:</div>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <img
                          key={i}
                          className={`star${i + 1}`}
                          src={`/assets/star${i}.svg`}
                          alt={`Star ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="feedback_given">{prof.feedbackText}</div>
                </div>
              )}

              <div className="action-buttons">
                {prof.feedbackStatus === "submitted" ? (
                  <>
                    <button className="edit-button" onClick={handleEditFeedback}>
                      <img
                        className="edit-icon"
                        src="/assets/edit-icon0.svg"
                        alt="Edit Icon"
                      />
                      <span className="edit">Edit</span>
                    </button>
                    <button className="delete-button" onClick={handleDeleteFeedback}>
                      <img
                        className="delete-icon"
                        src="/assets/delete-icon0.svg"
                        alt="Delete Icon"
                      />
                      <span className="delete">Delete</span>
                    </button>
                  </>
                ) : (
                  <div className="add-button" onClick={handleAddFeedback}>
                    <img
                      className="add-icon"
                      src="/assets/add-icon0.svg"
                      alt="Add"
                    />
                    <div className="add-feedback">Add Feedback</div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredProfessors.length === 0 && (
            <div className="no-results">No professors found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
