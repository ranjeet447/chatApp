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
socket.on('newLocationMessage',function (message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My Current Location</a>');

  li.text(`${message.from}`);
  a.attr('href',message.url);
  li.append(a);
  $('#messages').append(li);
});


$('#message-form').on('submit',function (e) {
  e.preventDefault();
  socket.emit('createMessage',{
    from:'Ranjeet',
    text:$('[name=message]').val()
  },function () {

  })
});
var locationButton = $('#send-location');
locationButton.on('click',function() {
  if(!navigator.geolocation){
    alert('geolocation not supported by your browser')
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position);
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
  },function () {
    alert('Unable to fetch location');
  })
});
