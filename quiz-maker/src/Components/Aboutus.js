import { useEffect, useState } from 'react';
import React from 'react';
import PageLoader from './PageLoader';
import { Grid, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function Aboutus() {
  if (!localStorage.getItem('token')) {
    navigate('/login');
  }
  const [Loading, setLoading] = useState(false);

  const StyledTypography = styled(Typography)({
    marginBottom: '30px',
    fontFamily: "Wittgenstein, serif",
    color: '#235',
    borderBottom: '2px solid #235',
    paddingBottom: '25px', // Adjust padding to control space between text and line
  });
  const navigate = useNavigate();
  return (
    <>
      {Loading && <PageLoader />}
      {!Loading &&
        <div style={{ padding: '20px' }}>
          <StyledTypography variant="h4">About US </StyledTypography>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#333333',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '800px',
            margin: '20px auto',
            fontWeight: 'semibold'
          }}>
            Welcome to QuizMaster, your go-to platform for everything related to quizzes! At QuizMaster, we believe in the power of learning through fun and interactive experiences. Our application allows users to create, manage, and take quizzes on a wide range of topics. Whether you're a student looking to test your knowledge, a teacher aiming to create engaging learning tools, or simply a quiz enthusiast, QuizMaster has something for you.

            We focus on user experience and performance, offering features like real-time progress tracking, detailed statistics, and seamless quiz management. Our goal is to provide a comprehensive, easy-to-use platform for quiz lovers and educators alike.

            As an open-source platform, anyone can contribute to improving QuizMaster. Join us on this exciting journey to make learning more engaging and fun!
          </p>
          <StyledTypography variant="h4">FAQs</StyledTypography>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#333333',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '800px',
            margin: '20px auto'
          }}>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}><strong>1. How do I create a quiz?</strong></p>
            <p>To create a quiz, sign in to your QuizMaster account, navigate to the "Create Quiz" section, and follow the on-screen instructions. You can add questions, set a time limit, and customize your quiz.</p>

            <p><strong style={{ fontSize: '20px', fontWeight: 'bold' }}>2. Can I track my quiz performance?</strong></p>
            <p>Yes, QuizMaster provides detailed statistics on your quizzes. You can view your performance, accuracy, and time taken for each quiz in the "My Results" section.</p>

            <p><strong style={{ fontSize: '20px', fontWeight: 'bold' }}>3. Is there a limit to the number of quizzes I can create?</strong></p>
            <p>No, you can create as many quizzes as you like. QuizMaster is designed to give you full flexibility to manage and organize your quizzes.</p>

            <p><strong style={{ fontSize: '20px', fontWeight: 'bold' }}>4. How do I reset my password?</strong></p>
            <p>If you've forgotten your password, go to the "Profile" page and click "Update Password." </p>

            <p><strong style={{ fontSize: '20px', fontWeight: 'bold' }}>5. Can I collaborate with others on quizzes?</strong></p>
            <p>At the moment, QuizMaster is designed for individual users to create and manage their quizzes. Collaborative features may be introduced in future updates.</p>

            <p><strong style={{ fontSize: '20px', fontWeight: 'bold' }}>6. How do I report a bug or request a feature?</strong></p>
            <p>As an open-source project, we welcome contributions and feedback! You can report bugs or request features by visiting our GitHub repository and opening an issue.</p>
          </div>
        </div>}

    </>
  )
}