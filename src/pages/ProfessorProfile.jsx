import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import LoadingComponent from "../components/LoadingComponent";

function ProfessorProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    return (
        <div className="prof-dashboard-container">
            <Header />
            <div>
                <h1>PROFESSOR PROFILE PAGE</h1>
            </div>
        </div>
    )
}

export default ProfessorProfile