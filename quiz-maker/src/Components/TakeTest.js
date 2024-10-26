import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, CircularProgress, styled } from "@mui/material";

const TakeTest = () => {
    const [quizId, setQuizId] = useState("");
    const [quizDetails, setQuizDetails] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const detailsRef = useRef(null);

    const handleSearch = async () => {
        if (!quizId) {
            setError("Please enter a Quiz ID");
            return;
        }

        setError("");
        setQuizDetails(null);
        setLoading(true);

        try {
            const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/search/${quizId}`;
            const response = await fetch(url, {
                headers: {
                    "x-auth-token": localStorage.getItem("token"),
                },
            });

            if (!response.ok) {
                throw new Error("Quiz not found");
            }

            const data = await response.json();
            setQuizDetails(data);
        } catch (err) {
            setError("Quiz not found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (quizDetails && detailsRef.current) {
            detailsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [quizDetails]);

    const StyledTypography = styled(Typography)({
        margin: "20px",
        marginBottom: "50px",
        fontFamily: "Wittgenstein, serif",
        color: "#235",
        borderBottom: "2px solid #235",
        paddingBottom: "25px",
    });

    return (
        <div className="bg-[#0d1b2a] rounded-xl ml-1 h-[88vh] w-[80vw] fixed overflow-scroll">
            <div className="sticky top-0 z-40 bg-[#0d1b2a]">
                <h1 className="text-white text-5xl font-serif p-4">Take a Test</h1>
                <hr className="bg-gray-400 h-px" />
            </div>
            <div className="bg-[#1a2a33e9] text-white p-10 rounded-xl w-full max-w-[1000px] mx-auto shadow-lg font-sans">
                <div className="flex flex-col gap-8 md:flex-row">
                    <div className="bg-[#1a2a33e9] p-8 rounded-lg shadow-md flex-1">
                        <label htmlFor="quizId" className="block font-bold mb-2">
                            Enter Quiz ID:
                        </label>
                        <input
                            type="text"
                            id="quizId"
                            value={quizId}
                            onChange={(e) => setQuizId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:border-blue-500 outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-blue-500 text-white py-3 px-5 rounded-md mt-4 transition-colors hover:bg-blue-600 disabled:opacity-75"
                        >
                            {loading ? (
                                <>
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                        className="mr-2"
                                    />
                                    Searching...
                                </>
                            ) : (
                                "Search"
                            )}
                        </button>
                        {error && <div className="text-red-500 font-bold mt-4">{error}</div>}
                    </div>

                    <div className="bg-[#1a2a33e9] p-8 rounded-lg shadow-md flex-1 text-white">
                        <h3 className="text-lg font-bold text-blue-500 mb-2">
                            How to find the Quiz ID:
                        </h3>
                        <p className="mb-2">The Quiz ID is a unique identifier for each quiz. It can be found in the quiz details or provided by the quiz creator.</p>
                        <p className="mb-2">Or You can Directly access the Quiz by the link provided by quiz Creator.</p>
                        <p>An example of a Quiz ID looks like:</p>
                        <code className="bg-gray-100 p-1 rounded-md text-[#1a2a33]">6688dc5583a0a16f28596bd1987654321</code>
                    </div>
                </div>

                {quizDetails && (
                    <div ref={detailsRef} className="mt-10 bg-[#1a2a33e9] p-8 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold mb-4">Quiz Details</h3>
                        <div className="bg-[#1a2a33e9] p-5 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">{quizDetails.title}</h3>
                            <p className="mb-2"><strong>Last Updated:</strong> {new Date(quizDetails.lastUpdated).toLocaleDateString("en-GB")}</p>
                            <p className="mb-2"><strong>Owner:</strong> {quizDetails.createdBy}</p>
                            <p className="mb-2"><strong>Participants:</strong> {quizDetails.takenBy}</p>
                            <p className="mb-2"><strong>Time Limit:</strong> {quizDetails.timeLimit} minutes</p>
                            <p className="mb-2"><strong>Number of Questions:</strong> {quizDetails.questions}</p>
                            <button
                                onClick={() => navigate(`/attempt/${quizId}`)}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 transition-colors hover:bg-blue-600"
                            >
                                Attempt This Test
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TakeTest;