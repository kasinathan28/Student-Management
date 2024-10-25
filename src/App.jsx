import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "@components/Header/Header";
import HomePage from "@pages/HomePage/HomePage";
import NotFound from "@components/NotFound/NotFound";
import ValidationPage from "./pages/ValidationPage/ValidationPage";
import Students from "./pages/Students/Students";
import Staffs from "./pages/Staffs/Staffs";

function App() {
  return (
    <Router>
      <Header>
        <Routes>
          <Route path="/" element={<ValidationPage />} />
          <Route path="/home/:userId/:branch" element={<HomePage />} />
          <Route path="/students/:branch" element={<Students />} />
          <Route path="/staff/:branch" element={<Staffs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Header>
    </Router>
  );
}

export default App;
