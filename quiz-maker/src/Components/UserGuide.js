import React from "react";
import { Link } from "react-router-dom";
import createQuizImg from "../images/user-guide-images/CreateQuizImg.png";
import quizDetImg from "../images/user-guide-images/QuizDet.png";
import editQuizImg from "../images/user-guide-images/EditQuiz.png";
import MyTestImg from "../images/user-guide-images/MyTestImg.png";
import TestImg from "../images/user-guide-images/search_quizImg.png";
import startTest from "../images/user-guide-images/startTest.png";
import startImg from "../images/user-guide-images/startImg.jpeg";
import resultsImg from "../images/user-guide-images/results-main.png";
import listImg from "../images/user-guide-images/ranking-one.jpeg";
import standingImg from "../images/user-guide-images/ranking-two.jpeg";
import profileImg from "../images/user-guide-images/profileImg.png";
import Navbar from "./Navbar";

const UserGuide = () => {
    const scrollCreate = () => {
        document.getElementById("usrg-testCreation").scrollIntoView({ behavior: "smooth" });
    };
    const scrollTests = () => {
        document.getElementById("usrg-myTests").scrollIntoView({ behavior: "smooth" });
    };
    const scrollTake = () => {
        document.getElementById("usrg-myTests").scrollIntoView({ behavior: "smooth" });
    };
    const scrollResult = () => {
        document.getElementById("usrg-results").scrollIntoView({ behavior: "smooth" });
    };
    const scrollProfile = () => {
        document.getElementById("usrg-profile").scrollIntoView({ behavior: "smooth" });
    };
    
    return (
        <>
            <div className="flex justify-center items-center">
                <Navbar />
                <div id="header" className="mt-[11vh] w-[97.5vw] h-[88vh] overflow-scroll bg-[#0d1b2a] rounded-xl border-2 border-cyan-500 p-5 text-white">
                    <h1 className="text-3xl">User Guide</h1>
                    <hr className="h-[3px] bg-black my-12" />
                    
                    <div id="userguide-container" className="mx-10">
                        <h2 className="text-center text-[2.5rem]">Table of Contents</h2>
                        <hr className="w-[35%] mx-auto mb-12" />

                        <div id="tableOfContent" className="flex justify-around">
                            <ul id="tableOfContent-items" className="flex flex-wrap justify-between list-none">
                                <li className="p-2 cursor-pointer leading-[25px]">
                                    <button onClick={scrollCreate} className="transition-transform transform hover:scale-[1.1] border-2 border-[#00ffff] bg-transparent text-white py-2 px-4 rounded-lg hover:bg-[#00ffff] hover:text-black">
                                        How to create tests?
                                    </button>
                                </li>
                                <li className="p-2 cursor-pointer leading-[25px]">
                                    <button onClick={scrollTests} className="transition-transform transform hover:scale-[1.1] border-2 border-[#00ffff] bg-transparent text-white py-2 px-4 rounded-lg hover:bg-[#00ffff] hover:text-black">
                                        See your tests
                                    </button>
                                </li>
                                <li className="p-2 cursor-pointer leading-[25px]">
                                    <button onClick={scrollTake} className="transition-transform transform hover:scale-[1.1] border-2 border-[#00ffff] bg-transparent text-white py-2 px-4 rounded-lg hover:bg-[#00ffff] hover:text-black">
                                        Where and how to take tests?
                                    </button>
                                </li>
                                <li className="p-2 cursor-pointer leading-[25px]">
                                    <button onClick={scrollResult} className="transition-transform transform hover:scale-[1.1] border-2 border-[#00ffff] bg-transparent text-white py-2 px-4 rounded-lg hover:bg-[#00ffff] hover:text-black">
                                        Results section
                                    </button>
                                </li>
                                <li className="p-2 cursor-pointer leading-[25px]">
                                    <button onClick={scrollProfile} className="transition-transform transform hover:scale-[1.1] border-2 border-[#00ffff] bg-transparent text-white py-2 px-4 rounded-lg hover:bg-[#00ffff] hover:text-black">
                                        Manage your Profile
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div id="introduction" className="my-12">
                            <Link to="/" className="underline text-cyan">
                                QuizMaster
                            </Link>{" "}
                            is a comprehensive quiz application that allows users to create, take, and manage quizzes. It is an easy-to-use quiz application with a friendly user-interface...
                        </div>

                        <div id="usrg-testCreation" className="mb-12">
                            <h1 className="text-2xl underline mb-5">Create Tests</h1>
                            <h3 className="text-xl mb-2">1.&ensp;How to create new test?</h3>
                            <img id="user-guid-img" src={createQuizImg} alt="create-quiz" className="w-[50vw] mx-auto" />
                            <p className="py-2">
                                On the create test page, while creating a new test, the user can see the above dialog box...
                            </p>
                            <h3 className="text-xl underline mb-2">2.&ensp;Quiz Overview</h3>
                            <img id="user-guid-img" src={quizDetImg} alt="quiz-detail" className="w-[50vw] mx-auto" />
                            <p className="py-2">
                                After creating the quiz, the quiz maker would see the overview page...
                            </p>
                            <h3 className="text-xl underline mb-2">3.&ensp;Edit Quiz</h3>
                            <img id="user-guid-img" src={editQuizImg} alt="edit-quiz" className="w-[50vw] mx-auto" />
                            <p className="py-2">
                                After clicking on "Edit Quiz", the user would see this edit quiz page...
                            </p>
                        </div>

                        <div id="usrg-myTests" className="mb-12">
                            <h1 className="text-2xl underline mb-5">See Tests</h1>
                            <img id="user-guid-img" src={MyTestImg} alt="all-quizes" className="w-[50vw] mx-auto" />
                            <p className="py-2">
                                Upon Clicking on <span className="font-bold">My Tests</span>, the user can oversee all the quizzes...
                            </p>
                        </div>

                        <div id="usrg-results" className="mb-12">
                            <h1 className="text-2xl underline mb-5">See result of quiz</h1>
                            <img id="user-guid-img" src={resultsImg} alt="result" className="w-[50vw] mx-auto" />
                            <p className="py-2">
                                Clicking on the <span className="font-bold">Stats</span> button will show the ranking list...
                            </p>
                            <img id="user-guid-img" src={listImg} alt="ranking" className="w-[50vw] mx-auto" />
                            <img id="user-guid-img" src={standingImg} alt="standing" className="w-[50vw] mx-auto" />
                            <p className="py-2">
                                See the <span className="font-bold">Result Statistics</span>...
                            </p>
                        </div>

                        <div id="usrg-profile" className="my-12">
                            <h1 className="text-2xl underline mb-5">Manage Profile</h1>
                            <img id="user-guid-img" src={profileImg} alt="profile-img" className="w-[50vw] mx-auto" />
                            <p className="py-2">
                                In the profile section, the user can change the profile photo...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserGuide;