var socket =io();

socket.on('connect',function(){
  console.log('Connected to Server.');

  socket.emit('createMessage',{
    name:'sdkfklsan',
    text:'hey'
  });
});
socket.on('disconnect',function(){
  console.log('Disconnected from Server.');
});

socket.on('newMessage',function (msg) {
  console.log(msg);
});
