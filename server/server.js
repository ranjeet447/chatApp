const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const moment = require('moment');


const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
app.use(express.static(path.join(__dirname,'../public')));


var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();


io.on('connection',function (socket) {
  console.log('New user connected');

  socket.on('join',function (params,callback) {
    if(!isRealString(params.name) || !isRealString(params.group)){
      return callback('Name and group name is required.');
    }

    socket.join(params.group);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.group);

    io.to(params.group).emit('updateUserList',users.getUserList(params.group));
    // socket.leave(params.group);
    socket.emit('newMessage',generateMessage('Admin','Welcome to the chatApp'));
    socket.broadcast.to(params.group).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
    callback();
  });

  socket.on('createMessage',function (message,callback) {
    console.log(message);
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      io.to(user.group).emit('newMessage',generateMessage(user.name,message.text));
    }
    callback();
  });

  socket.on('createLocationMessage',function (coords) {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.group).emit('newLocationMessage',generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });
  socket.on('disconnect',function () {
    console.log('User Disconnected');
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.group).emit('updateUserList',users.getUserList(user.group));
      io.to(user.group).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
    }
  });
});



const port = process.env.PORT || 3000;
server.listen(port,function () {
  console.log(`Server up on port ${port}`);
})
