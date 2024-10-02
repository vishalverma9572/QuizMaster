import React from 'react'
import './UserGuide.css'
import createQuizImg from '../images/user-guide-images/CreateQuizImg.png'

const UserGuide = () => {
  return (
    <>
        <div id='header'>
            <h1>User Guide</h1>
            <hr/>
            <div id='userguide-container'>
            <h2>Table of Contents</h2>
            <div id='tableOfContent'>
                <div id='vertical-line'></div>
                <ul id='tableOfContent-items'>
                    <li className='content-item'>How to create tests?</li>
                    <li className='content-item'>Where and how to take tests?</li>
                    <li className='content-item'>See your scheduled tests</li>
                    <li className='content-item'>Results section</li>
                    <li className='content-item'>Manage your Profile</li>
                </ul>
            </div>
            <div id='introduction'>
                <span style={{textDecoration: "underline"}}>QuizMaster</span> is a comprehensive quiz application that allows users to create, take, and manage quizzes. 
                It is an easy to use quiz application with friendly user-interface with functionalities such as to view the scheduled or pending tests
                and to review the results of the quiz that have been taken.<br/>
                This is an easy-to-read user guide to help you get started with QuizMaster.
            </div>
            <div id='testCreation'>
                <h1>Create Tests</h1>
                <h3>1. How to create new test?</h3>
                <img id="user-guid-img" src={createQuizImg} alt='create-quiz'/>
                <p>
                    On the create test page, while creating a new test,&ensp;user can see the above dialog box where the user
                    can create quiz by entering the necessary details of the quiz,&ensp;such as <span style={{fontWeight: "bold"}}>Quiz Title</span>,&ensp;<span style={{fontWeight: "bold"}}>Time Limit</span>.
                    <br/>
                    The quiz maker can add various number of questions for each quiz and for each question the user can enter various options.&ensp;If a question entered is
                    wrong, user is free to remove that question.<br/>
                    For each question the user also has to specify which among the following options is the correct one.
                </p>
            </div>
            </div>
        </div>
    </>
  )
}

export default UserGuide;
