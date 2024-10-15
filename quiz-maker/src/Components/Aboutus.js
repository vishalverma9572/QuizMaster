import { useEffect, useState } from "react";
import React from "react";
import img from "../images/team.svg";
import PageLoader from "./PageLoader";
import { Typography, styled } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./Aboutus.css";
import Loader from "./Loader";
import Navbar from "./Navbar";
import useWindowSize from "./UseWindowSize.js";
import TypeIt from "typeit-react";

const StyledTypography = styled(Typography)(() => ({
    marginBottom: "30px",
    fontFamily: "Wittgenstein, serif",
    color: "#235",
    borderBottom: "2px solid #235",
    paddingBottom: "25px",
}));

const AboutUs = () => {
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // For search feature
    const navigate = useNavigate();
    const window = useWindowSize();
    console.log(window.width);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    }, []);

    // FAQ data
    const faqData = [
        {
            question: "How do I create a quiz?",
            answer: "To create a quiz, sign in to your QuizMaster account, navigate to the 'Create Quiz' section, and follow the on-screen instructions. You can add questions, set a time limit, and customize your quiz.",
        },
        {
            question: "Can I track my quiz performance?",
            answer: "Yes, QuizMaster provides detailed statistics on your quizzes. You can view your performance, accuracy, and time taken for each quiz in the 'My Results' section.",
        },
        {
            question: "Is there a limit to the number of quizzes I can create?",
            answer: "No, you can create as many quizzes as you like. QuizMaster is designed to give you full flexibility to manage and organize your quizzes.",
        },
        {
            question: "How do I reset my password?",
            answer: "If you've forgotten your password, go to the 'Profile' page and click 'Update Password.'",
        },
        {
            question: "Can I collaborate with others on quizzes?",
            answer: "At the moment, QuizMaster is designed for individual users to create and manage their quizzes. Collaborative features may be introduced in future updates.",
        },
        {
            question: "How do I report a bug or request a feature?",
            answer: "As an open-source project, we welcome contributions and feedback! You can report bugs or request features by visiting our GitHub repository and opening an issue.",
        },
    ];

    // Filter FAQs based on search query
    const filteredFaqs = faqData.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="flex flex-col about-us-container">
                    <Navbar />
                    <div
                        className={`${
                            window.width <= 820 &&
                            "flex-col items-center gap-[50px]"
                        } mt-[8vh] flex bord er-2 border-red-600`}
                    >
                        <div
                            className={`${
                                window.width <= 820 ? "w-[99%]" : "w-[58%]"
                            } bo rder-2 h-[92vh] border-red-600`}
                        >
                            <img
                                className=" w-[100%] h-[100%]"
                                src={img}
                                alt="team"
                            />
                        </div>
                        <div
                            className={`${
                                window.width <= 820 ? "w-[99%]" : "w-[40%]"
                            } w-[40%] flex h-[92vh] gap-[30px] flex-col items-center justify-center b order-2 border-green-600 text-black`}
                        >
                            <TypeIt className="text-cyan-500 text-5xl font-extrabold font-sans">
                                About Us
                            </TypeIt>
                            <div
                                className={`forScroll p-[10px] bg-cyan-100 rounded-lg text-center w-[90%] h-[50%] overflow-scroll font-semibold font-sans text-gray-700 text-xl`}
                            >
                                Welcome to QuizMaster, your go-to platform for
                                everything related to quizzes! At QuizMaster, we
                                believe in the power of learning through fun and
                                interactive experiences. Our application allows
                                users to create, manage, and take quizzes on a
                                wide range of topics. Whether you're a student
                                looking to test your knowledge, a teacher aiming
                                to create engaging learning tools, or simply a
                                quiz enthusiast, QuizMaster has something for
                                you. We focus on user experience and
                                performance, offering features like real-time
                                progress tracking, detailed statistics, and
                                seamless quiz management. Our goal is to provide
                                a comprehensive, easy-to-use platform for quiz
                                lovers and educators alike.
                            </div>
                            <a
                                className="w-[100px] h-[40px] flex items-center justify-center bg-blue-700 rounded-md text-white text-center font-medium"
                                href="#faq"
                            >
                                FAQs
                            </a>
                        </div>

                        {/* Search Input */}
                    </div>

                    <div
                        className="faq-search-container"
                        style={{
                            textAlign: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <h2
                            id="faq"
                            className={`text-black text-4xl font-bold font-sans mb-[80px] mt-[50px]`}
                        >
                            Frequently Asked Questions
                        </h2>
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: "10px",
                                color: "black",
                                width: "51%",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>

                    <div className="faq flex justify-center">
                        <ul className="accordion ">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, index) => (
                                    <li key={index}>
                                        <input
                                            type="checkbox"
                                            name="accordion"
                                            id={`faq-${index}`}
                                        />
                                        <label htmlFor={`faq-${index}`}>
                                            {faq.question}
                                        </label>
                                        <div className="content">
                                            <p>{faq.answer}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p>No FAQs match your search query.</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default AboutUs;
