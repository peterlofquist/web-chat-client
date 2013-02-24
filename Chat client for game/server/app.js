var app = require('http').createServer(handler),
io = require('socket.io').listen(app),
fs = require('fs')

var playerArray = [{"name": "null", "socket": "unknown"}];

app.listen(3000);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html', function(err, data) {
    if(err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
      console.log('false');
    }
    console.log('true');
    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function(socket) {
  socket.on('disconnect', function () {
    var playerListLength = playerArray.length;
    for(var i = playerListLength; i--;) {
      if(playerArray[i].socket == socket.id) {
        socket.broadcast.emit('playerDisconnected', playerArray[i].name);
        playerArray.splice(i, 1);
        socket.broadcast.emit('updateOnline', playerArray);
      }
    }
    
  });
  
  socket.on('test', function () {
    console.log('###################' + socket.ip);
  
  });
  /*socket.on('playerDisconnects', function(removePlayer) {
    
    var playerListLength = playerArray.length;
    for(var i = playerListLength; i--;) {
      
    }
    
    socket.broadcast.emit('playerLeft', removePlayer);
  });*/
  
  socket.emit('playerJoin', playerArray);
  
  socket.on('addPlayer', function(name) {
    
    //console.log(socket.name);
    var inputName = name.toLowerCase();
    var playerListLength = playerArray.length;
    for(var i = playerListLength; i--;) {
      if(inputName == playerArray[i]) {
        var errorMessage = name + ' seems to be online already, try a new name.';
        socket.emit('nameTransactionError', errorMessage);
        return false;
      }
    }
    var input = {
      "name": name,
      "socket": socket.id
    }
    
    playerArray[playerListLength++] = input;
    
    socket.broadcast.emit('broadcastJoined', input.name);
    socket.broadcast.emit('updateOnline', playerArray);

    
  });
  
  socket.on('chatText', function(time, player, message, pm, reciever) {
    /*console.log(messageIn);
    var decodedMessage = messageIn.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/g, "");
    console.log(messageIn);*/
    //var reciver = 
    if(message == 'cd10secssd') {
      var integer = 10;
      
      var handle = setInterval(function() {
        io.sockets.emit('countDown', integer);
        if(integer == 0) {
          document.clearInterval(handle);
          process.exit();
        }
        integer--;
      }, 1000);
      return false; 
    }
    
    
    io.sockets.emit('incomingMessage', time, player, message, pm, reciever);
    
  });
});
