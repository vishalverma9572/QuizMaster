const express = require('express');
const auth = require('../middleware/auth');
const { createQuiz, getQuizStats, getQuizByUser, getQuizTakenByUser, updateQuizById, fetchQuizToTake, searchQuiz, markQuizAsTaken, getResult, checkQuizTaken, getQuizProgress, getAllUserResult, getQuizStatsById, deleteQuiz, getSingleQuiz } = require('../controllers/quizController');
const router = express.Router()
// router.use((req, res, next) => {
//     //printing the route url
//     console.log(req.originalUrl);
//     next();
// });
// Create Quiz


router.post('/', auth, createQuiz);

router.get('/stats/:quiz_id', auth, getQuizStats);
// Get All Quizzes by User
router.get('/', auth, getQuizByUser);
// Get All Quizzes Taken by User

router.get('/taken', auth, getQuizTakenByUser);


router.put('/:quiz_id', auth, updateQuizById);

//fetch quiz to take quiz
router.get('/take/:quiz_id', auth, fetchQuizToTake);
//search quiz by quiz_id
router.get('/search/:quiz_id', auth, searchQuiz);

// Mark Quiz as Taken
router.post('/take/:quiz_id', auth, markQuizAsTaken);

// Get Result of Specific Test
router.get('/results/:quiz_id', auth, getResult);

//save progress of quiz

//CHECK QUIZ TAKEN OR IN PROGRESS OR NOT TAKEN
router.post('/progress/:quiz_id', auth, checkQuizTaken);

//get the last progress of quiz
router.get('/progress/:quiz_id', auth, getQuizProgress);


// GET All users RESULTS OF QUIZ
router.get('/scores/:quiz_id', auth, getAllUserResult);

//quiz status
router.get('/status/:quiz_id', auth, getQuizStatsById);
//delete quiz
router.delete('/delete/:quiz_id', auth, deleteQuiz);


// Get Single Quiz by quiz_id
router.get('/:quiz_id', auth, getSingleQuiz);

module.exports = router;
