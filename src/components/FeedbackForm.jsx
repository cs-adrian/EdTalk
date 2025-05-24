import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/feedback_form.css";

function FeedbackForm() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState("");
  const [highlightedQuestions, setHighlightedQuestions] = useState([]);

  const handleRatingClick = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    setHighlightedQuestions((prev) => prev.filter((q) => q !== question));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const unanswered = [1, 2, 3, 4].filter((q) => !answers[q]);
    if (unanswered.length > 0) {
      setHighlightedQuestions(unanswered);
      alert("Please answer all the rating questions.");
      return;
    }

    if (!comments.trim()) {
      alert("Please enter a comment before submitting.");
      return;
    }

    // You can send feedback data here...
    navigate("/dashboard");
  };

  const renderRatingButtons = (question) =>
    [1, 2, 3, 4, 5].map((val) => (
      <button
        key={val}
        className={`rate ${answers[question] === val ? "selected" : ""}`}
        onClick={() => handleRatingClick(question, val)}
      >
        {val}
        <br />
        <span>
          {["Excellent", "Very Good", "Good", "Fair", "Poor"][val - 1]}
        </span>
      </button>
    ));

  return (
    <div>
      <Header />
      <div className="navigation-header">
        <div className="back-button" onClick={() => navigate(-1)}>
          <img className="back-icon" src="/assets/arrow_back.svg" alt="Back" />
          <span>Back</span>
        </div>
        <div className="educator-info">
          <span className="educator-name">Dr. Robert Browns</span>
          <span className="educator-details">
            College of Physical Science | Mathematics
          </span>
        </div>
      </div>

      <div className="feedback">
        <div className="feedback-form">
          <div className="form-header">
            <img className="icon" src="/assets/book-icon.svg" alt="Book Icon" />
            <div className="title">Course Organization and Planning</div>
          </div>

          {[
            "Was the pacing of the course appropriate?",
            "Were classes conducted according to the schedule?",
            "Were the learning objectives clearly communicated?",
            "Was the course syllabus clear and well-structured?",
          ].map((questionText, index) => {
            const questionNum = index + 1;
            return (
              <div
                key={questionNum}
                className={`question ${
                  highlightedQuestions.includes(questionNum)
                    ? "highlight-missing"
                    : ""
                }`}
              >
                <p>{questionText}</p>
                <div className="ratings" data-question={questionNum}>
                  {renderRatingButtons(questionNum)}
                </div>
              </div>
            );
          })}

          <div className="question">
            <p>Additional Comments</p>
            <textarea
              id="comments"
              className="textarea"
              placeholder="Type your feedback here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <div className="submit-button">
            <div className="button" id="feedback-btn" onClick={handleSubmit}>
              <div className="submit-feedback">Submit Feedback</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackForm;
