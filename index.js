var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('3Dmodels'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/cloth3', function(req, res) {
    res.sendFile(__dirname + '/3Dmodels/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
    });
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
    socket.on('change sth', function(msg) {
        io.emit('change sth', msg);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
