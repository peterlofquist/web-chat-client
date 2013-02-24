
var socket = io.connect('http://localhost:3000');
var player;
var automaticScrolling = true;
//var mouseMenuTrigger = false;

socket.on('playerJoin', function(playerList) {
  var trigger = false;
  var locPlayerList = playerList;
  var playerListLength = locPlayerList.length;
  player = prompt('Enter a name. Max 20 characters long & no spaces allowed!', '');
  player = player.toLowerCase();
  var playerInput = player.split(" ");
  var playerNew = "";
  
  for(i = 0; i < playerInput.length; i++) {
    playerNew = playerNew + playerInput[i];
    player = playerNew;

  }
  
  if(playerNew == '' || playerNew.length > 20) {
    trigger = true;
  }
  
  for(var i = playerListLength; i--;) {
    if(playerNew == locPlayerList[i].name) {
      trigger = true;
    }
  }
  
  console.log(playerNew);
  if(!trigger) {
    socket.emit('addPlayer', playerNew);
    $('#chat-output').append("<span class='serverMessage'>" + getCurrentTime() + " SERVER: Welcome to project Mayhem version 0.1. Currently " + playerListLength +" players online.<br /></span>");
    $('#online-view').append("<span id='" + playerNew + "' class='serverMessage'>" + playerNew + '</span><br />');
    for(var i = playerListLength; i--;) {
      if(locPlayerList[i].name != "null") {
        $('#online-view').append("<span id='" + locPlayerList[i].name + "'>" + locPlayerList[i].name + '<br /></span>');
      }
    }
    return false;
  }
  else {
    alert('Name already used or too long.');
    location.reload(true);
  }
  
});

socket.on('nameTransactionError', function(nameTransactionErr) {
  alert(nameTransactionErr);
  location.reload(true);
});

function init() {
  $('#online-view').click(function(event) {
    if(event.target.id == 'online-view') {
      $('#chat-input').focus();
      return false;
    }
    var atMessage = '@' + event.target.id + ' ';
    $('#chat-input').val(atMessage);
  });
  
  $('#chat-output').click(function(event) {
    if(event.target.id == 'chat-output' || event.target.id == '') {
      $('#chat-input').focus();
      return false;
    }
    var atMessage = '@' + event.target.id + ' ';
    $('#chat-input').val(atMessage);
  });
  
  
  $('#chat-box').click(function() {
    $('#chat-input').focus();
  });
  
  $('#chat-box').bind("contextmenu",function(e){
     $('#chat-output').empty();
     return false;
  });
  
  $('#send-btn').click(function() {
    sendMessage();
  });
  
  $('#autoscroll-btn').click(function() {
    toggleAutoScroll();
    
  });
  
  $("#chat-input").keyup(function(event){
      if(event.keyCode == 13){
          sendMessage();
      }
  });  
    
}

function getCurrentTime() {
  var time = new Date();
	var hours = time.getHours();
	var minutes = time.getMinutes();
	var seconds = time.getSeconds();
  
  if(hours < 10) { hours = '0' + hours; }
	if(minutes < 10) { minutes = '0' + minutes; }
	if(seconds < 10) { seconds = '0' + seconds; }
	currentTime = hours + ":" + minutes + ":" + seconds;
  return currentTime;
}

function sendMessage() {
	/*var time = new Date();
	var hours = time.getHours();
	var minutes = time.getMinutes();
	var seconds = time.getSeconds();
	
	if(hours < 10) { hours = '0' + hours; }
	if(minutes < 10) { minutes = '0' + minutes; }
	if(seconds < 10) { seconds = '0' + seconds; }
	timestamp = hours + ":" + minutes + ":" + seconds;*/
  var privateMessage = false;
  var pmReceiver = "";
  var msg;
  var timestamp = getCurrentTime();
  
  var message = document.getElementById('chat-input');
  if(message.value == '' || message.value == ' ') {
    return false;
  }

  //var messageSend = timestamp + ' ' + player + ': ' + message.value + '<br />';
  if(player == null) {
    location.reload(true);
    return false;
  }
  
  if(message.value.indexOf('@') == 0 || message.value.indexOf('@') == 1) {
    privateMessage = true;
    var atTag = message.value.split(" ");
    var removeAtTag = atTag[0].length + 1; 
    msg = message.value.slice(removeAtTag);
    var trimStr = atTag[0].slice(1);
    pmReceiver = trimStr;
    $('#chat-output').append("<span id='" + player + "' class='privateMessage'>" + timestamp + ' ' + player + ': ' + message.value + "<br /></span>");
  }
  else {
    msg = message.value;
  }
  //console.log('trying to send...');safaraiiiiiiiiiiiiiiiiiiiiiiii9
  
  socket.emit('chatText', timestamp, player, msg, privateMessage, pmReceiver);
  
  socket.emit('test');
  console.log('emiting test');
  /*if(privateMessage == true) {
    message.value = atTag[0] + ' ';
    $('#chat-input').focus();
  }
  else {*/
    message.value = '';
  //}  
  
  
}


function toggleAutoScroll() {
  if(automaticScrolling == true) {
    automaticScrolling = false;
    $('#autoscroll-btn').attr('value', 'auto-scroll: off');
  }
  else {
    automaticScrolling = true;
    $('#autoscroll-btn').attr('value', 'auto-scroll: on');
    var textarea = document.getElementById('chat-output');
    textarea.scrollTop = textarea.scrollHeight;
  }
}

socket.on('playerDisconnected', function(leaver) {
  $('#chat-output').append("<span class='serverMessage'>" + getCurrentTime() + " " + leaver + " left the game.<br /></span>");
  
  if(automaticScrolling == true) {
    var textarea = document.getElementById('chat-output');
    textarea.scrollTop = textarea.scrollHeight;
  }
});

socket.on('broadcastJoined', function(joiner) {
  $('#chat-output').append("<span class='serverMessage'>" + getCurrentTime() + " " + joiner + " joined the game.<br /></span>");
  
  if(automaticScrolling == true) {
    var textarea = document.getElementById('chat-output');
    textarea.scrollTop = textarea.scrollHeight;
  }
});

socket.on('updateOnline', function(onlineList) {
  //console.log(onlineList);
  $('#online-view').empty();
  var locOnlineList = onlineList;
  var locOnlineLen = locOnlineList.length;
  for(var i = locOnlineLen; i--;) {
    if(locOnlineList[i].name != "null") {
      if(locOnlineList[i].name == player) {
        $('#online-view').append("<span class='serverMessage'>" + locOnlineList[i].name + '<br /></span>');
      }
      else {
        $('#online-view').append("<span id='" + locOnlineList[i].name + "'>" + locOnlineList[i].name + '<br /></span>');
      }
    }
  }
  
});

socket.on('countDown', function(cd) {
  $('#chat-output').append("<span class='serverWarning'>" + getCurrentTime() + " SERVER: server shutting down in " + cd + "...</span><br />");
  var textarea = document.getElementById('chat-output');
  textarea.scrollTop = textarea.scrollHeight;
  
  if(cd == 1) {
    location.reload(true);
  }
});

socket.on('socketMessage', function(socketwrite) {
  console.log('socket' + socketwrite);
  
});

socket.on('incomingMessage', function(msgTime, msgPlayer, msgMessage, isPm, reciever) {
  //console.log(isPm + " " + reciever);
  var localTime = getCurrentTime();
  var messagePost = localTime + ' ' + msgPlayer + ': ' + msgMessage + '<br />';
  
  if(isPm) {
    if(player == reciever) {
      $('#chat-output').append("<span id='" + msgPlayer + "' class='privateMessage'>" + messagePost + "</span>");
    }    
  }
  else {
    $('#chat-output').append("<span id='" + msgPlayer + "'>" + messagePost + "</span>");
  }

  if(automaticScrolling == true) {
    var textarea = document.getElementById('chat-output');
    textarea.scrollTop = textarea.scrollHeight;
  }
});
