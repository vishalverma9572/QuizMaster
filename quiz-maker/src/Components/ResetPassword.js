import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Authorisation.css";
import logo from "../images/quizmaster-high-resolution-logo-black-transparent.png";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify password has alphanumeric and special character and min 6 digits using regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must contain at least 6 characters, including UPPER/lowercase and numbers"
      );
      passwordInputRef.current.focus();
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      confirmPasswordInputRef.current.focus();
      return;
    }

    try {
      const requestUrl = `${process.env.REACT_APP_BACKEND_URL}/users/reset-password/${token}`;
      const response = await axios.post(requestUrl, { newPassword: formData.password });
      setMessage("Password has been reset successfully. Redirecting to login...");
      setError(null);
      setFormData({
        password: "",
        confirmPassword: "",
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(err.response.data);
      setError("Invalid or expired token");
      setMessage(null);
    }
  };

  return (
    <div className="auth_container">
      <div className="form-wrapper">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h2 className="title">Reset Password</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            ref={passwordInputRef}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            ref={confirmPasswordInputRef}
            required
          />
          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
          <button className="button" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
