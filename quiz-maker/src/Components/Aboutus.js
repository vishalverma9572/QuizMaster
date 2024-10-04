import { useState } from "react";
import React from "react";
import Loader from "./Loader";

const FAQ_DATA = [
  {
    question: "How do I create a quiz?",
    answer:
      "To create a quiz, sign in to your QuizMaster account, navigate to the 'Create Quiz' section, and follow the on-screen instructions. You can add questions, set a time limit, and customize your quiz.",
  },
  {
    question: "Can I track my quiz performance?",
    answer:
      "Yes, QuizMaster provides detailed statistics on your quizzes. You can view your performance, accuracy, and time taken for each quiz in the 'My Results' section.",
  },
  {
    question: "Is there a limit to the number of quizzes I can create?",
    answer:
      "No, you can create as many quizzes as you like. QuizMaster is designed to give you full flexibility to manage and organize your quizzes.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "If you've forgotten your password, go to the 'Profile' page and click 'Update Password.'",
  },
  {
    question: "Can I collaborate with others on quizzes?",
    answer:
      "At the moment, QuizMaster is designed for individual users to create and manage their quizzes. Collaborative features may be introduced in future updates.",
  },
  {
    question: "How do I report a bug or request a feature?",
    answer:
      "As an open-source project, we welcome contributions and feedback! You can report bugs or request features by visiting our GitHub repository and opening an issue.",
  },
];

const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null); // state to track which accordion is open

  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  // Function to handle accordion toggle
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="p-8 bg-gray-800 text-white font-nunito">
          <h1 className="text-3xl text-center mb-8 border-b-2 border-white pb-4">
            About Us
          </h1>
          <p className="text-lg text-justify mb-8 max-w-3xl mx-auto">
            Welcome to QuizMaster, your go-to platform for everything related to
            quizzes! At QuizMaster, we believe in the power of learning through
            fun and interactive experiences. Our application allows users to
            create, manage, and take quizzes on a wide range of topics. Whether
            you're a student looking to test your knowledge, a teacher aiming to
            create engaging learning tools, or simply a quiz enthusiast,
            QuizMaster has something for you. We focus on user experience and
            performance, offering features like real-time progress tracking,
            detailed statistics, and seamless quiz management. Our goal is to
            provide a comprehensive, easy-to-use platform for quiz lovers and
            educators alike. As an open-source platform, anyone can contribute
            to improving QuizMaster. Join us on this exciting journey to make
            learning more engaging and fun!
          </p>

          <div className="faq text-center">
            <h2 className="text-4xl font-semibold mb-8">
              Frequently Asked Questions
            </h2>
            <ul className="accordion mx-auto max-w-3xl">
              {FAQ_DATA.map((item, index) => (
                <li className="my-2" key={index}>
                  <div
                    className="flex items-center justify-between w-full p-5 bg-gray-700 text-lg font-semibold cursor-pointer transition duration-200 ease-in-out hover:bg-[#1b252d]"
                    onClick={() => toggleAccordion(index)}
                  >
                    {item.question}
                    <span className={`text-2xl transition duration-500 ease-in-out ${openIndex === index ? 'rotate-[135deg]' : 'rotate-0'}`}>
                      +
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                      openIndex === index
                        ? "max-h-96 p-5 bg-gray-700"
                        : "max-h-0"
                    }`}
                  >
                    <p>{item.answer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutUs;