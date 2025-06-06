import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import "../styles/student_profile_style.css";
import {
  fetchStudentProfile,
  fetchEnrolledCoursesWithFeedback,
} from "../services/studentDataService";
import LoadingComponent from "../components/LoadingComponent";

export function getInitials(name) {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "";

  const suffixes = ["jr.", "sr.", "ii", "iii", "iv"];
  const lastWord = words[words.length - 1].toLowerCase();
  const lastInitial = suffixes.includes(lastWord) && words.length > 1
    ? words[words.length - 2][0]
    : words[words.length - 1][0];

  return (words[0][0] + lastInitial).toUpperCase();
}

function StudentProfile() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const student = await fetchStudentProfile(user.uid);
        setStudentData(student);

        const courseList = await fetchEnrolledCoursesWithFeedback(student);
        setCourses(courseList);
      } catch (error) {
        console.error("Error loading profile data: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadData()
  }, [user]);
    

  if (loading || !studentData) {
    return <LoadingComponent />;
  }

  const handleBack = () => window.history.back();

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
              <div className="big_initials">{getInitials(studentData.fullName)}</div>
            </div>
            <div className="profile-name">
              <div className="profile_name">{studentData.name}</div>
              <div className="student">Student</div>
            </div>
            <div className="stats">
              <div className="divider"></div>
              <div className="feedback-stat">
                <div className="feedback-given">Feedback Given</div>
                <div className="feedback_num">
                  {courses.filter(c => c.feedback && c.feedback.status === "submitted").length}

                </div>
              </div>
              <div className="courses-stat">
                <div className="current-courses">Current Courses</div>
                <div className="current_num">{courses.length}</div>
              </div>
              <div className="divider"></div>
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
                    <div className="student_name">{studentData.fullName}</div>
                  </div>
                  <div className="info-item">
                    <div className="student_info">Student ID</div>
                    <div className="student_num">{studentData.studentId}</div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <div className="student_info">Email Address</div>
                    <div className="student_email">{studentData.email}</div>
                  </div>
                  <div className="info-item">
                    <div className="student_info">Phone Number</div>
                    <div className="phone_num">{studentData.phoneNumber}</div>
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
                    <div className="student_program">{studentData.program}</div>
                  </div>
                  <div className="info-item">
                    <div className="student_info">Year Level</div>
                    <div className="year_level">{studentData.yearLevel}</div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <div className="student_info">Section</div>
                    <div className="student_section">{studentData.section}</div>
                  </div>
                  <div className="info-item">
                    <div className="student_info">Academic Advisor</div>
                    <div className="student_advisor">{studentData.academicAdvisor}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="subjects-card">
              <div className="current-subjects">Current Subjects</div>
              <div className="subjects-list">
                {courses.map((course, index) => (
                  <div key={index} className="subject-item">
                    <div className="subject-info">
                      <div className="educator_subject">
                        {course.courseCode}: {course.courseName}
                      </div>
                      <div className="educator_name">{course.professorId}</div>
                    </div>
                    <div
                      className={
                        course.feedback && course.feedback.status === "submitted"
                          ? "status-badge"
                          : "pending_status_badge"
                      }
                    >
                      <div className={
                        course.feedback && course.feedback.status === "submitted"
                          ? "feedback-submitted"
                          : "pending-feedback"
                      }>
                        {course.feedback && course.feedback.status === "submitted"
                          ? "Feedback Submitted"
                          : "Pending Feedback"}
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
