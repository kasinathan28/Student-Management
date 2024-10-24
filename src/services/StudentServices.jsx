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
  // Filter students by branch if provided
  return branch
    ? students.filter((student) => student.branch === branch)
    : students;
};

// Function to remove a student by ID
const removeStudent = (id) => {
  let students = getStoredStudents(); // Fetch students from storage
  students = students.filter((student) => student.id !== id);
  saveStudents(students); // Save updated list back to localStorage
};

// Function to update a student's details
const updateStudent = (updatedStudent) => {
  let students = getStoredStudents(); // Fetch students from storage
  students = students.map((student) =>
    student.id === updatedStudent.id
      ? { ...student, ...updatedStudent }
      : student
  );
  saveStudents(students); // Save updated list back to localStorage
};


// Function to fetch the fees status of a student by ID
const fetchFeesStatus = (studentId) => {
  const students = getStoredStudents(); // Fetch students from storage
  const student = students.find((student) => student.id === studentId);

  if (student && student.feesStatus) {
    return student.feesStatus; // Assuming feesStatus is an array of monthly fee statuses
  }

  return []; // Return an empty array if no fees status found
};

export default {
  addStudent,
  listStudents,
  removeStudent,
  updateStudent, // Export the update function
  fetchFeesStatus, // Export the fees fetching function
};
