const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }
});

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    quiz_id: { type: String, required: true, unique: true },
    questions: [QuestionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    takenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastUpdated: { type: Date, default: Date.now },
    timeLimit: { type: Number, required: true } // Add timeLimit field
});

module.exports = mongoose.model('Quiz', QuizSchema);
