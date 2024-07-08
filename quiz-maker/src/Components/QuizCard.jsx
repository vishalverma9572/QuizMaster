import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Icon } from '@iconify-icon/react';

const StyledCard = styled(Card)({
  backgroundColor: '#2d3b45ed',
  color: 'white',
  borderRadius: '10px',
  margin: '10px',
  padding: '20px',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  minHeight: '280px',
});

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const Title = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '10px',
});

const Detail = styled(Typography)({
  fontSize: '1rem',
  marginBottom: '5px',
});

const StyledButton = styled(Button)({
  marginTop: '10px',
  backgroundColor: '#033248',
  color: 'white',
  '&:hover': {
    backgroundColor: '#014a7d',
  },
  marginRight: '10px',
});

const QuizCard = ({ title,quiz_id, lastUpdated, numberOfQuestions, timeLimit, numberOfTakenBy, onDetailsClick }) => {
  const shareQuiz = () => {
    copyToClipboard();
    if (navigator.share) {
      
      browsershare();
    } 
    
    

    // alert('Quiz details copied to clipboard!');
  };
  const copyToClipboard = () => {
    
    const quizLink = process.env.REACT_APP_FRONTEND_URL+"/attempt/"+quiz_id; // Replace with actual quiz link
    const message = `Check out this quiz!\nQuiz ID: ${quiz_id}\nQuiz Link: ${quizLink}`;
    navigator.clipboard.writeText(message);
    //share this message to other users
    alert('Quiz details copied to clipboard!');
  };


  const browsershare=()=>{
    const quizLink = process.env.REACT_APP_FRONTEND_URL+"/attempt/"+quiz_id;
    navigator.share({
      title: 'Check out this quiz!',
      text: `Quiz ID: ${quiz_id}`,
      url: quizLink,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing:', error));
  }

  return (
    <StyledCard>
      <StyledCardContent>
        <Title>{title.length > 50 ? title.slice(0, 50) + '...' : title}</Title>
        <Detail>Last Updated: {formatDate(new Date(lastUpdated))}</Detail>
        <Detail>Total Questions: {numberOfQuestions}</Detail>
        <Detail>Time Limit: {timeLimit} minutes</Detail>
        <Detail>Participants: {numberOfTakenBy}</Detail>
        <div className='buttons_container'>
          <StyledButton variant="contained" onClick={onDetailsClick}>Details &nbsp; <iconify-icon icon="gg:details-more"></iconify-icon> </StyledButton>
          <StyledButton variant="contained" onClick={shareQuiz}>Share &nbsp;<iconify-icon icon="material-symbols-light:share-outline"></iconify-icon> </StyledButton>
        </div>
      </StyledCardContent>
    </StyledCard>
  );
};

export default QuizCard;

function formatDate(date) {
  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day}${ordinalSuffix} ${month} ${year}`;
}

function getOrdinalSuffix(day) {
  const suffixes = ["st", "nd", "rd", "th"];
  const remainder = day % 10;
  return (day < 10 || day > 20) ? (suffixes[remainder === 1 ? 0 : remainder === 2 ? 1 : remainder === 3 ? 2 : 3]) : suffixes[3];
}
