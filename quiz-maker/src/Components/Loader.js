import React from 'react';
import logo from '../images/quizmaster-high-resolution-logo-black-transparent.png';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#2d3b45] animate-fade-in">
      <img 
        src={logo} 
        alt="Loading..." 
        className="w-52 h-auto mb-10 animate-color-change" 
      />
      <p className="text-white font-roboto text-lg font-medium text-center mb-5 animate-fade-in-text">
        Loading, please wait...
      </p>
      <div 
        className="w-12 h-12 border-8 border-white/30 border-t-white rounded-full animate-spin"
      ></div>
    </div>
  );
};

export default Loader;