import { useEffect, useState } from "react";
import React from "react";
import PageLoader from "./PageLoader";
import { Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Aboutus.css";
import Loader from "./Loader";

const StyledTypography = styled(Typography)(() => ({
  marginBottom: "30px",
  fontFamily: "Wittgenstein, serif",
  color: "#235",
  borderBottom: "2px solid #235",
  paddingBottom: "25px",
}));

const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="about-us-container">
          <h1 style={{ textAlign: "center" }}>About US</h1>
          <p className="about-us-description" style={{textAlign: "justify"}}>
            Welcome to QuizMaster, your go-to platform for everything related to
            quizzes! At QuizMaster, we believe in the power of learning through
            fun and interactive experiences. Our application allows users to
            create, manage, and take quizzes on a wide range of topics. Whether
            you're a student looking to test your knowledge, a teacher aiming to
            create engaging learning tools, or simply a quiz enthusiast,
            QuizMaster has something for you. We focus on user experience and
            performance, offering features like real-time progress tracking,
            detailed statistics, and seamless quiz management. Our goal is to
            provide a comprehensive, easy-to-use platform for quiz lovers and
            educators alike. As an open-source platform, anyone can contribute
            to improving QuizMaster. Join us on this exciting journey to make
            learning more engaging and fun!
          </p>

          <div class="faq">
            <h2>Frequently Asked Questions</h2>
            <ul class="accordion">
              <li>
                <input type="checkbox" name="accordion" id="first" />
                <label for="first">How do I create a quiz?</label>
                <div class="content">
                  <p>
                  To create a quiz, sign in to your QuizMaster account, navigate to the "Create Quiz" section, and follow the on-screen instructions. You can add questions, set a time limit, and customize your quiz.
                  </p>
                </div>
              </li>
              <li>
                <input type="checkbox" name="accordion" id="second" />
                <label for="second">Can I track my quiz performance?</label>
                <div class="content">
                  <p>
                  Yes, QuizMaster provides detailed statistics on your quizzes. You can view your performance, accuracy, and time taken for each quiz in the "My Results" section.
                  </p>
                </div>
              </li>
              <li>
                <input type="checkbox" name="accordion" id="third" />
                <label for="third">Is there a limit to the number of quizzes I can create?</label>
                <div class="content">
                  <p>
                  No, you can create as many quizzes as you like. QuizMaster is designed to give you full flexibility to manage and organize your quizzes.
                  </p>
                </div>
              </li>
              <li>
                <input type="checkbox" name="accordion" id="fourth" />
                <label for="fourth"> How do I reset my password?</label>
                <div class="content">
                  <p>
                  If you've forgotten your password, go to the "Profile" page and click "Update Password."
                  </p>
                </div>
              </li>
              <li>
                <input type="checkbox" name="accordion" id="fifth" />
                <label for="fifth">Can I collaborate with others on quizzes?</label>
                <div class="content">
                  <p>
                  At the moment, QuizMaster is designed for individual users to create and manage their quizzes. Collaborative features may be introduced in future updates.
                  </p>
                </div>
              </li>
              <li>
                <input type="checkbox" name="accordion" id="sixth" />
                <label for="sixth">How do I report a bug or request a feature?</label>
                <div class="content">
                  <p>
                  As an open-source project, we welcome contributions and feedback! You can report bugs or request features by visiting our GitHub repository and opening an issue.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutUs;
