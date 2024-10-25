const STUDENT_STORAGE_KEY = "students";

const getStoredStudents = () => {
  const students = localStorage.getItem(STUDENT_STORAGE_KEY);
  return students ? JSON.parse(students) : [];
};

const saveStudents = (students) => {
  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(students));
};

const addStudent = (student) => {
  const students = getStoredStudents();
  students.push(student);
  saveStudents(students);
};

const listStudents = (branch) => {
  const students = getStoredStudents();

  return branch
    ? students.filter((student) => student.branch === branch)
    : students;
};

const removeStudent = (id) => {
  let students = getStoredStudents();
  students = students.filter((student) => student.id !== id);
  saveStudents(students);
};

const updateStudent = (studentId, updatedStudentData) => {
  // Retrieve the stored students from local storage or another source
  let students = getStoredStudents();

  // Map through students and update the one with the matching studentId
  students = students.map((student) =>
    student.id === studentId
      ? { ...student, ...updatedStudentData } // Update the student with the new data
      : student
  );

  // Save the updated students back to storage
  saveStudents(students);
};

const fetchFeesStatus = (studentId) => {
  const students = getStoredStudents(); // Fetch students from storage
  const student = students.find((student) => student.id === studentId); // Find the student by ID

  if (student) {
    // If the student is found, return their fees
    return Array.isArray(student.fees) ? student.fees : []; // Ensure fees is an array, return empty array if not
  }

  return []; // Return an empty array if the student is not found
};

export default {
  addStudent,
  getStoredStudents,
  listStudents,
  removeStudent,
  updateStudent,
  fetchFeesStatus,
};
