if (uuid == undefined)
	var uuid = require('node-uuid'); // For id generagtion

eval(require('fs').readFileSync('./public/class/User.js')+''); // Import class user

function Server(client) {
	this.client = client;
}

Server.prototype.usersByIp = function (ip) {
	client.execute('INSERT INTO users(uid, creation_date, ip, login, password, safe, sid, socket) values (\''+uid+'\', '+Date.now()+', '+ip+', null, null, 1, null, null);', function (err, result) {
		if (err)
			uid = false;
	});
	return uid;
}

Server.prototype.deleteUser = function (ip) {
	client.execute('SELECT count(*) FROM users WHERE uid = \''+uid+'\';', function (err, result) {
			if (err || result.rows[0]['count'] != 0)
				 uid = false;
	});
	return uid;
}

Server.prototype.addUser = function (ip) {
	var tries = 5;
	var uid = undefined;
	while (uid == undefined)
	{
		if (tries-- == 0)
			return (undefined);
		uid = uuid.v4();
		client.execute('SELECT count(*) FROM users WHERE uid = \''+uid+'\';', function (err, result) {
			if (err || result.rows[0]['count'] != 0)
				 uid = false;
		});
	}
	client.execute('INSERT INTO users(uid, creation_date, ip, login, password, safe, sid, socket) values (\''+uid+'\', '+Date.now()+', '+ip+', null, null, 1, null, null);', function (err, result) {
		if (err)
			uid = false;
	});
	return uid;
}
