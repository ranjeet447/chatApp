const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

var app = express();
app.use(express.static(path.join(__dirname,'../public')));


// app.get('/',function(req,res) {
//   res.sendFile('/index.html')
// });



var server = http.createServer(app);
var io = socketIO(server);


io.on('connection',function (socket) {
  console.log('New user connected');

  socket.on('createMessage',function (msg) {
    console.log(msg);
  });

  socket.emit('newMessage',{
    from:'john',
    text:'hellow'
  });
  socket.on('disconnect',function () {
    console.log('User Disconnected');
  });
});




const port = process.env.PORT || 3000;
server.listen(port,function () {
  console.log(`Server up on port ${port}`);
})
