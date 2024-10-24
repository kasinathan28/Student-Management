import React, { useState } from "react";
import "./HomePage.scss"; // Import the CSS file for styling
import { useNavigate, useParams } from "react-router-dom";
import PopUp from "../../components/PopUp/PopUp";

function HomePage() {
  const { branch } = useParams();
  const navigate = useNavigate();
  const [isPopup, setIsPopup] = useState(false); // State to control popup visibility

  const handleNewAdmissionClick = () => {
    setIsPopup(true); // Show the popup when clicking "New Admission"
  };

  const closePopup = () => {
    setIsPopup(false); // Function to close the popup
  };

  const handelStudentPage = () => {
    navigate(`/students/${branch}`);
  };

  return (
    <div className="home-page">
      <div className="user-details">
        <h2>Branch: {branch}</h2>
      </div>
      <div className="contents" onClick={handleNewAdmissionClick}>
        <div className="card">
          <div className="card-item">New Admission</div>
        </div>
        <div className="card" onClick={handelStudentPage}>
          <div className="card-item">Students</div>
        </div>
        <div className="card">
          <div className="card-item">Staffs</div>
        </div>
      </div>
      {isPopup && <PopUp onClose={closePopup} branch={branch} />}{" "}
    </div>
  );
}

export default HomePage;
