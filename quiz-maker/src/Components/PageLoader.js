import React from 'react';

const PageLoader = () => {
  return (
    <div className="flex flex-col items-center p-5 w-full h-screen bg-white md:-ml-5 md:mt-4">
      <div className="header-placeholder mb-10 w-11/12 md:w-4/5 h-10 bg-gradient-to-r from-black/50 via-slate-700/60 to-white animate-loading rounded"></div>
      <div className="card-placeholder mb-7 w-11/12 md:w-9/10 h-36 bg-gradient-to-r from-black/50 via-slate-700/60 to-white animate-loading rounded"></div>
      <div className="card-placeholder mb-7 w-11/12 md:w-9/10 h-36 bg-gradient-to-r from-black/50 via-slate-700/60 to-white animate-loading rounded"></div>
      <div className="paragraph-placeholder mb-5 w-11/12 md:w-5/6 h-5 bg-gradient-to-r from-black/50 via-slate-700/60 to-white animate-loading rounded"></div>
      <div className="paragraph-placeholder mb-5 w-11/12 md:w-5/6 h-5 bg-gradient-to-r from-black/50 via-slate-700/60 to-white animate-loading rounded"></div>
      <div className="paragraph-placeholder mb-5 w-11/12 md:w-5/6 h-5 bg-gradient-to-r from-black/50 via-slate-700/60 to-white animate-loading rounded"></div>
    </div>
  );
};

export default PageLoader;