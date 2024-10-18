async function autoSubmitQuizzes() {
    try {
        const quizProgressList = await QuizProgress.find({ completed: false });

        for (const quizProgress of quizProgressList) {
            const quiz = await Quiz.findOne({ quiz_id: quizProgress.quiz_id });

            if (!quiz) {
                console.log(`Quiz not found for quiz_id: ${quizProgress.quiz_id}`);
                continue;
            }

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
