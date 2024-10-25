// src/services/StaffServices.js

const STAFF_KEY = "staffData";

const staffService = {
  addStaff: (staffDetails) => {
    const currentStaff = staffService.getAllStaff();
    currentStaff.push(staffDetails);
    localStorage.setItem(STAFF_KEY, JSON.stringify(currentStaff));
  },

  getAllStaff: () => {
    const staffData = localStorage.getItem(STAFF_KEY);
    return staffData ? JSON.parse(staffData) : [];
  },

  getStaffById: (id) => {
    const currentStaff = staffService.getAllStaff();
    return currentStaff.find((staff) => staff.id === id);
  },

  updateStaff: (id, updatedDetails) => {
    const currentStaff = staffService.getAllStaff();
    const staffIndex = currentStaff.findIndex((staff) => staff.id === id);
    if (staffIndex !== -1) {
      currentStaff[staffIndex] = { ...currentStaff[staffIndex], ...updatedDetails };
      localStorage.setItem(STAFF_KEY, JSON.stringify(currentStaff));
    }
  },

  deleteStaff: (id) => {
    const currentStaff = staffService.getAllStaff();
    const updatedStaff = currentStaff.filter((staff) => staff.id !== id);
    localStorage.setItem(STAFF_KEY, JSON.stringify(updatedStaff));
  },
};

export default staffService;
