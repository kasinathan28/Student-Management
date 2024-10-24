import React, { useState } from "react";
import "./ValidationPage.scss";
import { useValidateUser } from "../../hooks/useValidateUser";
import AuthForm from "@components/AuthForm/AuthForm";

function ValidationPage() {
  useValidateUser();
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="validationPage">
      <AuthForm isLogin={isLogin} onSwitch={handleSwitch} />
    </div>
  );
}

export default ValidationPage;
