var socket =io();

socket.on('connect',function(){
  console.log('Connected to Server.');
  //
  // socket.emit('createMessage',{
  //   from:'sdkfklsan',
  //   text:'hey'
  // });
});
socket.on('disconnect',function(){
  console.log('Disconnected from Server.');
});

socket.on('newMessage',function (message) {
  console.log(message);
  var li=$('<li></li>');
  li.text(`${message.from}:${message.text}`);
  $('#messages').append(li);
});
// socket.emit('createMessage',{
//   from:'roy',
//   text:'hey'
// },function (data) {
//   console.log('Got it.',data);
// });

$('#message-form').on('submit',function (e) {
  e.preventDefault();
  socket.emit('createMessage',{
    from:'Ranjeet',
    text:$('[name=message]').val()
  },function () {

  })
});
