import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/quizmaster-high-resolution-logo-black-transparent.png"; // Import your logo image here
import img from "../images/schoolgirls.svg";
import useWindowSize from "./UseWindowSize";
import Loader from "./Loader";
import TypeIt from "typeit-react";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const window = useWindowSize();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") !== null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "Home | QuizMaster";
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleAboutUs = () => {
    navigate("/aboutus");
  };

  const handleUserGuide = () => {
    navigate("/user-guide");
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Navbar />
          <div
            className={`${
              window.width <= 820
                ? "flex flex-col items-center gap-12"
                : "flex w-screen h-[92vh] relative top-[8vh]"
            }`}
          >
            <div
              className={`${
                window.width <= 820 ? "w-[99%] mt-20" : "w-[58%]"
              } border-2 border-transparent`}
            >
              <img className="w-full h-full" src={img} alt="schoolgirls" />
            </div>
            <div
              className={`${
                window.width <= 820 ? "w-[99%]" : "w-[40%] mt-12"
              } flex flex-col items-center gap-8`}
            >
              <div className="pt-2 text-5xl font-extrabold flex flex-col font-sans text-cyan-500">
                Welcome to{" "}
                <TypeIt className="text-gray-800">QuizMaster</TypeIt>
              </div>
              <div className="text-center w-[70%] font-semibold text-gray-300 text-2xl">
                Your ultimate destination to create quizzes and take quizzes.
                Join us to challenge your knowledge and improve your skills in a
                fun and engaging way.
              </div>
              <div className="mb-[100px]">
                <img className="w-[200px]" src={logo} alt="QuizMaster Logo" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;