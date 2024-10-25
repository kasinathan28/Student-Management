import React, { useEffect, useState } from "react";
import studentService from "../../services/StudentServices";
import "./Students.scss";
import { useParams } from "react-router-dom";
import PopUp from "../../components/PopUp/PopUp";
import { classes, months } from "../../utils/Data";

function Students() {
  const { branch } = useParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [popup, setPopup] = useState(false);
  const [type, setType] = useState("");
  const [loadingFees, setLoadingFees] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for fetching students

  // Fetch students from service
  const fetchStudents = async () => {
    setLoading(true);
    const fetchedStudents = await studentService.listStudents(branch);
    const updatedStudents = fetchedStudents.map((student) => ({
      ...student,
      fees: Array.isArray(student.fees)
        ? student.fees
        : months.map((monthObj) => ({ month: monthObj.month, isPaid: false })),
    }));
    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [branch]);

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

  const removeStudent = async (id) => {
    await studentService.removeStudent(id); // Awaiting the service call
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );
  };

  const fetchFeeStatus = async (studentId) => {
    return await studentService.fetchFeesStatus(studentId);
  };

  const handleShowFeeStatus = async (student) => {
    setLoadingFees(true);
    const feesStatus = await fetchFeeStatus(student.id);
    setSelectedStudent({
      ...student,
      fees: Array.isArray(feesStatus) ? feesStatus : [],
    });
    setLoadingFees(false);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedStudent(null);
    fetchStudents(); // Refresh students data after closing the popup
  };

  const handleClose = () => {
    setPopup(false);
  };

  const updateFeeStatus = async (studentId, month, currentStatus) => {
    const students = studentService.getStoredStudents();
    const studentToUpdate = students.find(
      (student) => student.id === studentId
    );

    if (studentToUpdate) {
      const updatedFees = studentToUpdate.fees.map((fee) => {
        if (fee.month === month) {
          return { ...fee, isPaid: !currentStatus };
        }
        return fee;
      });

      const updatedStudent = { ...studentToUpdate, fees: updatedFees };

      await studentService.updateStudent(studentId, updatedStudent); // Awaiting the service call

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId ? updatedStudent : student
        )
      );
    }
  };

  const handleNewStudent = () => {
    setType("std");
    setPopup(true);
  };

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

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
        <button className="addBtn" onClick={handleNewStudent}>
          Add Student
        </button>
      </div>
      {loading ? (
        <p>Loading students...</p>
      ) : filteredStudents.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Parent's Name</th>
              <th>Parent's Contact Number</th>
              <th>Fees ({currentMonth})</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => {
              const fee = student.fees.find(
                (fee) => fee.month === currentMonth
              );
              return (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>{student.parentName}</td>
                  <td>{student.parentContactNumber}</td>
                  <td>
                    {fee ? (fee.isPaid ? "✅" : "❌") : "No Payment Record"}
                  </td>
                  <td>
                    <button onClick={() => handleShowFeeStatus(student)}>
                      View Fee Status
                    </button>
                    <button onClick={() => removeStudent(student.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No students found.</p>
      )}

      {showPopup && selectedStudent && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Fee Status for {selectedStudent.name}</h3>
            <p>Admission Fees: To be updated</p>
            <button className="close-button" onClick={handleClosePopup}>
              &times;
            </button>
            {loadingFees ? (
              <p>Loading fee status...</p>
            ) : (
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
                    const fee = selectedStudent.fees.find(
                      (fee) => fee.month === monthObj.month
                    );

                    return (
                      <tr key={monthObj.month}>
                        <td>{monthObj.month}</td>
                        <td>
                          {fee
                            ? fee.isPaid
                              ? "✅"
                              : "❌"
                            : "No Payment Record"}
                        </td>
                        <td>
                          {fee && (
                            <button
                              onClick={async () => {
                                const newStatus = !fee.isPaid; // Toggle the payment status
                                await updateFeeStatus(
                                  selectedStudent.id,
                                  monthObj.month,
                                  fee.isPaid
                                );

                                // Update local state to reflect the change
                                setSelectedStudent((prevStudent) => ({
                                  ...prevStudent,
                                  fees: prevStudent.fees.map((f) =>
                                    f.month === monthObj.month
                                      ? { ...f, isPaid: newStatus }
                                      : f
                                  ),
                                }));
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
            )}
          </div>
        </div>
      )}

      {popup && <PopUp type={type} branch={branch} onClose={handleClose} />}
    </div>
  );
}

export default Students;
