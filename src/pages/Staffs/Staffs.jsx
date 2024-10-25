import React, { useEffect, useState } from "react";
import staffService from "../../services/StaffServices";
import PopUp from "../../components/PopUp/PopUp";
import { useParams } from "react-router-dom";

function Staffs() {
  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const departments = ["Teacher", "Clerk"];
  const [type, setType] = useState("");
  const [popup, setPopup] = useState(false);
  const { branch } = useParams();

  useEffect(() => {
    const fetchedStaffs = staffService.getAllStaff();
    setStaffs(fetchedStaffs);
    setFilteredStaffs(fetchedStaffs);
  }, []);

  useEffect(() => {
    const filtered = staffs.filter((staff) => {
      const matchesSearch = staff.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment
        ? staff.position === selectedDepartment
        : true;
      return matchesSearch && matchesDepartment;
    });
    setFilteredStaffs(filtered);
  }, [searchTerm, selectedDepartment, staffs]);

  const removeStaff = (id) => {
    staffService.deleteStaff(id);
    setStaffs((prevStaffs) => prevStaffs.filter((staff) => staff.id !== id));
  };

  const handleNewStaff = () => {
    setType("stf");
    setPopup(true);
  };

  const handleClose = () => {
    setPopup(false);
    const updatedStaffs = staffService.getAllStaff();
    setStaffs(updatedStaffs); // Refresh the list in real-time after adding new staff
  };

  return (
    <div>
      <h2>Staff List</h2>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>Department</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <button className="addBtn" onClick={handleNewStaff}>Add Staff</button>
      </div>
      {filteredStaffs.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Name</th>
              <th>Department</th>
              <th>Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffs.map((staff, index) => (
              <tr key={staff.id}>
                <td>{index + 1}</td>
                <td>{staff.name}</td>
                <td>{staff.position}</td>
                <td>{staff.contactNumber}</td>
                <td>
                  <button onClick={() => removeStaff(staff.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No staff members found.</p>
      )}
      {popup && <PopUp type={type} branch={branch} onClose={handleClose} />}
    </div>
  );
}

export default Staffs;
