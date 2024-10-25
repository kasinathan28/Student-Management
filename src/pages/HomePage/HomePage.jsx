import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import { useNavigate, useParams } from "react-router-dom";
import PopUp from "../../components/PopUp/PopUp";
import StudentServices from "../../services/StudentServices";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#FF637D"];

function HomePage() {
  const { branch } = useParams();
  const navigate = useNavigate();
  const [isPopup, setIsPopup] = useState(false);
  const [type, setType] = useState("");
  const [barData, setBarData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const studentDetails = await StudentServices.listStudents(branch);
      console.log(studentDetails);
      calculateBarData(studentDetails);
    };

    fetchStudentDetails();
  }, [branch]);

  const calculateBarData = (students) => {
    const classData = {};
    let revenue = 0;
    let paidAmount = 0;

    // Get the current month as a string (e.g., 'January', 'February', etc.)
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });

    students.forEach((student) => {
      const { class: studentClass, fees } = student;

      // Check if fees is an array and has valid entries
      if (Array.isArray(fees) && fees.length > 0) {
        // Find the fee for the current month
        const currentMonthFee = fees.find((fee) => fee.month === currentMonth);

        if (currentMonthFee) {
          // Add total fees to revenue
          revenue += 1000; // Assuming each month's fee is ₹1000

          // Check if the fee for the current month is paid
          if (currentMonthFee.isPaid) {
            paidAmount += 1000; // Assuming each month's fee is ₹1000
          }

          // Update classData
          if (!classData[studentClass]) {
            classData[studentClass] = { paid: 0, unpaid: 0, total: 0 };
          }
          classData[studentClass].total++; // Total students in the class
          classData[studentClass].paid += currentMonthFee.isPaid ? 1 : 0; // Count paid students
          classData[studentClass].unpaid += currentMonthFee.isPaid ? 0 : 1; // Count unpaid students
        }
      } else {
        console.warn(`Fees for student ${student.name} is not valid.`, fees);
      }
    });

    const barData = Object.entries(classData).map(([className, counts]) => ({
      name: `Class ${className}`,
      paid: counts.paid,
      unpaid: counts.unpaid,
      total: counts.total, // Include total students for tooltip
    }));

    setBarData(barData);
    setTotalRevenue(revenue);
    setTotalPaid(paidAmount);
  };

  const handleNewAdmissionClick = () => {
    setIsPopup(true);
    setType("std");
  };

  const closePopup = () => {
    setIsPopup(false);
  };

  const handelStudentPage = () => {
    navigate(`/students/${branch}`);
  };

  const handleStaffPage = () => {
    navigate(`/staff/${branch}`);
  };

  return (
    <div className="home-page">
      <div className="user-details">
        <h2>Branch: {branch}</h2>
      </div>
      <div className="contents">
        <div className="card" onClick={handleNewAdmissionClick}>
          <div className="card-item">New Admission</div>
        </div>
        <div className="card" onClick={handelStudentPage}>
          <div className="card-item">Students</div>
        </div>
        <div className="card" onClick={handleStaffPage}>
          <div className="card-item">Staffs</div>
        </div>
      </div>
      {isPopup && <PopUp onClose={closePopup} branch={branch} type={type} />}

      {/* Bar Chart Section */}
      <div className="bar-chart">
        <h3>Fees Payment Status by Class</h3>
        <BarChart width={600} height={300} data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => [
              `${value}`,
              `${props.payload.name} | Total Students: ${props.payload.total}`,
            ]}
          />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="paid" fill="#0088FE" />
          <Bar dataKey="unpaid" fill="#FF8042" />
        </BarChart>
      </div>
      <div>
        <h1>Total Revenue: ₹{Number(totalRevenue).toFixed(2)}</h1>
        <h1>Gained: ₹{Number(totalPaid).toFixed(2)}</h1>
      </div>
    </div>
  );
}

export default HomePage;
