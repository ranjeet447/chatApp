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
  var a = $('<a target="_blank"> My Current Location</a>');

  li.text(`${message.from}`);
  a.attr('href',message.url);
  li.append(a);
  $('#messages').append(li);
});


$('#message-form').on('submit',function (e) {
  e.preventDefault();
  var messageTextBox = $('[name=message]');
  socket.emit('createMessage',{
    from:'Ranjeet',
    text:messageTextBox.val()
  },function () {
    messageTextBox.val('');
  })
});

var locationButton = $('#send-location');
locationButton.on('click',function() {
  if(!navigator.geolocation){
    alert('geolocation not supported by your browser')
  }
  locationButton.attr('disabled','disabled').text('Sending Location...')
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position);
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
  },function () {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location');
  })
});
