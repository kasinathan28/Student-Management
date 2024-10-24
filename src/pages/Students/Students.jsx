import React, { useEffect, useState } from "react";
import studentService from "../../services/StudentServices"; // Import the student service
import "./Students.scss";
import { useParams } from "react-router-dom";

function Students() {
  const { branch } = useParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedClass, setSelectedClass] = useState(""); // State for selected class
  const [showPopup, setShowPopup] = useState(false); // State for controlling popup visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // State for the selected student
  const classes = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ]; // Example classes

  const months = [
    { month: "January" },
    { month: "February" },
    { month: "March" },
    { month: "April" },
    { month: "May" },
    { month: "June" },
    { month: "July" },
    { month: "August" },
    { month: "September" },
    { month: "October" },
    { month: "November" },
    { month: "December" },
  ];

  // Fetch students when the component mounts
  useEffect(() => {
    const fetchedStudents = studentService.listStudents(branch);
    setStudents(fetchedStudents);
    setFilteredStudents(fetchedStudents); // Initialize filtered students
  }, [branch]);

  // Update filtered students based on search term and selected class
  useEffect(() => {
    const filtered = students.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass
        ? student.class === selectedClass
        : true;
      return matchesSearch && matchesClass;
    });
    setFilteredStudents(filtered);
  }, [searchTerm, selectedClass, students]);

  // Function to remove a student
  const removeStudent = (id) => {
    studentService.removeStudent(id); // Remove from service
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    ); // Update state
  };

  // Function to fetch and update the fee status for each month
  const fetchFeeStatus = (studentId) => {
    return studentService.fetchFeesStatus(studentId);
  };

  // Function to handle opening the fee status popup
  const handleShowFeeStatus = (student) => {
    setSelectedStudent(student);
    setShowPopup(true);
  };

  // Function to handle closing the fee status popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedStudent(null);
  };

  const updateFeeStatus = (studentId, month, newStatus) => {
    const students = getStoredStudents(); // Fetch all students
    const studentToUpdate = students.find(
      (student) => student.id === studentId
    ); // Find the student by ID

    if (studentToUpdate) {
      // Update the fees for the specific month
      const updatedFees = studentToUpdate.fees.map((fee) => {
        if (fee.month === month) {
          return { ...fee, isPaid: !newStatus }; // Toggle the isPaid status
        }
        return fee; // Return the unmodified fee
      });

      // Create an updated student object with modified fees
      const updatedStudent = { ...studentToUpdate, fees: updatedFees };

      // Call updateStudent to save changes
      updatedStudent(updatedStudent);
    }
  };

  return (
    <div>
      <h2>Students List</h2>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">All Classes</option>
          {classes.map((cls, index) => (
            <option key={index} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>
      {filteredStudents.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Contact Number</th>
              <th>Parent's Name</th>
              <th>Parent's Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.class}</td>
                <td>{student.contactNumber}</td>
                <td>{student.parentName}</td>
                <td>{student.parentContactNumber}</td>
                <td>
                  <button onClick={() => handleShowFeeStatus(student)}>
                    View Fee Status
                  </button>
                  <button onClick={() => removeStudent(student.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found.</p>
      )}

      {showPopup && selectedStudent && (
        <div className="popup">
          <h3>Fee Status for {selectedStudent.name}</h3>
          <p>Admission Fees: To be updated</p>
          <button className="close-button" onClick={handleClosePopup}>
            &times;
          </button>

          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {months.map((monthObj) => {
                const fee = fetchFeeStatus(selectedStudent.id).find(
                  (fee) => fee.month === monthObj.month
                );

                return (
                  <tr key={monthObj.month}>
                    <td>{monthObj.month}</td>
                    <td>
                      {fee
                        ? fee.isPaid
                          ? "Paid"
                          : "Unpaid"
                        : "No Payment Record"}
                    </td>
                    <td>
                      {fee && (
                        <button
                          onClick={() => {
                            const newStatus = fee.isPaid; // Get the current status
                            updateFeeStatus(
                              selectedStudent.id,
                              monthObj.month,
                              newStatus
                            ); // Pass the current status to toggle
                          }}
                        >
                          {fee.isPaid ? "Mark Unpaid" : "Mark Paid"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Students;
