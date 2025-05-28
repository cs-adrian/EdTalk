import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // ensure firebase is initialized
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where
} from "firebase/firestore";
import Header from "../components/Header";
import "../styles/dashboard_style.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [coursesData, setCoursesData] = useState([]);
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);
        if (!studentSnap.exists()) throw new Error("Student data not found");

        const sid = studentSnap.data().studentId;
        setStudentId(sid);

        const courseSnap = await getDocs(collection(db, "courses"));
        const courseList = [];

        for (const courseDoc of courseSnap.docs) {
          const course = courseDoc.data();
          const feedbackId = `${sid}_${courseDoc.id}`;
          const feedbackRef = doc(db, "feedbacks", feedbackId);
          const feedbackSnap = await getDoc(feedbackRef);

          courseList.push({
            courseId: courseDoc.id,
            ...course,
            feedback: feedbackSnap.exists() ? feedbackSnap.data() : null,
          });
        }

        setCoursesData(courseList);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = coursesData.filter(
    (c) =>
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.professorName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFeedback = (courseId) => {
    navigate(`/feedback-form?courseId=${courseId}`);
  };

  const handleEditFeedback = (courseId) => {
    navigate(`/feedback-form?edit=true&courseId=${courseId}`);
  };

  const handleDeleteFeedback = async (courseId) => {
    const confirmed = window.confirm("Are you sure you want to delete this feedback?");
    if (confirmed) {
      try {
        const feedbackId = `${studentId}_${courseId}`;
        await deleteDoc(doc(db, "feedbacks", feedbackId));
        setCoursesData(prev =>
          prev.map(c =>
            c.courseId === courseId ? { ...c, feedback: null } : c
          )
        );
      } catch (err) {
        alert("Failed to delete feedback.");
        console.error(err);
      }
    }
  };

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
          <img className="search-icon" src="/assets/search-icon0.svg" alt="Search" />
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
          {filteredCourses.map((course) => {
            const feedback = course.feedback;
            const status = feedback ? "submitted" : "pending";
            const preview = feedback?.comment?.length > 100
              ? feedback.comment.slice(0, 100) + "..."
              : feedback?.comment || "";

            return (
              <div className="professor-card" key={course.courseId}>
                <div className="professor-info">
                  <div className="prof-details">
                    <div className="educator_avatar">
                      <div className="educator_initials">
                        {course.professorInitials || course.professorName[0]}
                      </div>
                    </div>
                    <div className="name-info">
                      <div className="educator_name">{course.professorName}</div>
                      <div className="educator_subject">{course.courseName}</div>
                    </div>
                  </div>
                  <div className={`status${status === "pending" ? "2" : ""}`}>
                    {status === "submitted" ? (
                      <div className="feedback-submitted">Feedback Submitted</div>
                    ) : (
                      <div className="pending-feedback">Pending Feedback</div>
                    )}
                  </div>
                </div>

                {status === "submitted" && (
                  <div className="feedback-summary">
                    <div className="rating">
                      <div className="your-rating">Your rating:</div>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <img
                            key={i}
                            src={`/assets/star${i < feedback.rating ? "0" : "4"}.svg`}
                            alt={`Star ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="feedback_given">{preview}</div>
                  </div>
                )}

                <div className="action-buttons">
                  {status === "submitted" ? (
                    <>
                      <button className="edit-button" onClick={() => handleEditFeedback(course.courseId)}>
                        <img className="edit-icon" src="/assets/edit-icon0.svg" alt="Edit Icon" />
                        <span className="edit">Edit</span>
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteFeedback(course.courseId)}>
                        <img className="delete-icon" src="/assets/delete-icon0.svg" alt="Delete Icon" />
                        <span className="delete">Delete</span>
                      </button>
                    </>
                  ) : (
                    <div className="add-button" onClick={() => handleAddFeedback(course.courseId)}>
                      <img className="add-icon" src="/assets/add-icon0.svg" alt="Add" />
                      <div className="add-feedback">Add Feedback</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredCourses.length === 0 && (
            <div className="no-results">No professors found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
