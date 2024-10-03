import React from 'react'
import './UserGuide.css'
import createQuizImg from '../images/user-guide-images/CreateQuizImg.png'
import quizDetImg from '../images/user-guide-images/QuizDet.png'
import editQuizImg from '../images/user-guide-images/EditQuiz.png'
import MyTestImg from '../images/user-guide-images/MyTestImg.png'
import TestImg from '../images/user-guide-images/search_quizImg.png'
import startTest from '../images/user-guide-images/startTest.png'
import startImg from '../images/user-guide-images/startImg.jpeg'
import resultsImg from '../images/user-guide-images/results-main.png'
import listImg from '../images/user-guide-images/ranking-one.jpeg'
import standingImg from '../images/user-guide-images/ranking-two.jpeg'
import profileImg from '../images/user-guide-images/profileImg.png'

const UserGuide = () => {
    const scrollCreate = ()=>{
        document.getElementById('usrg-testCreation').scrollIntoView({ behavior: 'smooth' });
    }
    const scrollTests = ()=>{
        document.getElementById('usrg-myTests').scrollIntoView({ behavior: 'smooth' });
    }
    const scrollTake = ()=>{
        document.getElementById('usrg-myTests').scrollIntoView({ behavior: 'smooth' });
    }
    const scrollResult = ()=>{
        document.getElementById('usrg-results').scrollIntoView({ behavior: 'smooth' });
    }
    const scrollProfile = ()=>{
        document.getElementById('usrg-profile').scrollIntoView({ behavior: 'smooth' });
    }
  return (
    <>
        <div id='header'>
            <h1 className='heading'>User Guide</h1>
            <hr/>
            <div id='userguide-container'>
                <h2>Table of Contents</h2>
                <div id='tableOfContent'>
                    <div id='vertical-line'></div>
                    <ul id='tableOfContent-items'>
                        <li className='content-item'><button onClick={scrollCreate}>How to create tests?</button></li>
                        <li className='content-item'><button onClick={scrollTests}>See your tests</button></li>
                        <li className='content-item'><button onClick={scrollTake}>Where and how to take tests?</button></li>
                        <li className='content-item'><button onClick={scrollResult}>Results section</button></li>
                        <li className='content-item'><button onClick={scrollProfile}>Manage your Profile</button></li>
                    </ul>
                </div>
                <div id='introduction'>
                    <span style={{textDecoration: "underline"}}>QuizMaster</span> is a comprehensive quiz application that allows users to create, take, and manage quizzes. 
                    It is an easy to use quiz application with friendly user-interface with functionalities such as to view the scheduled or pending tests
                    and to review the results of the quiz that have been taken.<br/>
                    This is an easy-to-read user guide to help you get started with QuizMaster.
                </div>
                <div id='usrg-testCreation'>
                    <h1>Create Tests</h1>
                    <h3>1.&ensp;How to create new test?</h3>
                    <img id="user-guid-img" src={createQuizImg} alt='create-quiz'/>
                    <p>
                        On the create test page, while creating a new test,&ensp;user can see the above dialog box where the user
                        can create quiz by entering the necessary details of the quiz,&ensp;such as <span style={{fontWeight: "bold"}}>Quiz Title</span>,&ensp;<span style={{fontWeight: "bold"}}>Time Limit</span>.
                        <br/>
                        The quiz maker can add various number of questions for each quiz and for each question the user can enter various options.&ensp;If a question entered is
                        wrong, user is free to remove that question.<br/>
                        For each question the user also has to specify which among the following options is the correct one.
                    </p>
                    <h3>2.&ensp;Quiz Overview</h3>
                    <img id="user-guid-img" src={quizDetImg} alt='quiz-detail'/>
                    <p>
                        After creating the quiz, quiz maker would see the overview page,&ensp;This shows the overview of the quiz the user has created.&ensp;
                        The user can edit the quiz by clicking the <span style={{fontWeight: 'bold'}}>Edit Quiz</span>.&ensp;
                        The user can also delete the quiz by clicking the <span style={{fontWeight: 'bold'}}>Delete Quiz</span>.
                    </p>
                    <h3>3.&ensp;Edit Quiz</h3>
                    <img id="user-guid-img" src={editQuizImg} alt='edit-quiz'/>
                    <p>
                        After clicking on the edit quiz, the user would see this edit quiz page to update the quiz.
                        &ensp;Here, the user can change the <span style={{fontWeight: "bold"}}>Quiz Title</span>,&ensp; <span style={{fontWeight: "bold"}}>Time limit</span>,&ensp;<span style={{fontWeight: "bold"}}>number of questions</span>,&ensp;<span style={{fontWeight: "bold"}}>options of each question</span>.
                    </p>
                </div>
                <div id='usrg-myTests'>
                    <h1>See Tests</h1>
                    <img id="user-guid-img" src={MyTestImg} alt='all-quizes'/>
                    <p>
                        Upon Clicking on <span style={{fontWeight: "bold"}}>My Tests</span>,&ensp;The user can oversee all the quizes that have been created so far.&ensp;
                        <span style={{fontWeight: "bold"}}>Details</span> button on each quiz enables user to edit and update the quiz whereas the <span style={{fontWeight: "bold"}}>Share</span> button copies the quiz id to the clipboard and
                        enables the user to share the quiz id through various sharing platforms.
                    </p>
                </div>
                <div id='usrg-myTests'>
                    <h1>Take Test</h1>
                    <h3>Step 1.</h3>
                    <img id="user-guid-img" src={TestImg} alt='test-id'/>
                    <h3>Step 2.</h3>
                    <img id="user-guid-img" src={startTest} alt='start-test'/>
                    <img id="user-guid-img" src={startImg} alt='attempt-quiz' style={{width: "55vw"}}/>
                    <p>
                        After starting the quiz, Complete the quiz and attempt all the questions of the quiz by ticking the option
                        and after all the questions are attempted, click on the <span style={{fontWeight: "bold"}}>Submit Quiz</span> button to submit the quiz.
                    </p>
                </div>
                <div id='usrg-results'>
                    <h1>See result of quiz</h1>
                    <img id="user-guid-img" src={resultsImg} alt='result'/>
                    <p>Clicking on the <span style={{fontWeight: "bold"}}>Stats</span> button will show the ranking list and the standing of attendee among other peers</p>
                    <img id="user-guid-img" src={listImg} alt='ranking'/>
                    <img id="user-guid-img" src={standingImg} alt='standing'/>
                    <p>See the <span style={{fontWeight: "bold"}}>Result Statistics</span> of the quiz along with your standing in the quiz among other attendees as <span style={{fontWeight: "bold"}}>User Scores</span></p>
                </div>
                <div id='usrg-profile'>
                    <h1>Profile Section</h1>
                    <img id="user-guid-img" src={profileImg} alt='profile-dashboard'/>
                    <p>Here, user can change the username of the account associated with the email to a different username, and also have the ability to change old password to a new password.</p>
                </div>
           </div>
        </div>
    </>
  )
}

export default UserGuide;
