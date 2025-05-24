import React from "react";
import Header from "../components/Header";
import "../styles/student_profile_style.css";

function StudentProfile() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="student-profile-container">
      <Header />

      <div className="student-profile-page">
        <div className="back-button" onClick={handleBack}>
            <img className="back-icon" src="/assets/arrow_back.svg" alt="Back" />
            <span>Back</span>
        </div>
        <div className="my-profile">My Profile</div>
        <div className="view-and-manage-your-account-information">
          View and manage your account information
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-picture">
              <div className="big_initials">JS</div>
            </div>
            <div className="profile-name">
              <div className="profile_name">John Smith</div>
              <div className="student">Student</div>
            </div>
            <div className="stats">
              <div className="divider"></div>
              <div className="feedback-stat">
                <div className="feedback-given">Feedback Given</div>
                <div className="feedback_num">5</div>
              </div>
              <div className="courses-stat">
                <div className="current-courses">Current Courses</div>
                <div className="current_num">5</div>
              </div>
              <div className="divider"></div>
            </div>
            <div className="edit-profile-button">
              <img className="edit-icon" src="/assets/edit-icon0.svg" alt="Edit" />
              <div className="edit-profile">Edit Profile</div>
            </div>
          </div>

          <div className="student-information">
            <div className="personal-info-card">
              <div className="card-header">
                <div className="personal-information">Personal Information</div>
              </div>
              <div className="info-grid">
                <div className="info-row">
                  <div className="info-item">
                    <div className="student_info">Full Name</div>
                    <div className="student_name">John Alexander Smith</div>
                  </div>
                  <div className="info-item">
                    <div className="student_info">Student ID</div>
                    <div className="student_num">202301042</div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <div className="student_info">Email Address</div>
                    <div className="student_email">
                      john.smith@university.edu
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="student_info">Phone Number</div>
                    <div className="phone_num">(+63) 9123 456 7890</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="academic-info-card">
              <div className="academic-information">Academic Information</div>
              <div className="info-grid">
                <div className="info-row">
                  <div className="info-item">
                    <div className="student_info">Program</div>
                    <div className="student_program">
                      Bachelor of Science in Computer Science
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="student_info">Year Level</div>
                    <div className="year_level">Junior (3rd Year)</div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <div className="student_info">Section</div>
                    <div className="student_section">CS-301-A</div>
                  </div>
                  <div className="info-item">
                    <div className="student_info">Academic Advisor</div>
                    <div className="student_advisor">Dr. Michael Chen</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="subjects-card">
              <div className="current-subjects">Current Subjects</div>
              <div className="subjects-list">
                {[
                  {
                    subject: "CS301: Data Structures and Algorithms",
                    educator: "Dr. Patricia Johnson",
                    status: "submitted",
                  },
                  {
                    subject: "CS315: Database Systems",
                    educator: "Dr. Robert Brown",
                    status: "pending",
                  },
                  {
                    subject: "CS350: Software Engineering",
                    educator: "Dr. Sarah Williams",
                    status: "submitted",
                  },
                  {
                    subject: "MATH301: Discrete Mathematics",
                    educator: "Dr. James Wilson",
                    status: "pending",
                  },
                  {
                    subject: "ENG210: Technical Writing",
                    educator: "Prof. Elizabeth Taylor",
                    status: "pending",
                  },
                ].map((course, index) => (
                  <div key={index} className="subject-item">
                    <div className="subject-info">
                      <div className="educator_subject">{course.subject}</div>
                      <div className="educator_name">{course.educator}</div>
                    </div>
                    <div
                      className={
                        course.status === "submitted"
                          ? "status-badge"
                          : "pending_status_badge"
                      }
                    >
                      <div className={course.status === "submitted" ? "feedback-submitted" : "pending-feedback"}>
                        {course.status === "submitted" ? "Feedback Submitted" : "Pending Feedback"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
