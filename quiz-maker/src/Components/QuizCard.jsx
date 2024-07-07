import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';

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
  fontFamily: "Roboto, sans-serif",

});

const Title = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '10px',
});

const Detail = styled(Typography)({
  fontSize: '1rem',
  marginBottom: '5px',
  fontFamily:'Wittgenstein, serif',
});

const StyledButton = styled(Button)({
  marginTop: '10px',
  backgroundColor: '#033248',
//   
  color: 'white',
  '&:hover': {
    backgroundColor: '#014a7d',
  },
});
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
    return (day < 10 || day > 20) ? (remainder === 1 ? suffixes[0] : (remainder === 2 ? suffixes[1] : (remainder === 3 ? suffixes[2] : suffixes[3]))) : suffixes[remainder - 1];
  }
  

const QuizCard = ({ title, lastUpdated, numberOfQuestions, timeLimit, numberOfTakenBy, onDetailsClick }) => {
  return (
    <StyledCard>
      <StyledCardContent>
        {/* crop the tilte to 50 character */}
        <Title>{title.length > 50 ? title.slice(0, 50) + '...' : title}</Title>
        {/* convert lastUpdated to date format &th Aug 2026*/}
        <Detail>Last Updated: {formatDate(new Date(lastUpdated))}</Detail>
        <Detail>Total Questions: {numberOfQuestions}</Detail>
        <Detail>Time Limit: {timeLimit} minutes</Detail>
        <Detail>Participants: {numberOfTakenBy}</Detail>
        <StyledButton variant="contained" onClick={onDetailsClick}>Details</StyledButton>
        
      </StyledCardContent>
    </StyledCard>
  );
};

export default QuizCard;
