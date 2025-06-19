import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; 
import {
  fetchStudentProfile,
  fetchEnrolledCoursesWithFeedback,
} from "../services/studentDataService";
import { createInitialFeedbackDocuments, clearFeedback } from "../services/feedbackDataService";
import Header from "../components/Header";
import LoadingComponent from "../components/LoadingComponent";
import "../styles/dashboard_style.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [coursesData, setCoursesData] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        await createInitialFeedbackDocuments(user.uid);
        const student = await fetchStudentProfile(user.uid);
        setStudentId(student.studentId);

        const courses = await fetchEnrolledCoursesWithFeedback(student);

        setCoursesData(courses);
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  if (loading || !coursesData) {
    return <LoadingComponent />;
  }

  const filteredCourses = coursesData.filter(
    (c) =>
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.professorName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFeedback = (courseId) => {
    navigate("/feedback-form", { state: { courseId } });
  };

  const handleEditFeedback = (courseId) => {
    navigate("/feedback-form", { state: { courseId, isEdit: true } });
  };

  const handleDeleteFeedback = async (courseId) => {
    const confirmed = window.confirm("Are you sure you want to delete this feedback?");
    if (confirmed) {
      try {
        await clearFeedback(studentId, courseId);

        // Update local UI to reflect the cleared feedback
        setCoursesData(prev =>
          prev.map(c =>
            c.courseId === courseId ? {
              ...c,
              feedback: {
                ...c.feedback,
                comment: "",
                responses: [],
                status: "pending",
                rating: "0"
              }
            } : c
          )
        );
      } catch (err) {
        alert("Failed to clear feedback.");
        console.error(err);
      }
    }
  };

  return (
    <div className="student-container">
      <Header />
      <div className="student-dashboard-header">
        <div className="student-my-feedback">My Feedback</div>
        <div className="student-manage-your-feedback-to-professors">
          Manage your feedback to professors
        </div>
      </div>

      <div className="student-action-bar">
        <div className="student-search-bar">
          <img className="student-search-icon" src="/assets/search-icon0.svg" alt="Search" />
          <input
            type="text"
            className="student-search-professors"
            placeholder="Search educators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="student-dashboard">
        <div className="student-professor-list">
          {filteredCourses.map((course) => {
            const feedback = course.feedback;
            const status = feedback.status === "submitted" ? "submitted" : "pending";
            const preview = feedback?.comment?.length > 100
              ? feedback.comment.slice(0, 100) + "..."
              : feedback?.comment || "";

            return (
              <div className="student-professor-card" key={course.courseId}>
                <div className="student-professor-info">
                  <div className="student-prof-details">
                    <div className="student-educator_avatar">
                      <div className="student-educator_initials">
                        {course.professorInitials || course.professorName[0]}
                      </div>
                    </div>
                    <div className="student-name-info">
                      <div className="student-educator_name">{course.professorName}</div>
                      <div className="student-educator_subject">{course.courseName}</div>
                    </div>
                  </div>
                  <div className={`student-status${status === "pending" ? "2" : ""}`}>
                    {status === "submitted" ? (
                      <div className="student-feedback-submitted">Feedback Submitted</div>
                    ) : (
                      <div className="student-pending-feedback">Pending Feedback</div>
                    )}
                  </div>
                </div>

                {status === "submitted" && (
                  <div className="student-feedback-summary">
                    <div className="student-rating">
                      <div className="student-your-rating">Your rating:</div>
                      <div className="student-stars">
                        {[...Array(5)].map((_, i) => (
                          <img
                            key={i}
                            src={`/assets/star${i < feedback.rating ? "0" : "4"}.svg`}
                            alt={`Star ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="student-feedback_given">{preview}</div>
                  </div>
                )}

                <div className="student-action-buttons">
                  {status === "submitted" ? (
                    <>
                      <button className="student-edit-button" onClick={() => handleEditFeedback(course.courseId)}>
                        <img className="student-edit-icon" src="/assets/edit-icon0.svg" alt="Edit Icon" />
                        <span className="student-edit">Edit</span>
                      </button>
                      <button className="student-delete-button" onClick={() => handleDeleteFeedback(course.courseId)}>
                        <img className="student-delete-icon" src="/assets/delete-icon0.svg" alt="Delete Icon" />
                        <span className="student-delete">Delete</span>
                      </button>
                    </>
                  ) : (
                    <div className="student-add-button" onClick={() => handleAddFeedback(course.courseId)}>
                      <img className="student-add-icon" src="/assets/add-icon0.svg" alt="Add" />
                      <div className="student-add-feedback">Add Feedback</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredCourses.length === 0 && (
            <div className="student-no-results">No courses or professors found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
