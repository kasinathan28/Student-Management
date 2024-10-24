import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "@components/Header/Header";
import HomePage from "@pages/HomePage/HomePage";
import NotFound from "@components/NotFound/NotFound";
import ValidationPage from "./pages/ValidationPage/ValidationPage";
import "./App.css";
import Students from "./pages/Students/Students";

function App() {
  return (
    <Router>
      <Header>
        <Routes>
          <Route path="/" element={<ValidationPage />} />
          <Route path="/home/:userId/:branch" element={<HomePage />} />
          <Route path="/students/:branch" element={<Students />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Header>
    </Router>
  );
}

export default App;
