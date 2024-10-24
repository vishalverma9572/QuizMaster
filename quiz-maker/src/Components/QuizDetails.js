import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { toast } from 'react-toastify';

const QuizDetails = () => {
  const navigate = useNavigate();
  document.title = 'Details Page | QuizMaster';

  const { quiz_id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);

  if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) {
    const pathURL = window.location.pathname.split("/").join('/').substring(1);
    localStorage.setItem("attemptedRoute", JSON.stringify({ pathURL }));
    window.location.href = "/login";
  }

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
          toast.error(data.msg, {
            position: "top-center",
            autoClose: 3000,
            theme: "colored",
            style: { backgroundColor: "white", color: "#F04438" },
          });
        }
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };

    fetchQuiz();
  }, [quiz_id]);

  const handleDelete = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/quizzes/delete/${quiz_id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.msg, {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          style: { backgroundColor: "white", color: "#2d3b45" },
        });
        navigate('/dashboard');
      } else {
        toast.error(data.msg, {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          style: { backgroundColor: "white", color: "#F04438" },
        });
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
    <Layout>
      <div className="bg-[#0d1b2a] text-white rounded-xl ml-1 h-[88vh] w-[80vw] fixed overflow-scroll p-5 flex flex-col items-center">
        <div className="w-full max-w-[800px] flex justify-around mb-5">
          <button className="bg-[#1a2a33] text-white px-5 py-2 rounded hover:bg-[#13212c] w-full max-w-[200px]" onClick={() => setShowConfirmEdit(true)}>Edit Quiz</button>
          <button className="bg-[#1a2a33] text-white px-5 py-2 rounded hover:bg-[#13212c] w-full max-w-[200px]" onClick={() => setShowConfirmDelete(true)}>Delete Quiz</button>
          {quiz.numberOfParticipants > 0 && (
            <button className="bg-[#1a2a33] text-white px-5 py-2 rounded hover:bg-[#13212c] w-full max-w-[200px]" onClick={() => navigate(`/result/${quiz_id}`)}>See Stats</button>
          )}
        </div>
        <h2 className="mb-5 text-2xl font-semibold">{quiz.title}</h2>
        <p><strong>Time Limit:</strong> {quiz.timeLimit} minutes</p>
        <p><strong>Last Updated:</strong> {new Date(quiz.lastUpdated).toLocaleString()}</p>
        <p><strong>Number of Participants:</strong> {quiz.numberOfParticipants}</p>
        <p><strong>Quiz Id:</strong> {quiz.quiz_id}</p>
        <div className="w-full max-w-[800px] mt-5">
          {quiz.questions.map((question, index) => (
            <div key={index} className="bg-white text-[#2d3b45] p-5 rounded mb-5">
              <p className="mb-2"><strong>Question {index + 1}:</strong> {question.question}</p>
              <p><strong>Options:</strong></p>
              <ul className="pl-5 list-disc">
                {question.options.map((option, i) => (
                  <li key={i}>{option} {option === question.correctAnswer && <strong>(Correct Answer)</strong>}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {showConfirmDelete && (
          <div className="bg-[#2d3b45] text-white p-5 rounded fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[400px] text-center">
            <p>Are you sure you want to delete this quiz?</p>
            <button className="bg-[#1a2a33] text-white px-5 py-2 rounded hover:bg-[#13212c] w-full max-w-[200px] mx-2" onClick={handleDelete}>Yes</button>
            <button className="bg-[#1a2a33] text-white px-5 py-2 rounded hover:bg-[#13212c] w-full max-w-[200px] mx-2" onClick={() => setShowConfirmDelete(false)}>No</button>
          </div>
        )}
        {showConfirmEdit && (
          <div className="bg-[#2d3b45] text-white p-5 rounded fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[400px] text-center">
            <p>Are you sure you want to edit this quiz?</p>
            <button className="bg-[#1a2a33] text-white px-5 py-2 rounded hover:bg-[#13212c] w-full max-w-[200px] mx-2" onClick={handleEdit}>Yes</button>
            <button className="bg-[#1a2a33] text-white px-5 py-2 rounded hover:bg-[#13212c] w-full max-w-[200px] mx-2" onClick={() => setShowConfirmEdit(false)}>No</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuizDetails;