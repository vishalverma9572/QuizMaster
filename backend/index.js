const express = require('express');
const cors = require('cors');
const Quiz = require('./models/Quiz');

const QuizResult = require('./models/QuizResult');
const QuizProgress = require('./models/QuizProgress');
const { connectDB } = require('./db/connectDb');

const userRouter = require("./routes/userRouter")
const quizRouter = require("./routes/quizRouter")

require('dotenv').config();

connectDB();
//auto submit quiz
async function autoSubmitQuizzes() {
    try {
        const quizProgressList = await QuizProgress.find({ completed: false });

        for (const quizProgress of quizProgressList) {
            const quiz = await Quiz.findOne({ quiz_id: quizProgress.quiz_id });

            if (!quiz) continue;

            const elapsedTime = (Date.now() - quizProgress.lastUpdated.getTime()) / 1000; // Time in seconds
            const totalElapsedTime = quizProgress.elapsedTime + elapsedTime;

            if (totalElapsedTime >= quiz.timeLimit * 60) {
                // Time limit reached, auto-submit quiz
                quizProgress.elapsedTime = totalElapsedTime;
                quizProgress.completed = true;

                let score = 0;
                const answersWithCorrectness = quizProgress.answers.map(answer => {
                    const question = quiz.questions.id(answer.question_id);
                    const isCorrect = question.correctAnswer === answer.selectedOption;
                    if (isCorrect) score += 1;
                    return {
                        ...answer,
                        isCorrect
                    };
                });

                // Check if quiz is already taken by this user
                const quizResultExists = await QuizResult.findOne({ quiz_id: quizProgress.quiz_id, user_id: quizProgress.user_id });
                if (quizResultExists) {
                    console.log(`Quiz ${quizProgress.quiz_id} already taken by user ${quizProgress.user_id}`);
                    continue; // Skip further processing
                }

                // Save QuizResult
                const quizResult = new QuizResult({
                    quiz_id: quizProgress.quiz_id,
                    user_id: quizProgress.user_id,
                    score,
                    answers: answersWithCorrectness
                });

                await quizResult.save();

                // Update Quiz takenBy if the user hasn't already taken it
                if (!quiz.takenBy.includes(quizProgress.user_id)) {
                    quiz.takenBy.push(quizProgress.user_id);
                    await quiz.save();
                }
            } else {
                // Time limit not reached, update elapsedTime
                quizProgress.elapsedTime = totalElapsedTime;
            }

            // Save the quiz progress
            quizProgress.lastUpdated = new Date();
            await quizProgress.save();
        }
    } catch (err) {
        console.error('Error in autoSubmitQuizzes:', err);
    }
    console.log('autoSubmitQuizzes ran');
}



// Periodically check every minute
setInterval(autoSubmitQuizzes, 60 * 1000);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/quizzes', quizRouter);

app.use('/', (req, res) => res.send('Hello World!'));

const PORT = process.env.PORT || 5000;
//print req res status
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));