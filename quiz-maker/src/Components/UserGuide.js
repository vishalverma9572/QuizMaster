import React from 'react'
import './UserGuide.css'

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
            </div>
            </div>
        </div>
    </>
  )
}

export default UserGuide;
