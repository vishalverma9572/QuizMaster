import React, { useEffect, useState } from "react";
import "./DashBoard.css";
import MyTests from "./MyTests";
import MyResults from "./MyResults";
import CreateTest from "./CreateTest";
import TakeTest from "./TakeTest";
import Profile from "./Profile";
import Loader from "./Loader";
import QuizDetails from "./QuizDetails";
import UserGuide from "./UserGuide";
import Layout from "./Layout";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  const path = window.location.pathname.split("/")[1];
  const pathURL = window.location.pathname.split("/").join('/').substring(1);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (
    localStorage.getItem("token") === null ||
    localStorage.getItem("token") === undefined
  ) {
    localStorage.setItem("attemptedRoute", JSON.stringify({pathURL}));
    window.location.href = "/login";
  }

  const renderSection = (activeSection) => {
    if (path.startsWith("/quiz/")) {
      return <QuizDetails />;
    }
    switch (activeSection) {
      case "my-tests":
        return <MyTests />;
      case "my-results":
        return <MyResults />;
      case "create-test":
        return <CreateTest />;
      case "take-test":
        return <TakeTest />;
      case "profile":
        return <Profile />;
      case "user-guide":
        return <UserGuide />;
      default:
        return <MyTests />;
    }
  };

  return (
    <>
      {!isLoading ? (
        <Layout>{renderSection(path)}</Layout>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Dashboard;
