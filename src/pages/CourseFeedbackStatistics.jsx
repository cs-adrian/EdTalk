import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LoadingComponent from "../components/LoadingComponent";
import "../styles/feedback_statistics.css";
import {
  getStudentCountInSectionForCourse,
  getAverageRatingForCourseInSection,
  getFeedbackCountForCourseInSection,
  fetchFeedbacksForCourseInSection,
} from "../services/courseDataService";

function CourseFeedbackStatistics() {
  const location = useLocation();
  const navigate = useNavigate();

  const { courseId, section } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (!courseId || !section) {
      navigate("/professor-dashboard");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const count = await getStudentCountInSectionForCourse(courseId, section);
        const avgRating = await getAverageRatingForCourseInSection(courseId, section);
        const fbCount = await getFeedbackCountForCourseInSection(courseId, section);
        const fbData = await fetchFeedbacksForCourseInSection(courseId, section);

        setStudentCount(count);
        setAverageRating(avgRating);
        setFeedbackCount(fbCount);
        setFeedbacks(fbData);
      } catch (err) {
        console.error("Error fetching feedback statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, section, navigate]);

  if (loading) return <LoadingComponent />;

  const ratingLabels = ["Very Poor", "Poor", "Average", "Good", "Excellent"];

  const ratingCounts = {};

  feedbacks.forEach((fb) => {
    fb.responses.forEach((resp, index) => {
      if (!ratingCounts[index]) ratingCounts[index] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratingCounts[index][resp.rating] = (ratingCounts[index][resp.rating] || 0) + 1;
    });
  });

  const questions = [
    "Was the pacing of the course appropriate?",
    "Were classes conducted according to the schedule?",
    "Were the learning objectives clearly communicated?",
    "Was the course syllabus clear and well-structured?",
  ];

  const renderStars = (rating) => {
    return (
      <div className="professor-rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`professor-star ${
              star <= Math.floor(rating) ? 'professor-star-filled' : 'professor-star-empty'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="professor-page-container">
      <Header />
      
      <div className="professor-sticky-header">
        <div className="professor-header-content">
          <div className="professor-header-flex">
            <button 
              onClick={() => navigate("/professor-dashboard")}
              className="professor-back-button"
            >
              ← Back
            </button>
            
            <div className="professor-title-container">
              <div className="professor-title-row">
                <h1 className="professor-course-title">
                  {courseId} - {section}
                </h1>
                <span className="professor-response-badge">
                  {feedbackCount} Responses
                </span>
              </div>
              <p className="professor-course-subtitle">
                Information Assurance and Security 1
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="professor-main-content">
        <div className="professor-section">
          <h2 className="professor-section-title">
            Feedback Overview
          </h2>
          
          <div className="professor-overview-flex">
            <div className="professor-overview-box">
              <h3 className="professor-box-label">
                Total Responses
              </h3>
              <div className="professor-box-value">
                {feedbackCount}
              </div>
              <div className="professor-box-subtext">
                out of {studentCount} students
              </div>
            </div>

            <div className="professor-overview-box">
              <h3 className="professor-box-label">
                Average Rating
              </h3>
              <div className="professor-box-value" style={{ marginBottom: '5px' }}>
                {averageRating.toFixed(1)}
              </div>
              {renderStars(averageRating)}
            </div>
          </div>
        </div>

        <div className="professor-section">
          <h2 className="professor-analysis-title">
            Feedback Analysis
          </h2>

          {questions.map((questionText, idx) => {
            const counts = ratingCounts[idx] || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            const totalResponsesForQuestion = Object.values(counts).reduce((a, b) => a + b, 0);

            return (
              <div key={idx} className="professor-question-card">
                <h3 className="professor-question-title">
                  {idx + 1}. {questionText}
                </h3>
                
                <div className="professor-rating-breakdown">
                  {[5, 4, 3, 2, 1].map((ratingValue) => {
                    const count = counts[ratingValue] || 0;
                    const percent = totalResponsesForQuestion
                      ? ((count / totalResponsesForQuestion) * 100).toFixed(1)
                      : 0;

                    return (
                      <div key={ratingValue} className="professor-rating-row">
                        <div className="professor-rating-label">
                          <span className="professor-rating-text">
                            {ratingLabels[ratingValue - 1]} ({ratingValue})
                          </span>
                        </div>
                        <div className="professor-rating-count">
                          {count} students ({percent}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h2 className="professor-comments-title">
            Additional Comments
          </h2>
          
          {feedbacks.filter(fb => fb.comment?.trim()).length === 0 ? (
            <div className="professor-no-comments">
              <p className="professor-no-comments-text">
                No comments submitted.
              </p>
            </div>
          ) : (
            <div className="professor-comments-list">
              {feedbacks
                .filter(fb => fb.comment?.trim())
                .map((fb, index) => (
                  <div key={index} className="professor-comment-card">
                    <div className="professor-comment-content">
                      <div className="professor-comment-number">
                        {index + 1}
                      </div>
                      <p className="professor-comment-text">
                        {fb.comment}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseFeedbackStatistics;