// var cassandra = require('cassandra-driver');
// var async = require('async');

//Connect to the cluster
// var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'demo'});

var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['host1']});
client.connect(function (err) {
  
});

// INSERT DATA
var params = ['mick-jagger', 'Sir Mick Jagger', 'mick@rollingstones.com', new Date(1943, 6, 26)];
client.execute('INSERT INTO users (key, name, email, birthdate) VALUES (?, ?, ?)', params, function (err) {
  //Inserted in the cluster
});

// RETRIEVE DATA
client.execute("SELECT name, email, birthdate FROM users WHERE key = 'mick-jagger'", function (err, result) {
  var user = results.rows[0];
  //The row is an Object with column names as property keys. 
  console.log('My name is %s and my email is %s', user.name, user.email);
});




// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// function User(socket) {
//   this.socket = socket;
// }

// var users = {};

// app.get('/', function(req, res){
// 	res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', function(socket){
// 	users[socket.id] = User(socket);
// 	console.log('User '+socket.id+' logged in');

// 	socket.on('msg', function(msg){
// 		io.emit('msg', msg);
// 	});

// 	socket.on('key', function(key){
// 		key = String.fromCharCode(key);
// 		if (key == 'w')
// 			io.emit('move', 'Used '+socket.id+' moved up');
// 		else if (key == 's')
// 			io.emit('move', 'Used '+socket.id+' moved down');
// 		else if (key == 'a')
// 			io.emit('move', 'Used '+socket.id+' moved left');
// 		else if (key == 'd')
// 			io.emit('move', 'Used '+socket.id+' moved right');
// 	});

// 	socket.on('disconnect', function() {
// 		delete users[socket.id];
// 		console.log('User '+socket.id+' logged out');
// 	});

// 	socket.on('list', function(msg){
// 		console.log(users);
// 	});
// });

// http.listen(3000, function(){
// 	console.log('listening on *:3000');
// });
