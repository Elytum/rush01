var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('User '+socket.id+' logged in');
	socket.on('msg', function(msg){
		io.emit('msg', msg);
	});
	socket.on('key', function(key){
		console.log('User '+socket.id+' pressed '+String.fromCharCode(key));
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
