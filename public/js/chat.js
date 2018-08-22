var socket =io();

function scrollToBottom() {
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');

  var clientHeight =messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight')
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    // console.log('scroll');
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect',function(){
  console.log('Connected to Server.');

  var params = $.deparam(window.location.search);
  socket.emit('join',params,function (err) {
    if (err) {
      alert(err);
      window.location.href='/';
    }else{
      console.log('No error');
    }
  });
});
socket.on('disconnect',function(){
  console.log('Disconnected from Server.');
});

socket.on('updateUserList',function (users) {
  console.log('Users list',users);

  var ol = $('<ol></ol>')
  users.forEach(function (user) {
      ol.append($('<li></li>').text(user))
  });
  $('#users').html(ol);
});

socket.on('newMessage',function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template,{
    from:message.from,
    text:message.text,
    createdAt:formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
  // var formattedTime = moment(message.createdAt).format('h:mm a');
  // console.log(message);
  // var li=$('<li></li>');
  // li.text(`${message.from} ${formattedTime}:${message.text}`);
  // $('#messages').append(li);
});

socket.on('newLocationMessage',function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = $('#location-message-template').html();
  var html = Mustache.render(template,{
    from:message.from,
    url:message.url,
    createdAt:formattedTime
  });
  $('#messages').append(html);
  scrollToBottom();
  // var li = $('<li></li>');
  // var a = $('<a target="_blank"> My Current Location</a>');
  //
  // li.text(`${message.from} ${formattedTime}:`);
  // a.attr('href',message.url);
  // li.append(a);
  // $('#messages').append(li);
});


$('#message-form').on('submit',function (e) {
  e.preventDefault();
  var messageTextBox = $('[name=message]');
  socket.emit('createMessage',{
    // from:'Ranjeet',
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
