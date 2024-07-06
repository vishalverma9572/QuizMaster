
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Authorisation from "./Components/Authorisation";
import Home from "./Components/Home";
import Dashboard from "./Components/DashBoard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Authorisation />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/login" element={<Authorisation />} />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
