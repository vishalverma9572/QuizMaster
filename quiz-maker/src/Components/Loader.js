import React from 'react';
import './Loader.css';
import logo from '../images/quizmaster-high-resolution-logo-black-transparent.png';

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={logo} alt="Loading..." className="loader-logo" />
      <p className="loading-text">Loading, please wait...</p>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
