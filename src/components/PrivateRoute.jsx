import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;

      try {
        const studentRef = doc(db, "students", user.uid);
        const professorRef = doc(db, "professors", user.uid);

        const [studentSnap, professorSnap] = await Promise.all([
          getDoc(studentRef),
          getDoc(professorRef),
        ]);

        if (studentSnap.exists()) {
          setRole("student");
        } else if (professorSnap.exists()) {
          setRole("professor");
        } else {
          setRole("unknown");
        }
      } catch (err) {
        console.error("Failed to determine role:", err);
        setRole("unknown");
      } finally {
        setCheckingRole(false);
      }
    };

    if (user) {
      fetchUserRole();
    }
  }, [user]);

  if (loading || checkingRole) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" />;

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
