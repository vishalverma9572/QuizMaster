/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TakeTestPage = () => {
  const { quiz_id } = useParams();
  const [status, setStatus] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [progress, setProgress] = useState({ answers: [] });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const navigate = useNavigate();

  const progressRef = useRef(progress);
  const elapsedTimeRef = useRef(elapsedTime);

  useEffect(() => {
    const pathURL = window.location.pathname.split("/").join('/').substring(1);
    if (
      localStorage.getItem("token") === null ||
      localStorage.getItem("token") === undefined
    ) {
      localStorage.setItem("attemptedRoute", JSON.stringify({ pathURL }));
      window.location.href = "/login";
    }
    const fetchStatus = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/status/${quiz_id}`;
        const response = await fetch(url, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });

        const data = await response.json();
        setStatus(data.status);
      } catch (err) {
        console.error(err);
        setError('Error fetching quiz status');
      }
    };

    fetchStatus();
  }, [quiz_id]);

  const fetchQuiz = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/take/${quiz_id}`;
      const response = await fetch(url, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      const data = await response.json();
      setQuiz(data);
    } catch (err) {
      console.error(err);
      setError('Error fetching quiz');
    }
  };

  const fetchProgress = async () => {
    try {
      await fetchQuiz();
      const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/progress/${quiz_id}`;
      const response = await fetch(url, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      const data = await response.json();
      setProgress(data);
      setElapsedTime(data.elapsedTime);
    } catch (err) {
      console.error(err);
      setError('Error fetching progress');
    }
  };

  const handleConfirm = () => {
    setConfirmation(true);
    if (status === 'In progress') {
      fetchProgress();
    } else {
      fetchQuiz();
    }
  };

  const handleSubmit = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/take/${quiz_id}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ answers: progress?.answers || [] }),
      });

      const data = await response.json();
      navigate(`/result/${quiz_id}`);
    } catch (err) {
      console.error(err);
      setError('Error submitting quiz');
    }
  };

  const autoSaveProgress = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/progress/${quiz_id}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ answers: progressRef.current?.answers || [], elapsedTime: elapsedTimeRef.current }),
      });

      if (!response.ok) {
        throw new Error('Error saving progress');
      }
    } catch (err) {
      console.error(err);
      setError('Error saving progress');
    }
  };

  useEffect(() => {
    progressRef.current = progress;
    elapsedTimeRef.current = elapsedTime;
  }, [progress, elapsedTime]);

  useEffect(() => {
    if (confirmation && quiz) {
      const interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);

      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [confirmation, quiz]);

  useEffect(() => {
    if (confirmation && quiz) {
      const interval = setInterval(() => {
        autoSaveProgress();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [confirmation, quiz]);

  useEffect(() => {
    if (elapsedTime >= quiz?.timeLimit * 60) {
      clearInterval(timer);
      handleSubmit();
    }
  }, [elapsedTime, quiz, timer]);

  const handleOptionChange = (questionId, selectedOption) => {
    const newAnswers = [...progress.answers];
    const answerIndex = newAnswers.findIndex(a => a.question_id === questionId);

    if (answerIndex === -1) {
      newAnswers.push({ question_id: questionId, selectedOption });
    } else {
      newAnswers[answerIndex].selectedOption = selectedOption;
    }

    setProgress({ answers: newAnswers });
  }

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  const BackToDashBoard = () => {
    navigate(`/dashboard`);
  }

  function formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const second = String(seconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${second}`;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white max-w-3xl mx-auto rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold">{quiz?.title}</h2>
      <div className="flex justify-between items-center mt-4">
        <p className="text-lg font-sans">{status}</p>

        {confirmation && quiz && status !== "Taken" && (
          <div className="flex items-center bg-gray-700 p-2 rounded-lg shadow-md">
            <h3 className="text-lg">Time Left: </h3>
            <div className="ml-4 p-2 text-xl font-semibold border border-white rounded bg-gray-800">
              {formatTime(quiz.timeLimit * 60 - elapsedTime)}
            </div>
          </div>
        )}
      </div>

      {(status === "Not taken" || status === "In progress") && !confirmation && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Quiz Instructions</h3>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Ensure you have a stable internet connection.</li>
            <li>You cannot pause the quiz once started.</li>
            <li>Answer all questions to the best of your knowledge.</li>
            <li>The timer will start as soon as you confirm the instructions.</li>
          </ul>
          <button
            className="mt-6 px-6 py-3 bg-gray-700 text-white font-semibold rounded hover:bg-blue-500"
            onClick={handleConfirm}
          >
            I Understand, Start Quiz
          </button>
        </div>
      )}

      {confirmation && quiz && status !== "Taken" && (
        <div className="mt-6">
          {quiz.questions.map((question, index) => (
            <div key={question._id} className="p-4 bg-white text-gray-800 rounded shadow mb-4">
              <h4 className="italic font-semibold mb-2">Question {index + 1}</h4>
              <p className="text-lg font-medium">{question.question}</p>

              {question.options.map((option) => (
                <div key={option} className="flex items-center mt-3">
                  <input
                    id={`question-${question._id}-${option}`}
                    type="checkbox"
                    name={`question-${question._id}`}
                    value={option}
                    className="rounded border-gray-300 text-blue-500 focus:ring-0"
                    checked={
                      progress?.answers?.find(
                        (a) => a.question_id === question._id
                      )?.selectedOption === option
                    }
                    onChange={() => handleOptionChange(question._id, option)}
                  />
                  <label
                    htmlFor={`question-${question._id}-${option}`}
                    className="ml-3 text-lg font-medium text-gray-900"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}

          <button
            className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-500"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}

      {status === "Taken" && (
        <div className="mt-6 p-6 bg-gray-700 text-lg rounded-lg">
          Quiz already taken
        </div>
      )}

      <button
        className="mt-8 px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-500"
        onClick={BackToDashBoard}
      >
        <FaArrowLeft className="inline-block mr-2" /> Back to Dashboard
      </button>
    </div>
  );
};

export default TakeTestPage;