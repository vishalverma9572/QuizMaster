const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ensure this is an ObjectId
  ],
});

const Converstation = mongoose.model('Conversation', conversationSchema);

module.exports = Converstation;
