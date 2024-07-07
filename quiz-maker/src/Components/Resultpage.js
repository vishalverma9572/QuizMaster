import React, { useEffect, useState } from 'react';
import './ResultPage.css'; // Import your CSS file for styling
import { useParams } from 'react-router-dom'; // Assuming you use react-router-dom for routing

const ResultPage = () => {
  const { quizid } = useParams(); // Retrieve quizid from URL params
  const [quizStats, setQuizStats] = useState({});
  const [userScores, setUserScores] = useState([]);

  useEffect(() => {
    // Function to fetch quiz statistics
    const fetchQuizStats = async () => {
      try {
        const url=process.env.REACT_APP_BACKEND_URL+"/quizzes/stats/"+quizid;
        const response = await fetch(url); // Adjust API endpoint as per your backend
        if (!response.ok) {
          throw new Error('Failed to fetch quiz statistics');
        }
        const data = await response.json();
        // setQuizStats(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching quiz statistics:', error);
      }
    };

    // Function to fetch sorted user scores and ranks
    const fetchUserScores = async () => {
      try {
        const response = await fetch(`/api/${quizid}`); // Adjust API endpoint as per your backend
        if (!response.ok) {
          throw new Error('Failed to fetch user scores');
        }
        const data = await response.json();
        // Sort users by score in descending order
        const sortedUsers = data.sort((a, b) => b.score - a.score);
        console.log(sortedUsers);
        // setUserScores(sortedUsers);
      } catch (error) {
        console.error('Error fetching user scores:', error);
      }
    };

    fetchQuizStats();
    // fetchUserScores();
  }, [quizid]);

  return (
    <div className="result-page">
      <div className="stats-section">
        <h2>Quiz Statistics</h2>
        <div>
          {/* <p>Average Score: {quizStats.averageScore}</p>
          <p>Highest Score: {quizStats.highestScore}</p> */}
          {/* Add more statistics as needed */}
        </div>
      </div>

      <div className="user-scores-section">
        <h2>User Scores</h2>
        <div className="user-scores-list">
          {/* Display users in sections of 10 */}
          {userScores.map((user, index) => (
            <div key={user.userId} className="user-score-item">
              <p>{index + 1}. {user.username} - Score: {user.score}</p>
              {/* Display rank and username */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
