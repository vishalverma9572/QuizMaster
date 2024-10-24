import { useEffect, useState } from "react";
import React from "react";
import img from "../images/team.svg";
import { Typography, styled } from "@mui/material";
import Loader from "./Loader";
import Navbar from "./Navbar";
import useWindowSize from "./UseWindowSize.js";
import TypeIt from "typeit-react";

const AboutUs = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // For search feature
    const [openFAQIndex, setOpenFAQIndex] = useState(null); // State to track which FAQ is open
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

    // Function to handle opening and closing of FAQs
    const toggleFAQ = (index) => {
        setOpenFAQIndex(openFAQIndex === index ? null : index); // Toggle FAQ open state
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="flex flex-col items-center px-5 py-10 text-white bg-[#2d3b45] font-nunito">
                    <Navbar />

                    {/* Main Section */}
                    <div className={`mt-10 flex ${window.width <= 820 ? 'flex-col items-center gap-12' : 'justify-between w-full'}`}>

                        {/* Left Image */}
                        <div className={`${window.width <= 820 ? 'w-[99%]' : 'w-[58%]'} h-[92vh]`}>
                            <img src={img} alt="team" className="w-full h-full" />
                        </div>

                        {/* Right Content */}
                        <div className={`${window.width <= 820 ? 'w-[99%]' : 'w-[40%]'} flex flex-col items-center justify-center text-center`}>
                            <TypeIt className="text-5xl font-extrabold text-[#0d1b2a] mb-10">
                                About Us
                            </TypeIt>
                            <div className="forScroll p-4 bg-cyan-100 rounded-lg w-[90%] h-[50%] overflow-scroll text-gray-700 text-xl font-semibold">
                                Welcome to QuizMaster, your go-to platform for everything related to quizzes! At QuizMaster, we believe in the power of learning through fun and interactive experiences. Our application allows users to create, manage, and take quizzes on a wide range of topics. Whether you're a student looking to test your knowledge, a teacher aiming to create engaging learning tools, or simply a quiz enthusiast, QuizMaster has something for you. We focus on user experience and performance, offering features like real-time progress tracking, detailed statistics, and seamless quiz management. Our goal is to provide a comprehensive, easy-to-use platform for quiz lovers and educators alike.
                            </div>
                            <a href="#faq" className="mt-5 w-[100px] h-[40px] flex items-center justify-center bg-blue-700 rounded-md text-white">
                                FAQs
                            </a>
                        </div>
                    </div>

                    {/* FAQ Search Section */}
                    <div className="faq-search-container text-center my-8">
                        <h2 id="faq" className="text-4xl font-bold mb-10">
                            Frequently Asked Questions
                        </h2>
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 w-[51%] rounded-md border border-gray-300 text-black"
                        />
                    </div>

                    {/* FAQ Accordion */}
                    <div className="faq flex justify-center w-full">
                        <ul className="accordion w-full max-w-3xl">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, index) => (
                                    <li key={index} className="list-none w-full p-1">
                                        <label
                                            htmlFor={`faq-${index}`}
                                            className="flex items-center p-5 text-lg font-medium bg-[#0d1b2a] text-[#ebebeb] cursor-pointer relative mb-1 transition duration-500 ease-in-out"
                                            onClick={() => toggleFAQ(index)} // Toggle on click
                                        >
                                            {faq.question}
                                            <span
                                                className={`absolute right-5 text-3xl transition-transform duration-500 ease-in-out ${openFAQIndex === index ? 'rotate-45' : ''}`}
                                            >
                                                +
                                            </span>
                                        </label>
                                        <div
                                            className={`content bg-[#303033] text-left p-0 overflow-hidden transition-[max-height] duration-500 ease-in-out ${openFAQIndex === index ? 'max-h-[200px]' : 'max-h-0'}`}
                                        >
                                            <p className="px-5 py-6">{faq.answer}</p>
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