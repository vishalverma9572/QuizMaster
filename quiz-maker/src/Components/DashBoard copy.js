import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { Icon } from '@iconify-icon/react';
import MyTests from './MyTests';
import MyResults from './MyResults';
import CreateTest from './CreateTest';
import TakeTest from './TakeTest';
import Profile from './Profile';
import UserGuide from './UserGuide';
import logo from '../images/quizmaster-high-resolution-logo-white-transparent.png';
import Loader from './Loader';



const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('my-tests');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const path = window.location.pathname.split('/')[1];
  useEffect(() => {
    document.title = "Dashboard | QuizMaster";
    if (path === 'my-tests') {
      setActiveSection('my-tests');
      document.title = "My Tests | QuizMaster";
    } else if (path === 'my-results') {
      setActiveSection('my-results');
      document.title = "My Results | QuizMaster";
    } else if (path === 'create-test') {
      setActiveSection('create-test');
      document.title = "Create Test | QuizMaster";
    } else if (path === 'take-test') {
      setActiveSection('take-test');
      document.title = "Take Test | QuizMaster";
    } else if (path === 'profile') {
      setActiveSection('profile');
      document.title = "Profile | QuizMaster";
    }else if (path === 'userguide'){
      setActiveSection('userguide');
      document.title = "UserGuide | QuizMaster";
    }
  }, [path]);



  
 



  if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) {
    window.location.href = "/login";
  }

  

  useEffect(() => {
    //checking if the token is present or not
    if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) {
      window.location.href = "/";

    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'my-tests':
        return <MyTests />;
      case 'my-results':
        return <MyResults />;
      case 'create-test':
        return <CreateTest />;
      case 'take-test':
        return <TakeTest />;
      case 'profile':
        return <Profile />;
      case 'userguide':
        return <UserGuide/>;
      default:
        return <MyTests />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleLinkClick = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
    //change the url
    window.history.pushState({}, '', `/${section}`);
    //changing the title of the page
    if (section === 'my-tests') {
      document.title = "My Tests | QuizMaster";
    } else if (section === 'my-results') {
      document.title = "My Results | QuizMaster";
    } else if (section === 'create-test') {
      document.title = "Create Test | QuizMaster";
    } else if (section === 'take-test') {
      document.title = "Take Test | QuizMaster";
    } else if (section === 'profile') {
      document.title = "Profile | QuizMaster";
    } else if (path === 'userguide'){
      document.title = "UserGuide | QuizMaster";
    }
  } 
  return (
    <>
      {!isLoading && (
        <div className="dashboard">
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <nav>
              <div className="logo">
                <img src={logo} alt="logo" />
              </div>
              <ul>
                <li className={activeSection === 'my-tests' ? 'active' : ''} onClick={() => handleLinkClick('my-tests')}>
                  <span><Icon icon="healthicons:i-exam-multiple-choice-outline" /></span>My Tests
                </li>
                <li className={activeSection === 'my-results' ? 'active' : ''} onClick={() => handleLinkClick('my-results')}>
                  <span><Icon icon="healthicons:i-exam-qualification-outline" /></span>My Results
                </li>
                <li className={activeSection === 'create-test' ? 'active' : ''} onClick={() => handleLinkClick('create-test')}>
                  <span><Icon icon="system-uicons:create" /></span>Create Test
                </li>
                <li className={activeSection === 'take-test' ? 'active' : ''} onClick={() => handleLinkClick('take-test')}>
                  <span><Icon icon="fluent:quiz-new-28-regular" /></span>Take Test
                </li>
                <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => handleLinkClick('profile')}>
                  <span><Icon icon="carbon:user-profile" /></span>Profile
                </li>
                <li className={activeSection === 'userguide' ? 'active' : ''} onClick={() => handleLinkClick('userguide')}>
                  <span><Icon icon="carbon:user-profile" /></span>User Guide
                </li>
              </ul>
            </nav>
            <button className="logout-button" onClick={handleLogout}>Logout <span><Icon icon="basil:logout-outline" /></span></button>
          </div>
          <div className="main-section">
            <button className="hamburger" onClick={toggleSidebar}>
              <Icon icon="mdi:menu" />
            </button>
            {renderSection()}
          </div>
        </div>
      )}
      {isLoading && <Loader />}
    </>
  );
};

export default Dashboard;
