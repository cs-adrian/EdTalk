import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import Header from "../components/Header";
import LoadingComponent from "../components/LoadingComponent";
import { fetchProfessorProfile, fetchCoursesHandledByProfessor } from "../services/professorDataService";
import "../styles/dashboard_style.css"; // reuse student dashboard styles

function ProfessorDashboard() {
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

  return (
    <div className="container">
      <Header />
      <div className="dashboard-header">
        <div className="my-feedback">My Courses</div>
        <div className="manage-your-feedback-to-professors">
          Courses you currently handle
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
            <div className="professor-card" key={course.courseId}>
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
