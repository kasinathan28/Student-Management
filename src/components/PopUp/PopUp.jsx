import React, { useState, useEffect } from "react";
import "./PopUp.scss";
import studentService from "../../services/StudentServices";
import staffService from "../../services/StaffServices";
import { months } from "../../utils/Data";

function PopUp({ onClose, branch, type }) {
  const initialFees = months.map((monthObj) => ({
    month: monthObj.month,
    isPaid: false, // Default status can be false
  }));

  const [details, setDetails] = useState({
    id: Date.now(),
    name: "",
    contactNumber: "",
    branch: branch,
    ...(type === "std"
      ? {
          class: "",
          parentName: "",
          parentContactNumber: "",
          fees: initialFees, // Updated fees structure
        }
      : {
          position: "",
          salary: "",
        }),
  });

  const [totalFees, setTotalFees] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (type === "std" && details.class) {
      const baseFee = 5000;
      const classIndex = Number(details.class) - 2;
      const calculatedFees = baseFee + classIndex * 1000;
      setTotalFees(calculatedFees);
    }
  }, [details.class, type]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === "std") {
      studentService.addStudent({ ...details, fees: initialFees });
      console.log("New student details:", { ...details, fees: initialFees });
    } else if (type === "stf") {
      staffService.addStaff(details);
      console.log("New staff details:", details);
    }
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{type === "std" ? "New Student Admission" : "New Staff Entry"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={details.name}
            onChange={handleChange}
            required
          />
          {type === "std" ? (
            <>
              <select
                name="class"
                value={details.class}
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
                type="text"
                name="parentName"
                placeholder="Parent's Name"
                value={details.parentName}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="parentContactNumber"
                placeholder="Parent's Contact Number"
                value={details.parentContactNumber}
                onChange={handleChange}
                required
              />
              <div>
                <strong>Total Fees: </strong>
                {totalFees}
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={details.position}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={details.salary}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="contactNumber"
                placeholder="Contact Number"
                value={details.contactNumber}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default PopUp;
