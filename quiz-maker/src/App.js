
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Authorisation from "./Components/Authorisation";
import Home from "./Components/Home";
import Dashboard from "./Components/DashBoard";
import ResultPage from "./Components/Resultpage";
import QuizDetails from "./Components/QuizDetails";
import EditQuiz from "./Components/EditQuiz";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Authorisation />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/login" element={<Authorisation />} />
          <Route path="/my-tests" element={<Dashboard/>} />
          <Route path="/my-results" element={<Dashboard/>} />
          <Route path="/create-test" element={<Dashboard/>} />
          <Route path="/take-test" element={<Dashboard/>} />
          <Route path="/profile" element={<Dashboard/>} />
          <Route path="result/:quizid" element={<ResultPage/>} />
          <Route path='quiz/:quiz_id' element={<QuizDetails/>} />
          <Route path='edit-quiz/:quiz_id' element={<EditQuiz/>} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
