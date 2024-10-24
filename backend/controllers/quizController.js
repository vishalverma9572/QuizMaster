const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const QuizProgress = require('../models/QuizProgress');
const User = require("../models/User")
const generateUniqueId = require('generate-unique-id');
const validations = require('../validators/validations');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Function to calculate score based on correct answers (if needed)
function calculateScore(answers, questions) {
  let score = 0;
  answers.forEach((answer) => {
    const question = questions.find(
      (q) => q._id.toString() === answer.question_id
    );
    if (question && question.correctAnswer === answer.selectedOption) {
      score++;
    }
  });
  return score;
}

function findQuartile(sortedArray, percentile) {
  const index = Math.ceil(percentile * (sortedArray.length + 1)) - 1;
  return sortedArray[index];
}

const createQuiz = catchAsync(async (req, res, next) => {
  const zodResult = validations.quizSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return next(new AppError(errors, 400));
  }

  let { title, questions, timeLimit } = zodResult.data;
  //add user_id to the quiz_id
  let quiz_id = generateUniqueId({
    length: 10,
    useLetters: true,
    useNumbers: true,
  });
  //add username to quiz_id
  //get user name
  const user = await User.findById(req.user.id);
  quiz_id = user.username + '_' + quiz_id;

  let existingQuiz = await Quiz.findOne({ quiz_id });
  if (existingQuiz) {
    return next(new AppError('Quiz ID already exists', 400));
  }

  const newQuiz = new Quiz({
    title,
    quiz_id,
    questions,
    createdBy: req.user.id,
    timeLimit,
  });

  const quiz = await newQuiz.save();
  res.status(201).json(quiz);
});

const getQuizStats = catchAsync(async (req, res, next) => {
  const quizResults = await QuizResult.find({ quiz_id: req.params.quiz_id });

  if (quizResults.length === 0) {
    return next(new AppError('No results found for this quiz', 404));
  }

  const quiz = await Quiz.findOne({ quiz_id: req.params.quiz_id });

  // Check if the user is the creator of the quiz
  if (
    quiz.createdBy.toString() !== req.user.id &&
    !quiz.takenBy.includes(req.user.id)
  ) {
    return next(new AppError('Unauthorized access', 403));
  }

  // Calculate statistics
  const scores = quizResults.map((result) => result.score);
  const sortedScores = [...scores].sort((a, b) => a - b);
  const count = sortedScores.length;

  const min = sortedScores[0];
  const max = sortedScores[count - 1];

  const sum = scores.reduce((acc, score) => acc + score, 0);
  const mean = sum / count;

  let median;
  if (count % 2 === 0) {
    median = (sortedScores[count / 2 - 1] + sortedScores[count / 2]) / 2;
  } else {
    median = sortedScores[Math.floor(count / 2)];
  }

  const lowerQuartile = findQuartile(sortedScores, 0.25);
  const upperQuartile = findQuartile(sortedScores, 0.75);

  res.json({ min, max, mean, median, lowerQuartile, upperQuartile });
});

const getQuizByUser = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id }).select(
    'title lastUpdated quiz_id timeLimit questions takenBy'
  );

  const response = quizzes.map((quiz) => ({
    title: quiz.title,
    quiz_id: quiz.quiz_id,
    lastUpdated: quiz.lastUpdated,
    numberOfQuestions: quiz.questions.length,
    numberOfTakenBy: quiz.takenBy.length,
    timeLimit: quiz.timeLimit,
  }));

  res.json(response);
});

const getQuizTakenByUser = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ takenBy: req.user.id });
  // If no quizzes found, return an empty array
  if (!quizzes || quizzes.length === 0) {
    return res.json([]);
  }

  // Prepare array to store results to be sent
  const quizzesWithDetails = [];

  // Iterate through quizzes
  for (const quiz of quizzes) {
    // Find quiz results for the current user and quiz_id
    const quizResult = await QuizResult.findOne({
      quiz_id: quiz.quiz_id,
      user_id: req.user.id,
    });

    // Calculate number of questions
    const numQuestions = quiz.questions.length;

    // Prepare the response object with required fields
    const quizDetails = {
      quiz_id: quiz.quiz_id,
      title: quiz.title,
      numQuestions,
      quizScore: quizResult ? quizResult.score : null, // Include quiz score if available
    };

    quizzesWithDetails.push(quizDetails);
  }

  res.json(quizzesWithDetails);
});

const updateQuizById = catchAsync(async (req, res, next) => {
  const zodResult = validations.quizUpdateSchema.safeParse(req.body);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => err.message).join(', ');
    return next(res.status(400).json({ msg: errors }));
  }

  const { title, timeLimit, questions } = zodResult.data;
  const { quiz_id } = req.params;

  let quiz = await Quiz.findOne({ quiz_id });

  if (!quiz) return next(new AppError('Quiz not found', 404));

  quiz.title = title || quiz.title;
  quiz.timeLimit = timeLimit || quiz.timeLimit;

  if (questions) {
    questions.forEach((q) => {
      if (q._id) {
        const existingQuestion = quiz.questions.find(
          (existingQ) => existingQ._id.toString() === q._id
        );
        if (existingQuestion) {
          existingQuestion.question = q.question;
          existingQuestion.options = q.options;
          existingQuestion.correctAnswer = q.correctAnswer;
        }
      } else {
        const newQuestion = {
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        };
        quiz.questions.push(newQuestion);
      }
    });
  }

  quiz.lastUpdated = Date.now();
  await quiz.save();

  const attendees = quiz.takenBy;

  for (const userId of attendees) {
    const userResults = await QuizResult.findOne({
      quiz_id,
      user_id: userId,
    });
    if (userResults) {
      let newScore = 0;
      const newAnswers = userResults.answers.map((answer) => {
        const question = quiz.questions.find(
          (q) => q._id.toString() === answer.question_id.toString()
        );
        if (question) {
          const isCorrect = question.correctAnswer === answer.selectedOption;
          if (isCorrect) {
            newScore += 1;
          }
          return {
            ...answer,
            isCorrect,
          };
        } else {
          return {
            ...answer,
            isCorrect: false,
          };
        }
      });

      userResults.score = newScore;
      userResults.answers = newAnswers;

      await userResults.save();
    }
  }

  res.json({ msg: 'Quiz and results updated successfully' });
});

const fetchQuizToTake = catchAsync(async (req, res, next) => {
  const { quiz_id } = req.params;

  const quiz = await Quiz.findOne({ quiz_id });

  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }

  const questionsWithoutCorrectAnswer = quiz.questions.map((question) => {
    const { correctAnswer, ...questionWithoutCorrectAnswer } =
      question.toObject();
    return questionWithoutCorrectAnswer;
  });

  const quizWithoutCorrectAnswers = {
    title: quiz.title,
    quiz_id: quiz.quiz_id,
    questions: questionsWithoutCorrectAnswer,
    createdBy: quiz.createdBy,
    lastUpdated: quiz.lastUpdated,
    timeLimit: quiz.timeLimit,
  };

  res.json(quizWithoutCorrectAnswers);
});

const searchQuiz = catchAsync(async (req, res, next) => {
  const { quiz_id } = req.params;

  let quiz = await Quiz.findOne({ quiz_id })
    .select('title lastUpdated quiz_id timeLimit questions takenBy createdBy')
    .select('-_id -__v');

  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }

  let username = 'Unknown';
  if (quiz.createdBy) {
    const user = await User.findById(quiz.createdBy);
    if (user) {
      username = user.username;
    } else {
      username = 'Unknown';
    }
  } else {
    username = 'Unknown';
  }

  quiz.takenBy = quiz.takenBy ? quiz.takenBy.length : 0;
  quiz.questions = quiz.questions ? quiz.questions.length : 0;
  const data = {
    title: quiz.title,
    quiz_id: quiz.quiz_id,
    lastUpdated: quiz.lastUpdated,
    timeLimit: quiz.timeLimit,
    questions: quiz.questions.length || 0,
    takenBy: quiz.takenBy.length || 0,
    createdBy: username,
  };

  res.json(data);
});

const markQuizAsTaken = catchAsync(async (req, res, next) => {
  const { answers } = req.body;

  let quiz = await Quiz.findOne({ quiz_id: req.params.quiz_id });

  if (!quiz) return next(new AppError('Quiz not found', 404));

  if (!quiz.takenBy.includes(req.user.id)) {
    quiz.takenBy.push(req.user.id);
    await quiz.save();
  } else {
    return next(new AppError('Quiz already taken', 400));
  }
  let quizProgress = await QuizProgress.findOne({
    quiz_id: req.params.quiz_id,
    user_id: req.user.id,
  });

  if (quizProgress) {
    quizProgress.completed = true;
    await quizProgress.save();
  }

  const processedAnswers = [];
  for (const answer of answers) {
    const { question_id, selectedOption } = answer;

    const question = quiz.questions.find(
      (q) => q._id.toString() === question_id
    );
    if (!question) {
      return next(new AppError('Question not found', 404));
    }

    processedAnswers.push({
      question_id: question_id,
      selectedOption,
    });
  }

  const score = calculateScore(processedAnswers, quiz.questions);

  const quizResult = new QuizResult({
    quiz_id: req.params.quiz_id,
    user_id: req.user.id,
    score,
    answers: processedAnswers,
  });

  await quizResult.save();

  res.json({ msg: 'Quiz marked as taken and result saved' });
});

const getResult = catchAsync(async (req, res, next) => {
  const result = await QuizResult.findOne({
    quiz_id: req.params.quiz_id,
    user_id: req.user.id,
  }).select('score');

  if (!result) return next(new AppError('Result not found', 404));
  res.json(result);
});

const checkQuizTaken = catchAsync(async (req, res, next) => {
  const { answers, elapsedTime } = req.body; 

  let quiz = await Quiz.findOne({ quiz_id: req.params.quiz_id });

  if (!quiz) return next(new AppError('Quiz not found', 404));

  let quizProgress = await QuizProgress.findOne({
    quiz_id: req.params.quiz_id,
    user_id: req.user.id,
  });

  if (!quizProgress) {
    quizProgress = new QuizProgress({
      quiz_id: req.params.quiz_id,
      user_id: req.user.id,
      answers,
      elapsedTime,
    });
  } else {
    quizProgress.answers = answers;
    quizProgress.elapsedTime = elapsedTime;
  }

  // Check if the time limit is reached
  if (elapsedTime >= quiz.timeLimit * 60) {
    // timeLimit is in minutes, elapsedTime is in seconds
    quizProgress.completed = true;

    // Calculate score
    let score = 0;
    const answersWithCorrectness = quizProgress.answers.map((answer) => {
      const question = quiz.questions.id(answer.question_id);
      const isCorrect = question.correctAnswer === answer.selectedOption;
      if (isCorrect) score += 1;
      return {
        ...answer,
        isCorrect,
      };
    });

    // Save to QuizResult
    const quizResult = new QuizResult({
      quiz_id: req.params.quiz_id,
      user_id: req.user.id,
      score,
      answers: answersWithCorrectness,
    });
    //before saving check if quiz is already taken
    const quizResultExists = await QuizResult.findOne({
      quiz_id: req.params.quiz_id,
      user_id: req.user.id,
    });
    //if quiz is already taken then return error
    if (quizResultExists) {
      return next(new AppError('Quiz already taken', 400));
    }
    //PUSH THE USER ID TO TAKEN BY
    if (!quiz.takenBy.includes(req.user.id)) {
      quiz.takenBy.push(req.user.id);
      await quiz.save();
    }
    await quizResult.save();
  }

  await quizProgress.save();

  res.json({ msg: 'Quiz progress saved' });
});

const getQuizProgress = catchAsync(async (req, res, next) => {
  const quizProgress = await QuizProgress.findOne({
    quiz_id: req.params.quiz_id,
    user_id: req.user.id,
  });
  if (!quizProgress) {
    return next(new AppError('Quiz progress not found', 404));
  }

  res.json(quizProgress);
});

const getAllUserResult = catchAsync(async (req, res, next) => {
  // Find the quiz by quiz_id
  const quiz = await Quiz.findOne({ quiz_id: req.params.quiz_id });

  // Check if quiz exists
  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }

  // Check if the user is the creator of the quiz or has taken the quiz
  if (
    quiz.createdBy.toString() !== req.user.id &&
    !quiz.takenBy.includes(req.user.id)
  ) {
    return next(new AppError('Unauthorized access', 403));
  }

  // Aggregate pipeline to match quiz_id and group scores by user_id
  const results = await QuizResult.aggregate([
    {
      $match: { quiz_id: req.params.quiz_id },
    },
    {
      $group: {
        _id: '$user_id',
        score: { $sum: '$score' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $project: {
        _id: 0,
        username: { $arrayElemAt: ['$user.username', 0] },
        score: 1,
      },
    },
  ]);

  res.json(results);
});

const getQuizStatsById = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findOne({ quiz_id: req.params.quiz_id });

  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }

  let status = 'Not taken';
  const quizProgress = await QuizProgress.findOne({
    quiz_id: req.params.quiz_id,
    user_id: req.user.id,
  });
  if (quizProgress) {
    if (quizProgress.completed) {
      status = 'Pending for Evaluation';
    } else {
      status = 'In progress';
    }
  }
  if (quiz.takenBy.includes(req.user.id)) {
    status = 'Taken';
  }
  //check in progress or pending for evaluation if status is completed

  res.json({ status });
});

const deleteQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findOneAndDelete({
    quiz_id: req.params.quiz_id,
    createdBy: req.user.id,
  });

  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }

  // Delete related quiz results
  await QuizResult.deleteMany({ quiz_id: req.params.quiz_id });

  // Delete related quiz progress
  await QuizProgress.deleteMany({ quiz_id: req.params.quiz_id });

  res.json({ msg: 'Quiz deleted successfully' });
});

const getSingleQuiz = catchAsync(async (req, res, next) => {
  const { quiz_id } = req.params;

  const quiz = await Quiz.findOne({ quiz_id, createdBy: req.user.id })
    .select('-_id -__v')
    .populate('takenBy', 'username');
  if (!quiz) return next(new AppError('Quiz not found', 404));

  const numberOfParticipants = quiz.takenBy.length;
  const lastUpdated = quiz.lastUpdated;

  res.json({ ...quiz.toObject(), numberOfParticipants, lastUpdated });
});

module.exports = {
    createQuiz,
    getQuizStats,
    getQuizByUser,
    getQuizTakenByUser,
    updateQuizById,
    fetchQuizToTake,
    searchQuiz,
    markQuizAsTaken,
    getResult,
    checkQuizTaken,
    getQuizProgress,
    getAllUserResult,
    getQuizStatsById,
    deleteQuiz,
    getSingleQuiz
};