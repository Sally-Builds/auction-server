const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const { formatMessage, roomMsg, lastBidder } = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
} = require('./utils/users');

//integration and on God
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Auction Bot';

//Run when client connects
// io.on('connection', (socket) => {
io.on('connection', (socket) => {
  // console.log(`connected user: ${socket.id}`);
  // join room
  socket.on('joinRoom', ({ username, photo, room, userId }) => {
    const x = [];
    getRoomUsers(room).forEach((e) => x.push(e.username));
    console.log(x);
    const index = x.findIndex((e) => e === username);

    if (index !== -1) {
      console.log('user alreadry exists');
      userLeaves(socket.id);
      return socket.disconnect();
    }
    const user = userJoin(socket.id, username, photo, room, userId);

    socket.join(user.room);
    //welcome user
    socket.emit(
      'message',
      formatMessage(botName, 'AuctionBot.jpg', 'Welcome to the auction room!')
    );
    io.to(user.room).emit('lastBid', lastBidder(user.room));

    //broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(
          botName,
          'AuctionBot.jpg',
          `${user.username} has joined the auction room!`
        )
      );

    //send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen for chat message
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    roomMsg(socket.id, user.username, user.photo, user.room, msg, user.userId);
    io.to(user.room).emit(
      'message',
      formatMessage(user.username, user.photo, msg)
    );
    io.to(user.room).emit('lastBid', lastBidder(user.room));
  });
  //run when user disconnects
  socket.on('disconnect', () => {
    const user = userLeaves(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(
          botName,
          'AuctionBot.jpg',
          `${user.username} has left the auction room!`
        )
      );
      //send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;
// const DB = 'mongodb://127.0.0.1:27017/blog';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('db connected'));

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`app running on port ${port}`);
});

//test
