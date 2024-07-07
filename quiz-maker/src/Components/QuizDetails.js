import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizDetails.css';

const QuizDetails = () => {
  const { quiz_id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/${quiz_id}`;
        const response = await fetch(url, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        const data = await response.json();
        if (response.ok) {
          setQuiz(data);
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };

    fetchQuiz();
  }, [quiz_id]);

  const handleDelete = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/${quiz_id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.msg);
        navigate('/dashboard');
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-quiz/${quiz_id}`);
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-details">
      <div className="buttons">
        <button onClick={() => setShowConfirmEdit(true)}>Edit Quiz</button>
        <button onClick={() => setShowConfirmDelete(true)}>Delete Quiz</button>
        <button onClick={() => navigate(`/result/${quiz_id}`)}>See Stats</button>
      </div>
      <h2>{quiz.title}</h2>
      <p><strong>Time Limit:</strong> {quiz.timeLimit} minutes</p>
      <p><strong>Last Updated:</strong> {new Date(quiz.lastUpdated).toLocaleString()}</p>
      <p><strong>Number of Participants:</strong> {quiz.numberOfParticipants}</p>
      <div className="questions">
        {quiz.questions.map((question, index) => (
          <div key={index} className="question">
            <p><strong>Question {index + 1}:</strong> {question.question}</p>
            <p><strong>Options:</strong></p>
            <ul>
              {question.options.map((option, i) => (
                <li key={i}>{option} {option === question.correctAnswer && <strong>(Correct Answer)</strong>}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {showConfirmDelete && (
        <div className="confirm-popup">
          <p>Are you sure you want to delete this quiz?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setShowConfirmDelete(false)}>No</button>
        </div>
      )}
      {showConfirmEdit && (
        <div className="confirm-popup">
          <p>Are you sure you want to edit this quiz?</p>
          <button onClick={handleEdit}>Yes</button>
          <button onClick={() => setShowConfirmEdit(false)}>No</button>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
