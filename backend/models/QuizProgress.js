const mongoose = require('mongoose');
const QuizProgressSchema = new mongoose.Schema({
    quiz_id: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [
        {
            question_id: { type: mongoose.Schema.Types.ObjectId, required: true },
            selectedOption: { type: String, required: true }
        }
    ],
    elapsedTime: { type: Number, required: true }, // Time in seconds
    completed: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
});

const QuizProgress = mongoose.model('QuizProgress', QuizProgressSchema);

module.exports = QuizProgress;
