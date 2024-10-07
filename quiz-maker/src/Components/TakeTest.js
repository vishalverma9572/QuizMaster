import React, { useState } from 'react';
import './TakeTest.css';
import { useNavigate } from 'react-router-dom';
import { Typography, styled } from "@mui/material";

const TakeTest = () => {
  const [quizId, setQuizId] = useState('');
  const [quizDetails, setQuizDetails] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError('');
    setQuizDetails(null);

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/search/${quizId}`;
      const response = await fetch(url, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      if (!response.ok) {
        throw new Error('Quiz not found');
      }

      const data = await response.json();
      setQuizDetails(data);
    } catch (err) {
      setError('Quiz not found');
    }
  };

  const StyledTypography = styled(Typography)({
    margin: "20px",
    marginBottom: "50px",
    fontFamily: "Wittgenstein, serif",
    color: "#235",
    borderBottom: "2px solid #235",
    paddingBottom: "25px", // Adjust padding to control space between text and line
  });

  return (
    <div>
    <StyledTypography variant="h4">Take a Test</StyledTypography>
    <div className="take-test">
      {/* <h2>Take a Test</h2> */}

      {/* Flexbox layout with form and instructions side by side */}
      <div className="content-wrapper">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="quizId">Enter Quiz ID:</label>
            <input
              type="text"
              id="quizId"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
            />
          </div>
          <button className="button" onClick={handleSearch}>
            Search
          </button>
          {error && <div className="error">{error}</div>}
        </div>

        <div className="instructions-section">
          <h3>How to find the Quiz ID:</h3>
          <p>The Quiz ID is a unique identifier for each quiz. It can be found in the quiz details or provided by the quiz creator.</p>
          <p>Or You can Directly access the Quiz by the link provided by quiz Creator.</p>
          <p>An example of a Quiz ID looks like: </p>
          <code>6688dc5583a0a16f28596bd1987654321</code>
        </div>
      </div>

      {/* Separate section for quiz details */}
      {quizDetails && (
        <div className="quiz-details-section">
          <h3>Quiz Details</h3>
          <div className="quiz-card">
            <h3>{quizDetails.title}</h3>
            <p><strong>Last Updated:</strong> {new Date(quizDetails.lastUpdated).toLocaleDateString()}</p>
            <p><strong>Owner:</strong> {quizDetails.createdBy}</p>
            <p><strong>Participants:</strong> {quizDetails.takenBy}</p>
            <p><strong>Time Limit:</strong> {quizDetails.timeLimit} minutes</p>
            <p><strong>Number of Questions:</strong> {quizDetails.questions}</p>
            <button className="button" onClick={() => navigate(`/attempt/${quizId}`)}>
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