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

import "../styles/professor_dashboard.css";
import Header from "../components/Header";
import LoadingComponent from "../components/LoadingComponent";

function ProfessorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [courseStats, setCourseStats] = useState({});

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

        console.log("Total Feedbacks Received:", stats.totalFeedbacks); 
        console.log("Average Rating:", stats.averageRating);
        
        const statsMap = {};
        
        for (const course of coursesHandled) {
          const { courseId, section } = course;
          
          const studentCount = await getStudentCountInSectionForCourse(courseId, section);       
          const avgRating = await getAverageRatingForCourseInSection(courseId, section);
          const feedbackCount = await getFeedbackCountForCourseInSection(courseId, section);
         
          console.log(`📘 ${course.courseCode} - ${section}`);
          console.log("  👨‍🎓 Students Enrolled from Section:", studentCount);
          console.log("  ⭐ Average Rating (Section):", avgRating);
          console.log("  📝 Feedbacks Submitted (Section):", feedbackCount);

          statsMap[courseId] = {
            studentCount,
            avgRating,
            feedbackCount
          };
        }

        setCourseStats(statsMap);
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

      <div className="professor-courses-grid">
        {filteredCourses.map((course) => {
          const stats = courseStats[course.courseId] || {};
          return (
            <div className="professor-course-card" key={course.courseId}>
              <div className="professor-course-header">
                <div className="professor-course-code">{course.courseCode}</div>
                <div className="professor-course-name">{course.courseName}</div>
                <div className="professor-course-section">{course.section}</div>
              </div>
              
              <div className="professor-course-stats">
                <div className="professor-stat-item">
                  <div className="professor-stat-label">Students</div>
                  <div className="professor-stat-value">{stats.studentCount || 0}</div>
                </div>
                <div className="professor-stat-item">
                  <div className="professor-stat-label">Feedback</div>
                  <div className="professor-stat-value">{stats.feedbackCount || 0}</div>
                </div>
                <div className="professor-stat-item">
                  <div className="professor-stat-label">Avg Rating</div>
                  <div className="professor-stat-value professor-rating-value">
                    {stats.avgRating ? stats.avgRating.toFixed(1) : '0.0'} <span className="professor-star">★</span>
                  </div>
                </div>
              </div>

              <button
                className="professor-view-feedback-btn"
                onClick={() => handleViewFeedbackStats(course.courseId, course.section)}
              >
                View Feedback
              </button>
            </div>
          );
        })}

        {filteredCourses.length === 0 && (
          <div className="professor-no-results">No matching courses found.</div>
        )}
      </div>
    </div>
  );
}

export default ProfessorDashboard;