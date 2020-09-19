const mongoose = require('mongoose');

// username, photo, room, msg

const chatSchema = new mongoose.Schema({
  username: String,
  photo: String,
  room: String,
  msg: String,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
