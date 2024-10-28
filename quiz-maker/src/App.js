
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { lazy, Suspense } from "react";

const Authorisation = lazy(() => import("./Components/Authorisation"));
const Home = lazy(() => import("./Components/Home"));
const Dashboard = lazy(() => import("./Components/DashBoard"));
const ResultPage = lazy(() => import("./Components/Resultpage"));
const QuizDetails = lazy(() => import("./Components/QuizDetails"));
const EditQuiz = lazy(() => import("./Components/EditQuiz"));
const TestPage = lazy(() => import("./Components/TestPage"));
const ForgotPassword = lazy(() => import("./Components/ForGotPassword"));
const ResetPassword = lazy(() => import("./Components/ResetPassword"));
const Aboutus = lazy(() => import("./Components/Aboutus"));
const UserGuide = lazy(() => import("./Components/UserGuide"));


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Suspense><Home/></Suspense>} />
          <Route path="/register" element={<Suspense><Authorisation /></Suspense>} />
          <Route path="/dashboard" element={<Suspense><Dashboard/></Suspense>} />
          <Route path="/login" element={<Authorisation />} />
          <Route path="/my-tests" element={<Suspense><Dashboard/></Suspense>} />
          <Route path="/my-results" element={<Suspense><Dashboard/></Suspense>} />
          <Route path="/create-test" element={<Suspense><Dashboard/></Suspense>} />
          <Route path="/take-test" element={<Suspense><Dashboard/></Suspense>} />
          <Route path="/profile" element={<Suspense><Dashboard/></Suspense>} />
          <Route path="/aboutus" element={<Suspense><Aboutus/></Suspense>} />
          <Route path="/user-guide" element={<Suspense><UserGuide/></Suspense>} />
          <Route path="result/:quizid" element={<Suspense><ResultPage/></Suspense>} />
          <Route path='quiz/:quiz_id' element={<Suspense><QuizDetails/></Suspense>} />
          <Route path='edit-quiz/:quiz_id' element={<Suspense><EditQuiz/></Suspense>} />
          <Route path="attempt/:quiz_id" element={<Suspense><TestPage/></Suspense>} />
          <Route path="/forgot-password" element={<Suspense><ForgotPassword/></Suspense>} />
          <Route path="/reset-password/:token" element={<Suspense><ResetPassword/></Suspense>} />
          <Route path="*" element={<Suspense><Home/></Suspense>} />

        </Routes>
      </Router>
      <ToastContainer hideProgressBar />

    </>
  );
}

export default App;
