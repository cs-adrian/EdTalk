import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LoadingComponent from "../components/LoadingComponent";
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
      // if no courseId/section provided, redirect or show error
      navigate("/professor-dashboard");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const count = await getStudentCountInSectionForCourse(courseId, section);
        const avgRating = await getAverageRatingForCourseInSection(courseId, section);
        const fbCount = await getFeedbackCountForCourseInSection(courseId, section);
        const fbData = await fetchFeedbacksForCourseInSection(courseId, section); // Implement this to get all feedback docs for course+section

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

  // Compute rating breakdown per question
  // Assuming feedbacks is an array of objects with a 'responses' array like [{question: "", rating: 3}, ...]

  // Example for question 1 ratings count by value:
  // Structure: { questionIndex: { ratingValue: count } }

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  // Aggregate counts per question & rating
  const ratingCounts = {};

  feedbacks.forEach((fb) => {
    fb.responses.forEach((resp, index) => {
      if (!ratingCounts[index]) ratingCounts[index] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratingCounts[index][resp.rating] = (ratingCounts[index][resp.rating] || 0) + 1;
    });
  });

  // Questions text - should match feedback form
  const questions = [
    "Was the pacing of the course appropriate?",
    "Were classes conducted according to the schedule?",
    "Were the learning objectives clearly communicated?",
    "Was the course syllabus clear and well-structured?",
  ];

  return (
        <div className="container">
        <Header />
        <h2 style={{ marginTop: "100px" }}>
            Feedback Statistics for Course: {courseId} | Section: {section}
        </h2>

        <div className="statistics-summary">
        <div className="summary-flex">
            <div className="summary-box">
            <h4>Total Responses</h4>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{feedbackCount}</p>
            <p>out of {studentCount} students</p>
            </div>

            <div className="summary-box">
            <h4>Average Rating</h4>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {averageRating.toFixed(2)}
            </p>
            </div>
        </div>
        </div>


        <div>
            {questions.map((questionText, idx) => {
            const counts = ratingCounts[idx] || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            const totalResponsesForQuestion = Object.values(counts).reduce((a, b) => a + b, 0);

            return (
                <div key={idx} style={{ marginTop: "20px" }}>
                <h4>{questionText}</h4>
                {[5, 4, 3, 2, 1].map((ratingValue) => {
                    const count = counts[ratingValue] || 0;
                    const percent = totalResponsesForQuestion
                    ? ((count / totalResponsesForQuestion) * 100).toFixed(1)
                    : 0;

                    return (
                    <p key={ratingValue}>
                        {ratingLabels[ratingValue - 1]} ({ratingValue}) - {count} students ({percent}%)
                    </p>
                    );
                })}
                </div>
            );
            })}
        </div>
      {/* Additional Comments Section */}
        <div style={{ marginTop: "40px" }}>
        <h3>Additional Comments</h3>
        {feedbacks.filter(fb => fb.comment?.trim()).length === 0 ? (
            <p>No comments submitted.</p>
        ) : (
            feedbacks
            .filter(fb => fb.comment?.trim())
            .map((fb, index) => (
                <p key={index}>
                {index + 1}. {fb.comment}
                </p>
            ))
        )}
        </div>

    </div>
  );
}

export default CourseFeedbackStatistics;
