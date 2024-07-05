const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
    quiz_id: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    answers: [
        {
            question_id: { type: mongoose.Schema.Types.ObjectId, required: true },
            selectedOption: { type: String, required: true },
            isCorrect: { type: Boolean }
        }
    ],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);
