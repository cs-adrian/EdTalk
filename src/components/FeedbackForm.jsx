import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { fetchStudentProfile, fetchProfessorByProfessorId } from "../services/studentDataService";
import { fetchFeedbackByStudentAndCourse, submitFeedback } from "../services/feedbackDataService";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "../styles/feedback_form.css";

function FeedbackForm() {
  const location = useLocation();
  const { courseId, isEdit } = location.state || {};

  const [studentId, setStudentId] = useState(null);
  const [course, setCourse] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState("");
  const [highlightedQuestions, setHighlightedQuestions] = useState([]);
  const [questions] = useState([
    "Was the pacing of the course appropriate?",
    "Were classes conducted according to the schedule?",
    "Were the learning objectives clearly communicated?",
    "Was the course syllabus clear and well-structured?",
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!courseId || !user) return;

      try {
        const student = await fetchStudentProfile(user.uid);
        setStudentId(student.studentId);

        if (student) {console.log(`STUDENT DATA IS VALID. ID: ${student.studentId}`)}
        

        const courseSnap = await getDoc(doc(db, "courses", courseId));
        if (!courseSnap.exists()) return console.error("Course not found");

        const courseData = courseSnap.data();
        setCourse(courseData);

        const professorData = await fetchProfessorByProfessorId(courseData.professorId);
        setProfessor(professorData);

        if (professorData) {console.log("PROFESSOR DATA IS VALID")}

        const feedbackData = await fetchFeedbackByStudentAndCourse(student.studentId, courseId);
        if (feedbackData) {
          console.log("FEEDBACK DATA IS VALID")
          setComments(feedbackData.comment || "");
          const mappedAnswers = {};
          feedbackData.responses?.forEach((resp, index) => {
            mappedAnswers[index + 1] = parseInt(resp.rating);
          });
          setAnswers(mappedAnswers);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, [courseId]);

  const handleRatingClick = (questionNum, value) => {
    setAnswers((prev) => ({ ...prev, [questionNum]: value }));
    setHighlightedQuestions((prev) => prev.filter((q) => q !== questionNum));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const unanswered = questions
      .map((_, idx) => idx + 1)
      .filter((qNum) => !answers[qNum]);

    if (unanswered.length > 0) {
      setHighlightedQuestions(unanswered);
      alert("Please answer all the rating questions.");
      return;
    }

    if (!comments.trim()) {
      alert("Please enter a comment before submitting.");
      return;
    }

    try {
      const responses = questions.map((question, index) => ({
        question,
        rating: answers[index + 1],
      }));

      await submitFeedback({
        studentId, 
        courseId,
        professorId: course.professorId,
        comments,
        responses,
      });

      alert("Feedback submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback.");
    }
  };

  const renderRatingButtons = (questionNum) =>
    [1, 2, 3, 4, 5].map((val) => (
      <button
        key={val}
        className={`rate ${answers[questionNum] === val ? "selected" : ""}`}
        onClick={() => handleRatingClick(questionNum, val)}
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
          <span className="educator-name">
            {professor ? professor.name : "Loading..."}
          </span>
          <span className="educator-details">
            {professor && professor.department} | {course && course.courseName}
          </span>
        </div>
      </div>

      <div className="feedback">
        <div className="feedback-form">
          <div className="form-header">
            <img className="icon" src="/assets/book-icon.svg" alt="Book Icon" />
            <div className="title">Course Organization and Planning</div>
          </div>

          {questions.map((questionText, index) => {
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
