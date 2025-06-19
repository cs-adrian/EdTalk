import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
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
    <>
      <style jsx>{`
        .professor-profile-container {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .professor-profile-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 12px;
        }

        .profile-header {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 60px 0 8px 0;
          line-height: 1.2;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
          font-weight: 400;
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 8px;
          align-items: start;
        }

        .profile-sidebar {
          position: sticky;
          top: 32px;
        }

        .profile-card {
          background: white;
          border-radius: 16px;
          padding: 32px 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          text-align: center;
        }

        .avatar-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c7d2fe, #a5b4fc);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          position: relative;
        }

        .avatar-initials {
          font-size: 48px;
          font-weight: 700;
          color: #4338ca;
          letter-spacing: -1px;
        }

        .profile-info {

          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
          margin-left: -12px;
          margin-right: -12px;
          padding-left: 12px;
          padding-right: 12px;
          width: 100%;
        }

        .profile-name {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .profile-role {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }

        .profile-stats {
          margin-bottom: 8px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          margin-left: -12px;
          margin-right: -12px;
          padding-left: 12px;
          padding-right: 12px;
          width: 100%;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .edit-profile-btn {
          width: 100%;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .edit-profile-btn:hover {
          background: #e5e7eb;
          border-color: #d1d5db;
        }

        /* Right Content Area */
        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }

        .info-card, .courses-sections-card {
          background: white;
          border-radius: 16px;
          padding: 32px 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          width: 100%;
          box-sizing: border-box;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .edit-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
        }

        .edit-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-label {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin: 0;
        }

        .info-value {
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.4;
        }

        .courses-sections-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          width: 100%;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 20px 0;
        }

        .courses-list, .sections-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .course-item, .section-item {
          padding: 16px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .course-item:last-child, .section-item:last-child {
          border-bottom: none;
        }

        .course-code {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.4;
        }

        .section-codes {
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 1024px) {
          .profile-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .profile-sidebar {
            position: static;
          }

          .courses-sections-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        @media (max-width: 768px) {
          .professor-profile-page {
            padding: 24px 8px;
          }

          .profile-card {
            padding: 24px 20px;
          }

          .avatar-circle {
            width: 100px;
            height: 100px;
          }

          .avatar-initials {
            font-size: 40px;
          }

          .info-card, .courses-sections-card {
            padding: 24px 16px;
          }

          .info-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .page-title {
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .professor-profile-page {
            padding: 20px 6px;
          }

          .profile-card {
            padding: 20px 16px;
          }

          .info-card, .courses-sections-card {
            padding: 20px 12px;
          }

          .card-header {
            margin-bottom: 20px;
          }

          .info-grid {
            gap: 20px;
          }
        }
      `}</style>
      
      <div className="professor-profile-container">
        <Header />

        <div className="professor-profile-page">
          <div className="profile-header">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">View and manage your account information</p>
          </div>

          <div className="profile-layout">
            <div className="profile-sidebar">
              <div className="profile-card">
                <div className="profile-avatar">
                  <div className="avatar-circle">
                    <span className="avatar-initials">
                      {professorData.fullName ? professorData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : ""}
                    </span>
                  </div>
                </div>
                
                <div className="profile-info">
                  <h2 className="profile-name">{professorData.fullName}</h2>
                  <p className="profile-role">Instructor I</p>
                </div>

                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-label">Current Courses</span>
                    <span className="stat-value">{currentCourses}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Current Sections</span>
                    <span className="stat-value">{currentSections}</span>
                  </div>
                </div>

                <button className="edit-profile-btn">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="profile-content">
              <div className="info-card">
                <div className="card-header">
                  <h3 className="card-title">Personal Information</h3>
                  <button className="edit-btn">
                    Edit
                  </button>
                </div>
                
                <div className="info-grid">
                  <div className="info-row">
                    <div className="info-item">
                      <label className="info-label">Full Name</label>
                      <p className="info-value">{professorData.fullName}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Professor ID</label>
                      <p className="info-value">{professorData.professorId}</p>
                    </div>
                  </div>
                  
                  <div className="info-row">
                    <div className="info-item">
                      <label className="info-label">Email Address</label>
                      <p className="info-value">{professorData.email}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Phone Number</label>
                      <p className="info-value">{professorData.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="info-row">
                    <div className="info-item">
                      <label className="info-label">College</label>
                      <p className="info-value">{professorData.college}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Department</label>
                      <p className="info-value">{professorData.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="courses-sections-card">
                <div className="courses-sections-layout">
                  <div className="courses-column">
                    <h3 className="section-title">Courses</h3>
                    <div className="courses-list">
                      {formattedCourses.map(({ courseInfo, sections }, index) => (
                        <div key={index} className="course-item">
                          <p className="course-code">{courseInfo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="sections-column">
                    <h3 className="section-title">Sections</h3>
                    <div className="sections-list">
                      {formattedCourses.map(({ courseInfo, sections }, index) => (
                        <div key={index} className="section-item">
                          <p className="section-codes">{sections.join(', ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfessorProfile;