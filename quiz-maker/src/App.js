
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Authorisation from "./Components/Authorisation";
import Home from "./Components/Home";
import Dashboard from "./Components/DashBoard";
import ResultPage from "./Components/Resultpage";
import QuizDetails from "./Components/QuizDetails";
import EditQuiz from "./Components/EditQuiz";
import TestPage from "./Components/TestPage";
import ForgotPassword from "./Components/ForGotPassword";
import ResetPassword from "./Components/ResetPassword";
import Aboutus from "./Components/Aboutus";
import UserGuide from "./Components/UserGuide";

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
          <Route path="/aboutus" element={<Aboutus/>} />
          <Route path="/user-guide" element={<UserGuide/>} />
          <Route path="result/:quizid" element={<ResultPage/>} />
          <Route path='quiz/:quiz_id' element={<QuizDetails/>} />
          <Route path='edit-quiz/:quiz_id' element={<EditQuiz/>} />
          <Route path="attempt/:quiz_id" element={<TestPage/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="*" element={<Home/>} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
