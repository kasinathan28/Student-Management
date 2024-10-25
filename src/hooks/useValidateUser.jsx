import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useValidateUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("isUserLoggedIn"));
    if (user) {
      navigate(`/home/${user.userId}/${user.branch}`);
    } else {
      navigate("/");
    }
  }, [navigate]);
};
