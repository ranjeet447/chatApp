const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

var app = express();
app.use(express.static(path.join(__dirname,'../public')));



app.get('/',function (req,res) {
  res.sendFile('index.html');
})


var server = http.createServer(app);
var io = socketIO(server);


io.on('connection',function (socket) {
  console.log('New user connected');

  socket.emit('newMessage',generateMessage('Admin','Welcome to the chatApp'));
  socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

  socket.on('createMessage',function (message,callback) {
    console.log(message);
    io.emit('newMessage',generateMessage(message.from,message.text));
    callback('This is from the server.');
  });

  socket.on('disconnect',function () {
    console.log('User Disconnected');
  });
});



const port = process.env.PORT || 3000;
server.listen(port,function () {
  console.log(`Server up on port ${port}`);
})
