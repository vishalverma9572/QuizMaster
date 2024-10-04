import React, { useState, useRef } from "react";
import axios from "axios";
import "./Authorisation.css";
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
    setError("processing...");
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
    <div className="auth_container">
      <div className="form-wrapper">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h2 className="title">Forgot Password</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            ref={emailInputRef}
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

export default ForgotPassword;
