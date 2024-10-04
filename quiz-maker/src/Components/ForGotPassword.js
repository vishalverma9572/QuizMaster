import React, { useState, useRef } from "react";
import axios from "axios";
import logo from "../images/quizmaster-high-resolution-logo-black-transparent.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const emailInputRef = useRef(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("Processing...");
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email");
      emailInputRef.current.focus();
      return;
    }

    try {
      const requestUrl = `${process.env.REACT_APP_BACKEND_URL}/users/request-reset-password`;
      const response = await axios.post(requestUrl, { email });
      setMessage("Password reset email sent. Please check your inbox.");
      setError(null);
      setEmail("");
    } catch (err) {
      console.error(err.response.data);
      setError("Email not found");
      setMessage(null);
      emailInputRef.current.focus();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#2d3b45]">
      <div className="bg-white p-10 rounded-lg shadow-lg border-2 border-gray-300 w-full max-w-lg">
        <div className="flex justify-center pb-5 border-b border-[#2d3b45]">
          <img src={logo} alt="logo" className="w-48" />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#2d3b45] mb-8 font-nunito">Forgot Password</h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            ref={emailInputRef}
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

export default ForgotPassword;