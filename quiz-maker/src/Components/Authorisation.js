import React, { useEffect, useRef , useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Authorisation.css";
import logo from "../images/quizmaster-high-resolution-logo-black-transparent.png";

const Authorisation = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const emailInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
//   set the document title according to the path
    useEffect(() => {
        if(isSignUp){
            document.title="Sign Up | QuizMaster";
        }
        else{
            document.title="Sign In | QuizMaster";
        }
    }, [isSignUp]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  //if url is "/register" then set isSignUp to true
  useEffect(() => {
    if(window.location.pathname==="/register"){
        setIsSignUp(true);
    }
    if(window.location.pathname==="/login"){
        setIsSignUp(false);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //verify password has alphanumaric and special haracter and min 6 digits using regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    if (isSignUp && !passwordRegex.test(formData.password)   ) {
        setError("Password must contain at least 6 characters, including UPPER/lowercase and numbers");
        passwordInputRef.current.focus();
        return;
    }
    //check if email is valid using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (isSignUp && !emailRegex.test(formData.email)  ) {
        setError("Invalid email");
        emailInputRef.current.focus();
        return;
    }
    //check if username's length is > 6
    if (isSignUp && formData.username.length < 6) {
        setError("Username must contain at least 6 characters");
        usernameInputRef.current.focus();
        return;
    }else if(formData.username.includes(" ")){
        setError("Username must not contain spaces");
        usernameInputRef.current.focus();
        return;
    }
    

    
    const url = isSignUp ? "/users/register" : "/users/login";
    try {
        let requesturl=process.env.REACT_APP_BACKEND_URL+url;
        console.log(requesturl);
      const response = await axios.post(requesturl, formData);
      console.log(response.data);
        localStorage.setItem("token", response.data.token);
        setError(null);
        setFormData({
            username: "",
            email: "",
            password: "",
        });

        navigate("/dashboard");
        
    } catch (err) {
        console.log("error");
      console.error(err.response.data);

        if(url==="/users/register"){
            if(err.response.data.msg=="User already exists"){
                setError("Email already exists");
                //set focus on email
                emailInputRef.current.focus();
            }
            else{
                setError("Username already exists try another one");
                //set focus on username
                usernameInputRef.current.focus();
                
            }
            
        }
        if(url==="/users/login"){
            setError("Invalid credentials");
        }

    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    //set the path to register or login
    if(isSignUp){
        navigate("/login");
    }
    else{
        navigate("/register");
    }
    setFormData({
        username: "",
        email: "",
        password: "",
        
    })
    setError(null);
  };

  return (
    <div className="auth_container">
      <div className="form-wrapper">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h2 className="title">{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form className="form" onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
                ref={usernameInputRef}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            ref={emailInputRef}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            ref={passwordInputRef}
            required
          />
            {error && <p className="error">{error}</p>}
          <button className="button" type="submit">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <button className="toggle-button" onClick={toggleForm}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
        {!isSignUp && <button className="toggle-button" onClick={()=>navigate("/forgot-password")}>
          Forgot Password?
        </button>}

      </div>
    </div>
  );
};

export default Authorisation;