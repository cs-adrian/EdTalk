import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; 
import LoadingComponent from "../components/LoadingComponent";


function ProfessorDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    return (
        <div className="prof-dashboard-container">
            <div>
                <h1>PROFESSOR DASHBOARD PAGE</h1>
                
            </div>
        </div>
    )
}

export default ProfessorDashboard