import React, { useEffect, useState } from 'react';
import './MyResults.css'; // Import your CSS file for styling
import {  Typography, styled } from '@mui/material';
import { Icon } from '@iconify-icon/react';
import PageLoader from './PageLoader';
import { useNavigate } from 'react-router-dom';

// Mocked data (replace with actual data fetching logic)


const MyResults = () => {
  // State to hold quiz results
  const [Loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const StyledTypography = styled(Typography)({
    marginBottom: '30px',
    fontFamily: "Wittgenstein, serif",
    color: '#235',
    borderBottom: '2px solid #235',
    paddingBottom: '25px', // Adjust padding to control space between text and line
  });
  const navigate=useNavigate();
  //check user is logged in or not
  if (!localStorage.getItem('token') || localStorage.getItem('token') === null){
    navigate('/login');
  }
  
  useEffect(() => {
    const fetchResults = async () => {
      try{
        const url = process.env.REACT_APP_BACKEND_URL + "/quizzes/taken";
        console.log(url);
        const response = await fetch(url, {
          headers: {
            "x-auth-token": localStorage.getItem('token')
          }
        });
        const data = await response.json();
        setResults(data);
        console.log(data);
        setLoading(false);
      }
      catch(err){
        console.error('Error fetching results', err);
        setLoading(false);
      }
    }
    
    fetchResults();
  }, []);

  return (
    <>
    {Loading && <PageLoader/>}
    {!Loading &&
    <div className="quiz-results-container">
      <StyledTypography variant="h4">My Results</StyledTypography>
      <div className="quiz-results">
        {results.map((quizResult) => (
          <div key={quizResult.quiz_id} className="quiz-result-card">
            <div className="card-content">
              <div className="card-title">{quizResult.title}</div>
              <div className="card-text">Total Questions: {quizResult.numQuestions}</div>
              <div className="card-text score-text">Score: {quizResult.quizScore}/{quizResult.numQuestions}</div>
              <button className="stats-button" 
              onClick={() => window.location.href = `/result/${quizResult.quiz_id}`}
              >Stats &nbsp;<span><iconify-icon icon="arcticons:spotistats"></iconify-icon></span></button>
            </div>
          </div>
        ))}
      </div>
    </div>}
    </>
  );
};

export default MyResults;

