var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/quiz', function (req, res){
  res.sendFile(__dirname + '/quiz.html');
});
app.get('/styles.css', function (req, res){
  res.sendFile(__dirname + '/styles.css');
});
app.get('../styles.css', function (req, res){
  res.sendFile(__dirname + '/styles.css');
});
app.use("/images", express.static(__dirname + '/images'));

io.on('connection', function(socket){
  socket.on('update avatar list', function(){
    io.emit('get avatars in use');
  }); 
  socket.on('recieve avatar list', function(avatarsObj){
    io.emit('disable these uids', avatarsObj);
  });

  socket.on('is avatar available?', function(avatarSelectedID){
    io.emit('avatar is now taken', avatarSelectedID);
    console.log(avatarSelectedID + " is now taken!");
  });

  socket.on('show question', function(questionNum){
    io.emit('show question', questionNum);
    console.log("Showing question: " + questionNum);
  });
  socket.on('answered', function(userAnswer){
    io.emit('user answered', userAnswer);
    console.log(userAnswer);
  });
  socket.on('show answer', function(answer){
    io.emit('show answer', answer);
    console.log("Showing answer: " + answer);
  });

  socket.on('show results', function(avatarsObj,numberQuestions){
    io.emit('show results page',avatarsObj,numberQuestions);
  });
  socket.on('add my score',function(uid){
    io.emit('add users score',uid);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});