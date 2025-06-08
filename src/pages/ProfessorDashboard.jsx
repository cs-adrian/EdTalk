import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { fetchProfessorProfile, fetchCoursesHandledByProfessor } from "../services/professorDataService";
import { fetchFeedbacksByProfessorId, calculateProfessorStats } from "../services/feedbackDataService";
import {
  getStudentCountInSectionForCourse,
  getAverageRatingForCourseInSection,
  getFeedbackCountForCourseInSection
} from "../services/courseDataService";

import "../styles/dashboard_style.css"; // reuse student dashboard styles
import Header from "../components/Header";
import LoadingComponent from "../components/LoadingComponent";

function ProfessorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const professor = await fetchProfessorProfile(user.uid);
        const coursesHandled = await fetchCoursesHandledByProfessor(professor);
        const professorId = professor.professorId

        const uniqueSections = new Set(
         coursesHandled.map(course => course.courseId.split("_")[1])
        );

        const numberOfSections = uniqueSections.size;
        console.log("Number of Unique Sections:", numberOfSections);
        
        const feedbacks = await fetchFeedbacksByProfessorId(professorId);

        const stats = calculateProfessorStats(feedbacks);

        //Get the total number of feedbacks received (di na kasama sa frontend)
        console.log("Total Feedbacks Received:", stats.totalFeedbacks); 
        //Get the Overall Rating of the professor (di na kasama sa frontend)
        console.log("Average Rating:", stats.averageRating);
        
        for (const course of coursesHandled) {
          const { courseId, section } = course;
          
          const studentCount = await getStudentCountInSectionForCourse(courseId, section);       
          const avgRating = await getAverageRatingForCourseInSection(courseId, section);
          const feedbackCount = await getFeedbackCountForCourseInSection(courseId, section);
         
          console.log(`📘 ${course.courseCode} - ${section}`);
          console.log("  👨‍🎓 Students Enrolled from Section:", studentCount);
          console.log("  ⭐ Average Rating (Section):", avgRating);
          console.log("  📝 Feedbacks Submitted (Section):", feedbackCount);
        }

        setCourses(coursesHandled);
        setLoading(false);

      } catch (error) {
        console.error("Error loading professor dashboard:", error);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingComponent />;

  const filteredCourses = courses.filter(
    (c) =>
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewFeedbackStats = (courseId, section) => {
    navigate("/course-feedback", { state: { courseId, section } });
  };

  return (
    <div className="container">
      <Header />
      <div className="dashboard-header">
        <div className="my-feedback">My Courses</div>
        <div className="manage-your-feedback-to-professors">
          View and analyze feedback for your courses
        </div>
      </div>

      <div className="action-bar">
        <div className="search-bar">
          <img className="search-icon" src="/assets/search-icon0.svg" alt="Search" />
          <input
            type="text"
            className="search-professors"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="student-dashboard">
        <div className="professor-list">
          {filteredCourses.map((course) => (
             <div
                className="professor-card"
                key={course.courseId}
              >
              <div className="professor-info">
                <div className="prof-details">
                  <div className="educator_avatar">
                    <div className="educator_initials">
                      {course.courseCode?.slice(0, 2).toUpperCase() || "??"}
                    </div>
                  </div>
                  <div className="name-info">
                    <div className="educator_name">{course.courseName}</div>
                    <div className="educator_subject">
                      {course.courseCode} – Section {course.section}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleViewFeedbackStats(course.courseId, course.section)}
              >
                View Feedback Stats
              </button>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="no-results">No matching courses found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessorDashboard;
