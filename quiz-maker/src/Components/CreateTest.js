import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, styled } from "@mui/material";
import { toast } from "react-toastify";

const CreateQuiz = () => {
  const navigate = useNavigate();

  // Check if the user is logged in
  if (!localStorage.getItem("token") || localStorage.getItem("token") === null) {
    navigate("/login");
  }

  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(null);
  const [questions, setQuestions] = useState([
    { question: "", options: [""], correctAnswer: "" },
  ]);
  const [error, setError] = useState("");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleTimeLimitChange = (e) => setTimeLimit(Number(e.target.value));

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = newQuestions[questionIndex].options[optionIndex];
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: [""], correctAnswer: "" }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let q of questions) {
      if (!q.correctAnswer) {
        setError("Please select a correct answer for each question.");
        return;
      }
    }

    if (timeLimit <= 0) {
      setError("Enter appropriate time limit. Shouldn't be 0 or negative");
      return;
    }

    try {
      const url = process.env.REACT_APP_BACKEND_URL + "/quizzes";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, questions, timeLimit }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Quiz created successfully", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          style: { backgroundColor: "white", color: "#2d3b45" },
        });
        navigate(`/quiz/${data.quiz_id}`);
      } else {
        toast.error(data.msg, {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          style: { backgroundColor: "white", color: "#F04438" },
        });
      }
    } catch (error) {
      toast.error("Error creating quiz. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        style: { backgroundColor: "white", color: "#F04438" },
      });
    }
  };

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
        <h1 className="text-white text-5xl font-serif p-4">Create Test</h1>
        <hr className="bg-gray-400 h-[1px]" />
      </div>
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1000px]">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-bold">
            Quiz Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
            className="w-full p-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="timeLimit" className="block mb-2 font-bold">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            id="timeLimit"
            value={timeLimit}
            onChange={handleTimeLimitChange}
            required
            className="w-full p-2 rounded-lg"
          />
        </div>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-[#415a77] p-5 mb-6 rounded-lg relative">
            <div className="mb-4">
              <label htmlFor={`question-${qIndex}`} className="block mb-2 font-bold">
                Question
              </label>
              <input
                type="text"
                id={`question-${qIndex}`}
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
                className="w-full p-2 rounded-lg"
              />
              <button
                type="button"
                className="bg-[#ff4c4c] text-white py-2 px-4 rounded-md absolute right-4 top-1 hover:bg-[#ff1a1a] transition transform hover:scale-105 shadow-md"
                onClick={() => removeQuestion(qIndex)}
              >
                Remove Question
              </button>
            </div>
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center mb-4">
                <label htmlFor={`option-${qIndex}-${oIndex}`} className="mr-4 font-bold">
                  Option {oIndex + 1}
                </label>
                <input
                  type="text"
                  id={`option-${qIndex}-${oIndex}`}
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                  required
                  className="p-2 rounded-lg w-full"
                />
                <button
                  type="button"
                  className="bg-[#1a2a33] text-white py-1 px-3 rounded-md ml-4 hover:bg-[#13212c] transition"
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
                  className="ml-4"
                />
                <label htmlFor={`correctAnswer-${qIndex}-${oIndex}`} className="ml-2">
                  Correct
                </label>
              </div>
            ))}
            <button
              type="button"
              className="bg-[#1a2a33] text-white py-2 px-4 rounded-md hover:bg-[#13212c] transition"
              onClick={() => addOption(qIndex)}
            >
              Add Option
            </button>
          </div>
        ))}
        {error && <p className="text-[#ff4c4c] font-bold mt-4">{error}</p>}
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="bg-[#1a2a33] text-white py-2 px-4 rounded-lg hover:bg-[#13212c] transition"
            onClick={addQuestion}
          >
            Add Question
          </button>
          <button
            type="submit"
            className="bg-[#1a2a33] text-white py-2 px-4 rounded-lg hover:bg-[#13212c] transition"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;