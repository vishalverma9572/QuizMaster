import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import logo from "../images/quizmaster-high-resolution-logo-black-transparent.png";

const Authorisation = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const emailInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    if (isSignUp) {
      document.title = "Sign Up | QuizMaster";
    } else {
      document.title = "Sign In | QuizMaster";
    }
  }, [isSignUp]);

  useEffect(() => {
    if (window.location.pathname === "/register") {
      setIsSignUp(true);
    }
    if (window.location.pathname === "/login") {
      setIsSignUp(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    if (isSignUp && !passwordRegex.test(formData.password)) {
      setError("Password must contain at least 6 characters, including UPPER/lowercase and numbers");
      passwordInputRef.current.focus();
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (isSignUp && !emailRegex.test(formData.email)) {
      setError("Invalid email");
      emailInputRef.current.focus();
      return;
    }

    if (isSignUp && formData.username.length < 6) {
      setError("Username must contain at least 6 characters");
      usernameInputRef.current.focus();
      return;
    } else if (formData.username.includes(" ")) {
      setError("Username must not contain spaces");
      usernameInputRef.current.focus();
      return;
    }

    const url = isSignUp ? "/users/register" : "/users/login";
    try {
      let requesturl = process.env.REACT_APP_BACKEND_URL + url;
      const response = await axios.post(requesturl, formData);
      localStorage.setItem("token", response.data.token);
      setError(null);
      setFormData({
        username: "",
        email: "",
        password: "",
      });

      navigate("/dashboard");
    } catch (err) {
      if (url === "/users/register") {
        if (err.response.data.msg === "User already exists") {
          setError("Email already exists");
          emailInputRef.current.focus();
        } else {
          setError("Username already exists try another one");
          usernameInputRef.current.focus();
        }
      }
      if (url === "/users/login") {
        setError("Invalid credentials");
      }
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    if (isSignUp) {
      navigate("/login");
    } else {
      navigate("/register");
    }
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    setError(null);
  };

  return (
    <div className="flex justify-center items-center gap-20 h-screen bg-[#2d3b45] transition-all duration-300 ease-in-out">
      <div className="bg-white p-10 rounded-lg shadow-lg border-2 border-gray-300 w-full max-w-lg mb-12 mt-12">
        <div className="flex justify-center pb-5 border-b border-[#2d3b45]">
          <img src={logo} alt="logo" className="w-48" />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#2d3b45] mb-8 font-nunito">{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              ref={usernameInputRef}
              required
              className="mb-4 p-3 border border-gray-300 rounded-md"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            ref={emailInputRef}
            required
            className="mb-4 p-3 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            ref={passwordInputRef}
            required
            className="mb-4 p-3 border border-gray-300 rounded-md"
          />
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <button className="bg-[#2d3b45] text-white p-3 rounded-md hover:bg-[#324755] transition-colors duration-300" type="submit">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="w-full flex items-center justify-between">
          <div className="mt-5 text-blue-700 hover:-translate-y-1 font-semibold cursor-pointer transition duration-300 ease-in-out" onClick={toggleForm}>
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </div>
          {!isSignUp && <div className="mt-5 text-blue-700 hover:-translate-y-1 font-semibold cursor-pointer transition duration-300 ease-in-out" onClick={() => navigate("/forgot-password")}>Forgot Password?</div>}
        </div>
      </div>
    </div>
  );
};

export default Authorisation;