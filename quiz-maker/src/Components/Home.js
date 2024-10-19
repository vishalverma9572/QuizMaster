import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
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
        // Set the loading state to false after 2 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        // Cleanup timeout on component unmount
        return () => clearTimeout(timer);
    }, []);

    // Set the document title
    useEffect(() => {
        document.title = "Home | QuizMaster";
    }, []);

    // when the component is loaded, set isLoading to false after 2 seconds
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
                            window.width <= 820 &&
                            "flex-col items-center gap-[50px]"
                        } flex w-screen h-[92vh] relative top-[8vh]`}
                    >
                        <div
                            className={`${
                                window.width <= 820 ? "w-[99%]" : "w-[58%]"
                            }  borde r-2 border-red-600`}
                        >
                            <img
                                className=" w-[100%] h-[100%]"
                                src={img}
                                alt="img"
                            />
                        </div>
                        <div
                            className={`${
                                window.width <= 820 ? "w-[99%]" : "w-[40%]"
                            } w-[40%] flex gap-[30px] flex-col items-center justify-center bor der-2 border-green-600`}
                        >
                            <div className="bo rder border-red-600 font-extrabold gap-[10px] text-5xl flex flex-col font-sans text-cyan-500 ">
                                Welcome to{" "}
                                <TypeIt className="text-gray-800">
                                    QuizMaster
                                </TypeIt>
                            </div>
                            <div className="bor der-2 border-red-600 text-center w-[70%] font-semibold font-sans text-gray-300 text-2xl">
                                Your ultimate destination to create quizzes and
                                take quizzes. Join us to challenge your
                                knowledge and improve your skills in a fun and
                                engaging way.
                            </div>
                            <div className="mb-[100px]">
                                <img
                                    className="w-[200px]"
                                    src={logo}
                                    alt="logo"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
