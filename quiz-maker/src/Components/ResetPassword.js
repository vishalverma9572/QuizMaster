import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must contain at least 6 characters, including UPPER/lowercase and numbers");
      passwordInputRef.current.focus();
      return;
    }

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
    <div className="flex justify-center items-center h-screen bg-[#2d3b45]">
      <div className="bg-white p-10 rounded-lg shadow-lg border-2 border-gray-300 w-full max-w-lg">
        <div className="flex justify-center pb-5 border-b border-[#2d3b45]">
          <img src={logo} alt="logo" className="w-48" />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#2d3b45] mb-8 font-nunito">Reset Password</h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            ref={passwordInputRef}
            required
            className="mb-4 p-3 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            ref={confirmPasswordInputRef}
            required
            className="mb-4 p-3 border border-gray-300 rounded-md"
          />
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {message && <p className="text-green-600 text-center mb-4">{message}</p>}
          <button className="bg-[#2d3b45] text-white p-3 rounded-md hover:bg-[#324755] transition-colors duration-300" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;