import React, { useEffect, useState } from "react";
import { Typography, styled } from "@mui/material";
import { Icon } from "@iconify-icon/react";
import PageLoader from "./PageLoader";
import { useNavigate } from "react-router-dom";

const MyResults = () => {
  const [Loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const StyledTypography = styled(Typography)({
    marginBottom: "30px",
    fontFamily: "Wittgenstein, serif",
    color: "#235",
    borderBottom: "2px solid #235",
    paddingBottom: "25px",
  });
  const navigate = useNavigate();

  // Check if user is logged in
  if (!localStorage.getItem("token") || localStorage.getItem("token") === null) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const url = process.env.REACT_APP_BACKEND_URL + "/quizzes/taken";
        const response = await fetch(url, {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setResults(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results", err);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <>
      {Loading && <PageLoader />}
      {!Loading && (
        <div className="bg-[#0d1b2a] rounded-xl ml-1 h-[88vh] w-[80vw] fixed overflow-y-scroll">
          <div className="sticky top-0 z-40 bg-[#0d1b2a]">
            <h1 className="text-white text-5xl font-serif p-4">My Results</h1>
            <hr className="bg-gray-400 h-[1px]" />
          </div>
          <div className="flex flex-wrap gap-5 p-5">
            {results.map((quizResult) => (
              <div
                key={quizResult.quiz_id}
                className="bg-white shadow-lg p-3 w-[300px] border border-[#235] rounded-md"
              >
                <div className="p-3">
                  <div className="text-lg font-bold mb-2 font-roboto">
                    {quizResult.title}
                  </div>
                  <div className="mb-2">Total Questions: {quizResult.numQuestions}</div>
                  <div className="font-bold text-[#173e56ee] font-wittgenstein text-right mb-2">
                    Score: {quizResult.quizScore}/{quizResult.numQuestions}
                  </div>
                  <button
                    className="flex items-center justify-between px-4 py-2 bg-[#262e59] text-white rounded-md transition duration-300 hover:bg-[#1a235b] uppercase text-sm"
                    onClick={() => (window.location.href = `/result/${quizResult.quiz_id}`)}
                  >
                    Stats
                    <span className="ml-2 text-lg font-semibold">
                      <Icon icon="arcticons:spotistats" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MyResults;