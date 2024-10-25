import React, { useState } from "react";
import "./AuthForm.scss";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  saveUserToLocalStorage,
  authenticateUser,
} from "../../services/AuthServices";

const branches = ["Karuvatta", "Kumarapuram"];

function AuthForm({ isLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (branch === "") {
      setError("Please select a branch.");
      return;
    }

    if (isLogin) {
      const authResult = authenticateUser(email, password, branch);
      if (authResult.success) {
        const userId = authResult.user.id;
        navigate(`/home/${userId}/${branch}`);
      } else {
        setError(authResult.message);
      }
    } else {
      saveUserToLocalStorage(email, password, branch);
      const userId = `user_${new Date().getTime()}`;
      navigate(`/home/${userId}/${branch}`);
    }
  };

  const handleSwitch = () => {
    setEmail("");
    setPassword("");
    setBranch("");
    setError("");
    onSwitch();
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
        />
        <select
          value={branch}
          onChange={(e) => {
            setBranch(e.target.value);
            setError("");
          }}
          required
        >
          <option value="" disabled>
            Select your branch
          </option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button type="button" onClick={handleSwitch}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;
