import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import { toast } from "react-toastify";

const EditQuiz = () => {
    const navigate = useNavigate();
    //check user is logged in or not
    if (
        !localStorage.getItem("token") ||
        localStorage.getItem("token") === null
    ) {
        const pathURL = window.location.pathname
            .split("/")
            .join("/")
            .substring(1);
        localStorage.setItem("attemptedRoute", JSON.stringify({ pathURL }));
        window.location.href = "/login";
    }
    document.title = "Edit Quiz | QuizMaster";

    const { quiz_id } = useParams();

    // Placeholder quiz data, fetch actual data using quiz_id
    const [quizData, setQuizData] = useState({
        title: "",
        timeLimit: 0,
        questions: [
            {
                _id: "1",
                question: "Sample Question",
                options: ["Option A", "Option B"],
                correctAnswer: "Option A",
            },
        ],
    });

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/${quiz_id}`;
                const response = await fetch(url, {
                    headers: {
                        "x-auth-token": localStorage.getItem("token"),
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setQuizData(data);
                } else {
                    toast.error(data.msg, {
                        position: "top-center",
                        autoClose: 3000,
                        theme: "colored",
                        style: { backgroundColor: "white", color: "#F04438" },
                    });
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };

        fetchQuizData();
    }, [quiz_id]);

    const handleTitleChange = (e) => {
        setQuizData({ ...quizData, title: e.target.value });
    };

    const handleTimeLimitChange = (e) => {
        setQuizData({ ...quizData, timeLimit: Number(e.target.value) });
    };

    const handleQuestionChange = (index, e) => {
        const newQuestions = [...quizData.questions];
        newQuestions[index].question = e.target.value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleOptionChange = (questionIndex, optionIndex, e) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].options[optionIndex] = e.target.value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].correctAnswer =
            newQuestions[questionIndex].options[optionIndex];
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const addQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [
                ...quizData.questions,
                { question: "", options: [""], correctAnswer: "" },
            ],
        });
    };

    const removeQuestion = (index) => {
        const newQuestions = [...quizData.questions];
        if (newQuestions[index]._id) {
            return;
        }
        newQuestions.splice(index, 1);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const addOption = (questionIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].options.push("");
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const removeOption = (questionIndex, optionIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].options.splice(optionIndex, 1);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (let q of quizData.questions) {
            if (!q.correctAnswer) {
                toast.error("Please select a correct answer for each question.", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                    style: { backgroundColor: "white", color: "#F04438" },
                });
                return;
            }
        }

        try {
            const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/${quiz_id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify(quizData),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Quiz updated successfully", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                    style: { backgroundColor: "white", color: "#2d3b45" },
                  });
                navigate(`/quiz/${quiz_id}`);
            } else {
                toast.error(data.msg, {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                    style: { backgroundColor: "white", color: "#F04438" },
                });
            }
        } catch (error) {
            console.error("Error updating quiz:", error);
            toast.error("Error updating quiz. Please try again.", {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
                style: { backgroundColor: "white", color: "#F04438" },
            });
        }
    };

    return (
        <Layout>
            <div className="bg-[#0d1b2a] text-white rounded-xl ml-[5px] h-[88vh] w-[80vw] fixed overflow-scroll p-12 max-w-[800px] mx-auto">
                <h2 className="mb-5">Edit Quiz</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2 font-bold">Quiz Title</label>
                        <input
                            type="text"
                            id="title"
                            value={quizData.title}
                            onChange={handleTitleChange}
                            required
                            className="w-full p-2 rounded-lg border-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="timeLimit" className="block mb-2 font-bold">Time Limit (minutes)</label>
                        <input
                            type="number"
                            id="timeLimit"
                            value={quizData.timeLimit}
                            onChange={handleTimeLimitChange}
                            required
                            className="p-2 w-[100px] rounded-lg"
                        />
                    </div>
                    {quizData.questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-[#1a2a33] text-[#2d3b45] p-5 rounded-lg mb-5 relative">
                            <div className="mb-4">
                                <label htmlFor={`question-${qIndex}`} className="block mb-2 font-bold">Question</label>
                                <input
                                    type="text"
                                    id={`question-${qIndex}`}
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                    required
                                    className="w-full p-2 rounded-lg border-none"
                                />
                                {!q._id && (
                                    <button
                                        type="button"
                                        className="bg-[#ff4c4c] text-white rounded-lg p-2 absolute top-2 right-2"
                                        onClick={() => removeQuestion(qIndex)}
                                    >
                                        Remove Question
                                    </button>
                                )}
                            </div>
                            {q.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center mb-2">
                                    <label htmlFor={`option-${qIndex}-${oIndex}`} className="mr-2">Option {oIndex + 1}</label>
                                    <input
                                        type="text"
                                        id={`option-${qIndex}-${oIndex}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                        required
                                        className="w-full p-2 rounded-lg border-none mr-2"
                                    />
                                    <button
                                        type="button"
                                        className="bg-[#1a2a33] text-white p-2 rounded-lg"
                                        onClick={() => removeOption(qIndex, oIndex)}
                                    >
                                        Remove
                                    </button>
                                    <input
                                        type="radio"
                                        id={`correctAnswer-${qIndex}-${oIndex}`}
                                        name={`correctAnswer-${qIndex}`}
                                        checked={q.correctAnswer === option}
                                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                        className="ml-2"
                                    />
                                    <label htmlFor={`correctAnswer-${qIndex}-${oIndex}`} className="ml-1">Correct</label>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="bg-[#1a2a33] text-white p-2 rounded-lg mt-2"
                            >
                                Add Option
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="bg-[#1a2a33] text-white p-2 rounded-lg mb-4"
                    >
                        Add Question
                    </button>
                    <button
                        type="submit"
                        className="bg-[#1a2a33] text-white p-2 rounded-lg w-full"
                    >
                        Save Quiz
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default EditQuiz;