import React, { useState, useEffect } from 'react';
import './EditQuiz.css';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';

const EditQuiz = () => {
    const navigate = useNavigate();
    //check user is logged in or not
    if (!localStorage.getItem('token') || localStorage.getItem('token') === null) {
      const pathURL = window.location.pathname.split("/").join('/').substring(1);
      localStorage.setItem("attemptedRoute", JSON.stringify({pathURL}));
      window.location.href = "/login";
    }
    document.title = 'Edit Quiz | QuizMaster';

  
  const { quiz_id } = useParams();

  // Placeholder quiz data, fetch actual data using quiz_id
  const [quizData, setQuizData] = useState({
    title: '',
    timeLimit: 0,
    questions: [
      {
        _id: '1',
        question: 'Sample Question',
        options: ['Option A', 'Option B'],
        correctAnswer: 'Option A',
      },
    ],
  });

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/${quiz_id}`;
        const response = await fetch(url, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        const data = await response.json();
        if (response.ok) {
          setQuizData(data);
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuizData();
  }, [quiz_id]);

  const handleTitleChange = (e) => {
    setQuizData({ ...quizData, title: e.target.value });
  };

  const handleTimeLimitChange = (e) => {
    setQuizData({ ...quizData, timeLimit: Number(e.target.value) });
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index].question = e.target.value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const newQuestions = [...quizData.questions];
    newQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...quizData.questions];
    newQuestions[questionIndex].correctAnswer = newQuestions[questionIndex].options[optionIndex];
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { question: '', options: [''], correctAnswer: '' }],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...quizData.questions];
    if (newQuestions[index]._id) {
      // If the question has an _id (indicating it's a saved question), do not allow removal
      return;
    }
    newQuestions.splice(index, 1);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...quizData.questions];
    newQuestions[questionIndex].options.push('');
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...quizData.questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let q of quizData.questions) {
      if (!q.correctAnswer) {
        alert('Please select a correct answer for each question.');
        return;
      }
    }
    
    
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/${quiz_id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(quizData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert('Quiz updated successfully');
        navigate(`/quiz/${quiz_id}`);
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Error updating quiz. Please try again.');
    }
  };

  return (
    <Layout >
    <div className="edit-quiz">
      
      <h2>Edit Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Quiz Title</label>
          <input type="text" id="title" value={quizData.title} onChange={handleTitleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="timeLimit">Time Limit (minutes)</label>
          <input
            type="number"
            id="timeLimit"
            value={quizData.timeLimit}
            onChange={handleTimeLimitChange}
            required
          />
        </div>
        {quizData.questions.map((q, qIndex) => (
          <div key={qIndex} className="question-card">
            <div className="form-group">
              <label htmlFor={`question-${qIndex}`}>Question</label>
              <input
                type="text"
                id={`question-${qIndex}`}
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
              />
              {!q._id && (
                <button type="button" className="remove-button" onClick={() => removeQuestion(qIndex)}>
                  Remove Question
                </button>
              )}
            </div>
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="form-group option-group">
                <label htmlFor={`option-${qIndex}-${oIndex}`}>Option {oIndex + 1}</label>
                <input
                  type="text"
                  id={`option-${qIndex}-${oIndex}`}
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                  required
                />
                <button type="button" onClick={() => removeOption(qIndex, oIndex)}>
                  Remove
                </button>
                <input
                  type="radio"
                  id={`correctAnswer-${qIndex}-${oIndex}`}
                  name={`correctAnswer-${qIndex}`}
                  checked={q.correctAnswer === option}
                  onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                />
                <label htmlFor={`correctAnswer-${qIndex}-${oIndex}`}>Correct</label>
              </div>
            ))}
            <button type="button" onClick={() => addOption(qIndex)}>
              Add Option
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>
        <button type="submit">Update Quiz</button>
      </form>
    </div>
    </Layout >
  );
};

export default EditQuiz;
