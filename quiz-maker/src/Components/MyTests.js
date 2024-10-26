import { useEffect, useState } from "react";
import React from "react";
import PageLoader from "./PageLoader";
import axios from "axios";
import { Grid, Typography, styled } from "@mui/material";
import QuizCard from "./QuizCard";
import { useNavigate } from "react-router-dom";

export default function MyTests() {
    //check user is logged in or not
    if (!localStorage.getItem("token")) {
        navigate("/login");
    }
    const [Loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);
    const StyledTypography = styled(Typography)({
        marginBottom: "30px",
        fontFamily: "Wittgenstein, serif",
        color: "#235",
        borderBottom: "2px solid #235",
        paddingBottom: "25px", // Adjust padding to control space between text and line
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const url = process.env.REACT_APP_BACKEND_URL + "/quizzes";
                const response = await axios.get(url, {
                    headers: {
                        "x-auth-token": localStorage.getItem("token"),
                    },
                });
                setQuizzes(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quizzes", error);
            }
        };

        fetchQuizzes();
    }, []);
    const handleDetailsClick = (quiz_id) => {
        navigate(`/quiz/${quiz_id}`);
    };
    return (
        <>
            {Loading && <PageLoader />}
            {!Loading && Array.isArray(quizzes) && (
                <div
                    className="bg-[#0d1b2a] rounded-xl ml-[5px] h-[88vh] w-[80vw] fixed overflow-scroll font-roboto"
                >
                    <div className="sticky top-0 z-40 bg-[#0d1b2a]">
                        <h1 className="text-white text-5xl font-serif p-4">
                            My Tests
                        </h1>
                        <hr className="bg-gray-400 h-[1px]" />
                    </div>
                    <Grid container>
                        {quizzes.map((test) => (
                            <Grid  item xs={12} sm={6} md={4} key={test.quiz_id}>
                                <QuizCard 
                                    title={test.title}
                                    quiz_id={test.quiz_id}
                                    lastUpdated={test.lastUpdated}
                                    numberOfQuestions={test.numberOfQuestions}
                                    timeLimit={test.timeLimit}
                                    numberOfTakenBy={test.numberOfTakenBy}
                                    onDetailsClick={() =>
                                        handleDetailsClick(test.quiz_id)
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
        </>
    );
}
