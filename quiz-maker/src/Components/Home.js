import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../images/quizmaster-high-resolution-logo-black-transparent.png'; // Import your logo image here
import Loader from './Loader';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  // when the component is loaded, set isLoading to false after 2 seconds
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;

  // Set the document title
  document.title = 'Home | QuizMaster';

  const handleSignUp = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };


  const handleAboutUs = () => {
    navigate('/aboutus');
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="home-container">
          <div className="logo">
            <img src={logo} alt="QuizMaster Logo" />
          </div>
          <h1>Welcome to QuizMaster</h1>
          <p>
            Your ultimate destination to create quizzes and take quizzes. Join us to challenge your knowledge and improve your skills in a fun and engaging way.
          </p>
          <div className="button-container">
            <button className="button" onClick={handleSignUp}>Sign Up</button>
            <button className="button" onClick={handleSignIn}>Sign In</button>
            <button className="button" onClick={handleAboutUs}>About Us</button>
          </div>
          {isAuthenticated && (
            <div className="button-container2">
              <button className="button" onClick={handleDashboard}>Go to Dashboard</button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
