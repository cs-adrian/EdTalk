import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import "../styles/professor_profile_style.css";
import { fetchProfessorProfile, fetchCoursesHandledByProfessor } from "../services/professorDataService";
import LoadingComponent from "../components/LoadingComponent";

function ProfessorProfile() {
  const { user } = useAuth();
  const [professorData, setProfessorData] = useState(null);
  const [currentCourses, setCurrentCourses] = useState(null);
  const [currentSections, setCurrentSections] = useState(null);
  const [formattedCourses, setFormattedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const professor = await fetchProfessorProfile(user.uid);
        const coursesHandled = await fetchCoursesHandledByProfessor(professor);
        setProfessorData(professor);
        setCurrentCourses(coursesHandled.length);

        // Group courses by courseCode + courseName
        const courseMap = {};

        coursesHandled.forEach(course => {
          const { courseCode, courseName, courseId } = course;
          const section = courseId.split("_")[1];

          const key = `${courseCode}: ${courseName}`;

          if (!courseMap[key]) {
            courseMap[key] = new Set();
          }

          courseMap[key].add(section);
        });

        // Convert map to displayable list
        const formattedCourseList = Object.entries(courseMap).map(([courseInfo, sectionsSet]) => ({
          courseInfo,
          sections: Array.from(sectionsSet).sort()
        }));

        setFormattedCourses(formattedCourseList);


        const uniqueSections = new Set(
         coursesHandled.map(course => course.courseId.split("_")[1])
        );

        setCurrentSections(uniqueSections.size);
        console.log("Current Courses: ", coursesHandled.length);
        console.log("Current Sections: ", uniqueSections.size);
      } catch (error) {
        console.error("Error loading professor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading || !professorData) {
    return <LoadingComponent />;
  }

  const handleBack = () => window.history.back();

  return (
    <div className="professor-profile-container">
      <Header />

      <div className="professor-profile-page">
        <div className="back-button" onClick={handleBack}>
          <img className="back-icon" src="/assets/arrow_back.svg" alt="Back" />
          <span>Back</span>
        </div>

        <div className="my-profile">My Profile</div>
        <div className="view-and-manage">View and manage your account information</div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-picture">
              <div className="big-initials">
                {professorData.fullName ? professorData.fullName[0].toUpperCase() : ""}
              </div>
            </div>
            <div className="profile-name">
              <div className="profile_name">{professorData.name}</div>
              <div className="professor">Professor</div>
              
              <div className="course-section-counts">
                <div>Courses: {currentCourses}</div>
                <div>Sections: {currentSections}</div>
              </div>
            </div>
            
            
          </div>

          <div className="info-section">
            <div className="info-card">
              <div className="card-header">Personal Information</div>
              <div className="info-grid">
                <div className="info-item">
                  <div className="label">Full Name</div>
                  <div className="value">{professorData.fullName}</div>
                </div>
                <div className="info-item">
                  <div className="label">Professor ID</div>
                  <div className="value">{professorData.professorId}</div>
                </div>
                <div className="info-item">
                  <div className="label">Email</div>
                  <div className="value">{professorData.email}</div>
                </div>
                <div className="info-item">
                  <div className="label">Phone Number</div>
                  <div className="value">{professorData.phoneNumber}</div>
                </div>
                <div className="info-item">
                  <div className="label">College</div>
                  <div className="value">{professorData.college}</div>
                </div>
                <div className="info-item">
                  <div className="label">Department</div>
                  <div className="value">{professorData.department}</div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="card-header">Courses Handled</div>
              <ul className="course-list">
                {formattedCourses.map(({ courseInfo, sections }, index) => (
                  <li key={index} className="course-item">
                    <div className="course-title">{courseInfo}</div>
                    <div className="course-sections">{sections.join(", ")}</div>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessorProfile;
