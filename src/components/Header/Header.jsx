import React, { useContext } from "react";
import "./Header.scss";
import Logo from "@assets/react.svg";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/CommonServices";

function Header({ children }) {
  const navigate = useNavigate();
  const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="header">
      <div className="header-inner" onClick={handleHome}>
        <div className="header-left">
          <img src={Logo} alt="Logo" />
          <h1>Harisree Administration</h1>
        </div>
        <div className="header-right">
          {isUserLoggedIn && (
            <button className="log-out" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default Header;
