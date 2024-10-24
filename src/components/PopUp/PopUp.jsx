import React, { useState, useEffect } from "react";
import "./PopUp.scss";
import studentService from "../../services/StudentServices";

function PopUp({ onClose, branch }) {
  const [studentDetails, setStudentDetails] = useState({
    id: Date.now(),
    name: "",
    class: "",
    contactNumber: "",
    parentName: "",
    parentContactNumber: "",
    fees: 0,
    branch: branch,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    const baseFee = 5000;
    const classIndex = Number(studentDetails.class) - 2;
    const calculatedFees = baseFee + classIndex * 1000;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      fees: studentDetails.class ? calculatedFees : 0,
    }));
  }, [studentDetails.class]);

  const handleSubmit = (e) => {
    e.preventDefault();

    studentService.addStudent(studentDetails);
    console.log("New student details:", studentDetails);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>New Student Admission</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={studentDetails.name}
            onChange={handleChange}
            required
          />
          <select
            name="class"
            value={studentDetails.class}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Class
            </option>
            {[...Array(11)].map((_, index) => (
              <option key={index} value={index + 2}>
                {index + 2}
              </option>
            ))}
          </select>
          <input
            type="tel"
            name="contactNumber"
            placeholder="Contact Number"
            value={studentDetails.contactNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="parentName"
            placeholder="Parent's Name"
            value={studentDetails.parentName}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="parentContactNumber"
            placeholder="Parent's Contact Number"
            value={studentDetails.parentContactNumber}
            onChange={handleChange}
            required
          />
          <div>
            <strong>Fees: </strong>
            {studentDetails.fees}
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default PopUp;
