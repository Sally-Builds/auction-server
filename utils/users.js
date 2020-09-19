const users = [];

//add user to chat
function userJoin(id, username, photo, room, userId) {
  const user = { id, username, photo, room, userId };

  users.push(user);

  return user;
}

//Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//user leaves room
function userLeaves(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
};
