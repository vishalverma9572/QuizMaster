import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TestPage.css';

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
      localStorage.setItem("attemptedRoute", JSON.stringify({pathURL}));
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
      console.log(data);
    } catch (err) {
      console.error(err);
      setError('Error fetching quiz');
    }
  };

  const fetchProgress = async () => {
    try {
      // Fetch quiz first
      await fetchQuiz();

      // Fetch progress after fetching quiz
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
    console.log(progress);

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
      console.log(data);
      navigate(`/result/${quiz_id}`);
    } catch (err) {
      console.error(err);
      setError('Error submitting quiz');
    }
  };

  const autoSaveProgress = async () => {
    console.log(progressRef.current);
    console.log(elapsedTimeRef.current);
    console.log("auto save");
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

      const data = await response.json();
      console.log(data);
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

  // Autosave progress every 5 seconds with confirmation only
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
    return <div className="error">{error}</div>;
  }

  return (
    <div className="take-test">
      <h2>{quiz?.title}</h2>
      <p>Status: {status}</p>
      {(status === 'Not taken' || status === 'In progress') && !confirmation && (
        <div className="instructions">
          <h3>Quiz Instructions</h3>
          <ul>
            <li>Ensure you have a stable internet connection.</li>
            <li>You cannot pause the quiz once started.</li>
            <li>Answer all questions to the best of your knowledge.</li>
            <li>The timer will start as soon as you confirm the instructions.</li>
          </ul>
          <button className="button" onClick={handleConfirm}>I Understand, Start Quiz</button>
        </div>
      )}
      {confirmation && quiz && (
        <div>
          <p>Time Remaining: {quiz.timeLimit * 60 - elapsedTime} seconds</p>
          {quiz.questions.map((question, index) => (
            <div key={question._id} className="question-card">
              <h4>Question {index + 1}</h4>
              <p>{question.question}</p>
              {question.options.map(option => (
                <div key={option} className="option-group">
                  <input
                    type="radio"
                    id={`${question._id}-${option}`}
                    name={`question-${question._id}`}
                    value={option}
                    checked={progress?.answers?.find(a => a.question_id === question._id)?.selectedOption === option}
                    onChange={() => handleOptionChange(question._id, option)}
                  />
                  <label htmlFor={`${question._id}-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button className="button" onClick={handleSubmit}>Submit Quiz</button>
        </div>
      )}
    </div>
  );
};

export default TakeTestPage;
