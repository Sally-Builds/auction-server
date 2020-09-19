const moment = require('moment');
const Chat = require('../models/chatModel');

//form
function formatMessage(username, photo, text) {
  return {
    username,
    photo,
    text,
    time: moment().format('h:mm a'),
  };
}

//store messages
let msgs = [];

//Store the messages in database
Chat.find({})
  .then((res) => {
    msgs = res;
  })
  .catch((e) => console.log(e));

async function roomMsg(id, username, photo, room, msg, userId) {
  const user = { id, username, photo, room, msg, userId };
  msgs.push(user);
  await Chat.create(user);
}

//return highest bidder
function lastBidder(room) {
  const roomMsgs = msgs.filter((e) => e.room === room);
  const lastBid = roomMsgs[roomMsgs.length - 1];
  return lastBid;
}

module.exports = {
  formatMessage,
  roomMsg,
  lastBidder,
};
