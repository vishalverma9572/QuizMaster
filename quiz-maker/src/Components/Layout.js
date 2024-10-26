import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import logo from "../images/quizmaster-high-resolution-logo-white-transparent.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmation from "./LogoutConfirmation";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

const Layout = ({ children }) => {
    const [activeSection, setActiveSection] = useState("my-tests");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const titleMap = {
        "my-tests": "My Tests | QuizMaster",
        "my-results": "My Results | QuizMaster",
        "create-test": "Create Test | QuizMaster",
        "take-test": "Take Test | QuizMaster",
        profile: "Profile | QuizMaster",
        "user-guide": "UserGuide | QuizMaster",
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        try {
            const decoded = jwtDecode(token);
            if (!decoded) {
                localStorage.removeItem("token");
                localStorage.removeItem("attemptedRoute");
                navigate("/");
            }
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("attemptedRoute");
            navigate("/");
        }

        const path = location.pathname;
        document.title = "Dashboard | QuizMaster";

        if (path.startsWith("/quiz/")) {
            setActiveSection("my-tests");
            document.title = "My Tests | QuizMaster";
        } else if (path === "/my-tests") {
            setActiveSection("my-tests");
            document.title = "My Tests | QuizMaster";
        } else if (path === "/my-results") {
            setActiveSection("my-results");
            document.title = "My Results | QuizMaster";
        } else if (path === "/create-test") {
            setActiveSection("create-test");
            document.title = "Create Test | QuizMaster";
        } else if (path === "/take-test") {
            setActiveSection("take-test");
            document.title = "Take Test | QuizMaster";
        } else if (path === "/profile") {
            setActiveSection("profile");
            document.title = "Profile | QuizMaster";
        } else if (path === "user-guide") {
            setActiveSection("user-guide");
            document.title = "UserGuide | QuizMaster";
        }
    }, [location]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const getIcon = (section) => {
        switch (section) {
            case "my-tests":
                return "healthicons:i-exam-multiple-choice-outline";
            case "my-results":
                return "healthicons:i-exam-qualification-outline";
            case "create-test":
                return "system-uicons:create";
            case "take-test":
                return "fluent:quiz-new-28-regular";
            case "profile":
                return "carbon:user-profile";
            case "user-guide":
                return "solar:book-bold";
            default:
                return "";
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("attemptedRoute");
        window.location.href = "/";
    };

    return (
        <div>
            <Navbar />
            <div className="flex mt-[8vh] h-[92vh]">
                <LogoutConfirmation
                    open={showConfirm}
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirm(false)}
                />

                <div
                    className={`fixed top-5 left-[1vw] mt-[8vh] h-[88vh] rounded-xl bg-[#0d1b2a] font-sans text-white transition-transform ease-in-out duration-300 ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } ${sidebarOpen ? "block" : "hidden"} sm:block w-64`}
                >
                    <nav>
                        <ul className="space-y-1">
                            {[
                                "my-tests",
                                "my-results",
                                "create-test",
                                "take-test",
                                "profile",
                            ].map((section) => (
                                <li
                                    key={section}
                                    className={`flex items-center cursor-pointer rounded-xl border m-2 p-4 transition duration-300 hover:text-white ${
                                        activeSection === section
                                            ? "bg-[#62b6cb]"
                                            : ""
                                    }`}
                                >
                                    <Link
                                        to={`/${section}`}
                                        className="flex items-center w-full text-lg text-inherit"
                                        onClick={() =>
                                            setActiveSection(section)
                                        }
                                    >
                                        <span className="text-2xl mr-2">
                                            <Icon icon={getIcon(section)} />
                                        </span>
                                        {section
                                            .charAt(0)
                                            .toUpperCase() +
                                            section
                                                .slice(1)
                                                .replace(/-/g, " ")}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button
                        className="w-full p-4 text-lg rounded-xl bg-[#212c34] transition-colors duration-300 hover:bg-[#13212c] flex justify-center items-center"
                        onClick={() => {
                            setShowConfirm(true);
                            setSidebarOpen(false);
                        }}
                    >
                        Logout
                        <span className="text-xl pl-2 pt-1">
                            <Icon icon="basil:logout-outline" />
                        </span>
                    </button>
                </div>

                <div
                    className={`flex-1 ml-64 p-5 overflow-y-auto transition-margin duration-300 ${
                        sidebarOpen ? "ml-64" : "ml-0"
                    }`}
                >
                    <button
                        className="absolute top-5 right-5 text-2xl sm:hidden"
                        onClick={toggleSidebar}
                    >
                        {sidebarOpen ? (
                            <Icon icon="material-symbols:close" />
                        ) : (
                            <Icon icon="mdi:menu" />
                        )}
                    </button>
                    <div className="layout-children">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Layout;