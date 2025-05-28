import React from "react";
import { useEffect, useState } from "react";
import { doc, getDoc} from "firebase/firestore"; 
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import "../styles/student_profile_style.css";

function getInitials(name) {
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

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        } else {
          console.error("No student document found for UID: ", user.uid);
        }
      } catch (error) {
        console.error("Error fetching student data: ", error);
      }
    };

    fetchStudentData();
  }, [user]);

  if (!studentData) {
    return <div>Loading student profile...</div>;
  }


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
                <div className="feedback_num">5</div>
              </div>
              <div className="courses-stat">
                <div className="current-courses">Current Courses</div>
                <div className="current_num">{studentData.currentSubjects.length}</div>
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
                    <div className="student_email">
                      {studentData.email}
                    </div>
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
                    <div className="student_program">
                      {studentData.program}
                    </div>
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
                {studentData.currentSubjects?.map((course, index) => (
                  <div key={index} className="subject-item">
                    <div className="subject-info">
                      <div className="educator_subject">{course.courseCode}: {course.courseName}</div>
                      <div className="educator_name">{course.professor}</div>
                    </div>
                    <div
                      className={
                        course.status === "Submitted"
                          ? "status-badge"
                          : "pending_status_badge"
                      }
                    >
                      <div className={course.feedbackStatus === "Submitted" ? "feedback-submitted" : "pending-feedback"}>
                        {course.feedbackStatus === "Submitted" ? "Feedback Submitted" : "Pending Feedback"}
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
