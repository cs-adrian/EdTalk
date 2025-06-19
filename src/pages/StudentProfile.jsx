// StudentProfile.jsx (Updated Class Names Only)

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
        <div className="student-back-button" onClick={handleBack}>
          <img className="student-back-icon" src="/assets/arrow_back.svg" alt="Back" />
          <span>Back</span>
        </div>

        <div className="student-my-profile">My Profile</div>
        <div className="student-view-and-manage-your-account-information">
          View and manage your account information
        </div>

        <div className="student-profile-content">
          <div className="student-profile-card">
            <div className="student-profile-picture">
              <div className="student-big-initials">{getInitials(studentData.fullName)}</div>
            </div>
            <div className="student-profile-name">
              <div className="profile_name">{studentData.name}</div>
              <div className="student">Student</div>
            </div>
            <div className="student-stats">
              <div className="student-divider"></div>
              <div className="student-feedback-stat">
                <div className="student-feedback-given">Feedback Given</div>
                <div className="student-feedback-num">
                  {courses.filter(c => c.feedback && c.feedback.status === "submitted").length}
                </div>
              </div>
              <div className="student-courses-stat">
                <div className="student-current-courses">Current Courses</div>
                <div className="student-current-num">{courses.length}</div>
              </div>
              <div className="student-divider"></div>
            </div>
          </div>

          <div className="student-information">
            <div className="student-personal-info-card">
              <div className="student-card-header">
                <div className="personal-information">Personal Information</div>
              </div>
              <div className="student-info-grid">
                <div className="student-info-row">
                  <div className="student-info-item">
                    <div className="student_info">Full Name</div>
                    <div className="student_name">{studentData.fullName}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="student_info">Student ID</div>
                    <div className="student_num">{studentData.studentId}</div>
                  </div>
                </div>
                <div className="student-info-row">
                  <div className="student-info-item">
                    <div className="student_info">Email Address</div>
                    <div className="student_email">{studentData.email}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="student_info">Phone Number</div>
                    <div className="student-phone-num">{studentData.phoneNumber}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="student-academic-info-card">
              <div className="academic-information">Academic Information</div>
              <div className="student-info-grid">
                <div className="student-info-row">
                  <div className="student-info-item">
                    <div className="student_info">Program</div>
                    <div className="student_program">{studentData.program}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="student_info">Year Level</div>
                    <div className="student-year-level">{studentData.yearLevel}</div>
                  </div>
                </div>
                <div className="student-info-row">
                  <div className="student-info-item">
                    <div className="student_info">Section</div>
                    <div className="student_section">{studentData.section}</div>
                  </div>
                  <div className="student-info-item">
                    <div className="student_info">Academic Advisor</div>
                    <div className="student_advisor">{studentData.academicAdvisor}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="student-subjects-card">
              <div className="student-current-subjects">Current Subjects</div>
              <div className="student-subjects-list">
                {courses.map((course, index) => (
                  <div key={index} className="student-subject-item">
                    <div className="student-subject-info">
                      <div className="student-educator-subject">
                        {course.courseCode}: {course.courseName}
                      </div>
                      <div className="student-educator-name">{course.professorId}</div>
                    </div>
                    <div
                      className={
                        course.feedback && course.feedback.status === "submitted"
                          ? "student-status-badge"
                          : "student-pending-status-badge"
                      }
                    >
                      <div className={
                        course.feedback && course.feedback.status === "submitted"
                          ? "student-feedback-submitted"
                          : "student-pending-feedback"
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
