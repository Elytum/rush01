// var cassandra = require('cassandra-driver');
// var async = require('async');

//Connect to the cluster
// var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'demo'});

// var cassandra = require('cassandra-driver');
// var client = new cassandra.Client({contactPoints: ['host1']});
// client.connect(function (err) {
  
// });

// // INSERT DATA
// var params = ['mick-jagger', 'Sir Mick Jagger', 'mick@rollingstones.com', new Date(1943, 6, 26)];
// client.execute('INSERT INTO users (key, name, email, birthdate) VALUES (?, ?, ?)', params, function (err) {
//   //Inserted in the cluster
// });

// RETRIEVE DATA
// client.execute("SELECT name, email, birthdate FROM users WHERE key = 'mick-jagger'", function (err, result) {
//   var user = results.rows[0];
//   //The row is an Object with column names as property keys. 
//   console.log('My name is %s and my email is %s', user.name, user.email);
// });



var express = require('express'); // For pages handling
var app = express(); // For pages handling
var http = require('http').Server(app); // For http handling
var io = require('socket.io')(http); // For socket handling
var cassandra = require('cassandra-driver'); // For cassandra handling

var uuid = require('node-uuid'); // For id generagtion

app.use(express.static('public')); // Give access to every public file

eval(require('fs').readFileSync('./public/class/User.js')+''); // Import user class
eval(require('fs').readFileSync('./private/class/Server.js')+''); // Import server class


var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: "game"});
var server = new Server(client);

var users = {}; // List of users
var connections = {}; // Socket id to uid
var ips = {}; // Socket id to uid

io.on('connection', function(socket){
	console.log('User '+socket.id+' logged in');
	
	socket.on('msg', function(msg){
		io.emit('msg', msg);
	});

	socket.on('key', function(key){
		key = String.fromCharCode(key);
		if (key == 'w')
			io.emit('move', 'Used '+socket.id+' moved up');
		else if (key == 's')
			io.emit('move', 'Used '+socket.id+' moved down');
		else if (key == 'a')
			io.emit('move', 'Used '+socket.id+' moved left');
		else if (key == 'd')
			io.emit('move', 'Used '+socket.id+' moved right');
	});

	socket.on('disconnect', function() {
		if (connections[socket.id])
			delete connections[socket.id];
		console.log('User '+socket.id+' logged out');
	});

	socket.on('list', function(msg){
		console.log(users);
	});


	socket.on('authentication', function(session){
		console.log(session.uid+' trying to authentificate himself with '+session.sid);
		var tmp_user = users[session.uid];
		if (tmp_user)
		{
			if (tmp_user.sid == session.sid)
			{
				console.log('Authentification successfull for "'+tmp_user.getLogin()+'"');
				tmp_user.sid = uuid.v4();
				io.emit('update sid', tmp_user.sid);
			}
			else
			{
				console.log('Unsafe connection detected on user '+session.uid);
				tmp_user.safe = false;
			}
		}
		else
		{
			ip = socket.request.connection.remoteAddress;
			if (ips[ip] == 5)
				console.log('Too many accounts for ip: '+ip);
			else
			{
				if (ips[ip] == undefined)
					ips[ip] = 1;
				else
					++ips[ip];
				var uid = uuid.v4();
				while (users[uid])
					uid = uuid.v4();
				var user = new User(uid);
				users[uid] = user;
				user.sid = uuid.v4();
				user.socket = socket.id;

				connections[socket.id] = uid;
				console.log('\t\tNew user: '+uid);
				console.log(server);
				console.log('\t\t\t\tNew user: '+server.addUser(socket.request.connection.remoteAddress));
			}
		}
	});

	io.emit('request authentification', null);
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
