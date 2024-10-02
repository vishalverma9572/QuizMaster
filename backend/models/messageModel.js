const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: String,
  senderId: String,
  recieverId: String,
  message: String,
  timestamp: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
