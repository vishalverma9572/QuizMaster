import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import logo from "../images/quizmaster-high-resolution-logo-white-transparent.png";
import "./Layout.css";
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

        const path = location.pathname; // Get the current pathname from location
        document.title = "Dashboard | QuizMaster";

        // Check for quiz detail route
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
            <div className="layout mt-[8vh] h-[92vh]">
                <LogoutConfirmation
                    open={showConfirm}
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirm(false)}
                />

                <div
                    className={`sidebar ${
                        sidebarOpen ? "open" : ""
                    } mt-[8vh] h-[88vh] rounded-xl bg-[#0d1b2a] font-sans`}
                >
                    <nav>
                        <ul>
                            {[
                                "my-tests",
                                "my-results",
                                "create-test",
                                "take-test",
                                "profile",
                            ].map((section) => (
                                <li
                                    key={section}
                                    className={`${
                                        activeSection === section
                                            ? "active bg-[#62b6cb] hover:text-white"
                                            : ""
                                    } bord er border-red-700 m-2 rounded-xl`}
                                >
                                    <Link
                                        to={`/${section}`}
                                        onClick={() =>
                                            setActiveSection(section)
                                        }
                                    >
                                        <span className="h-[35px]">
                                            <Icon icon={getIcon(section)} />
                                        </span>
                                        {section.charAt(0).toUpperCase() +
                                            section.slice(1).replace(/-/g, " ")}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button
                        className="logout-button rounded-xl"
                        onClick={() => {
                            setShowConfirm(true);
                            setSidebarOpen(false);
                        }}
                    >
                        Logout{" "}
                        <span>
                            <Icon icon="basil:logout-outline" />
                        </span>
                    </button>
                </div>
                <div className="main-section">
                    <button className="hamburger" onClick={toggleSidebar}>
                        {sidebarOpen ? (
                            <Icon icon="material-symbols:close" />
                        ) : (
                            <Icon icon="mdi:menu" />
                        )}
                    </button>
                    <div className="layout-children"> {children} </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
