import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db} from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import {
  fetchStudentProfile,
  fetchEnrolledCoursesWithFeedback,
} from "../services/studentDataService";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../pages/StudentProfile";

function Header() {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [userRole, setUserRole] = useState(null); 
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  const handleProfileClick = () => {
    if (userRole === "student") {
      navigate("/profile");
    } else if (userRole === "professor") {
      navigate("/professor-profile");
    }
  };

  const handleLogoutClick = () => navigate("/");

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
      const loadData = async () => {
        if (user) {
          // Try student first
          const studentDoc = await getDoc(doc(db, "students", user.uid));
          if (studentDoc.exists()) {
            const student = studentDoc.data();
            setUserRole("student");
            setUserName(student.name);
            setUserInitials(getInitials(student.name));
            return;
          }

          // Try professor
          const profDoc = await getDoc(doc(db, "professors", user.uid));
          if (profDoc.exists()) {
            const prof = profDoc.data();
            setUserRole("professor");
            setUserName(prof.name);
            setUserInitials(getInitials(prof.name));
          }
        }
      };

      loadData();
    }, [user]);

  
  return (
    <>
      <style>{`
        .header {
          background: #ffffff;
          border-style: solid;
          border-color: #e2e8f0;
          border-width: 0px 0px 1px 0px;
          padding: 0px 24px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100vw; 
          height: 64px;
          position: fixed; 
          left: 0;
          top: 0;
          box-sizing: border-box;
          z-index: 9999;
        }

        .logo {
          display: flex;
          flex-direction: row;
          gap: 8px;
          align-items: center;
          justify-content: flex-start;
          flex-shrink: 0;
          position: relative;
        }

        .logo img {
          display: flex;
          align-items: center;
          height: 50px;
        }

        .user-menu {
          display: flex;
          flex-direction: row;
          gap: 8px;
          align-items: center;
          justify-content: flex-start;
          flex-shrink: 0;
          position: relative;
          cursor: pointer;
        }

        .avatar {
          background: #e0e7ff;
          border-radius: 18px;
          display: flex;
          flex-direction: row;
          gap: 0px;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          position: relative;
        }

        .initials {
          color: #4338ca;
          text-align: left;
          font-family: "Inter-SemiBold", sans-serif;
          font-size: 14px;
          line-height: 16.8px;
          font-weight: 600;
          position: relative;
        }

        .user_name {
          color: #111827;
          text-align: left;
          font-family: "Inter-SemiBold", sans-serif;
          font-size: 14px;
          line-height: 16.8px;
          font-weight: 500;
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          width: 150px;
          z-index: 20;
          display: flex;
          flex-direction: column;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          font-family: "Poppins-Bold", sans-serif;
        }

        .dropdown-icon {
          width: 16px;
          height: 16px;
        }

        .dropdown-item:hover {
          background-color: #f3f4f6;
        }
      `}</style>

      <div className="header">
        <div className="logo-bar">
          <div className="logo">
            <img src="/assets/logo.svg" alt="EdTalk Logo" />
          </div>
        </div>

        <div className="user-menu" onClick={toggleDropdown} ref={dropdownRef}>
          <div className="avatar">
            <div className="initials">{userInitials}</div>
          </div>
          <div className="user_name">{userName}</div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleProfileClick}>
                <img
                  src="/assets/profile-icon0.svg"
                  alt="Profile Icon"
                  className="dropdown-icon"
                />
                Profile
              </div>
              <div className="dropdown-item" onClick={handleLogoutClick}>
                <img
                  src="/assets/logout-icon0.svg"
                  alt="Logout Icon"
                  className="dropdown-icon"
                />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
