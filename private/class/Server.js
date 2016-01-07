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

// getNewUid = function ()
// {
// 	console.log('Getting new uid');
// 	console.log(uid);
// 	uid = 42;
// }

// printUid = function ()
// {
// 	console.log('Uid value: '+uid);
// }

Server.prototype.ipInfo = function (client, ip, callback) {
	client.execute('SELECT number_subscribed, uids_unsubscribed FROM ips WHERE ip = \''+ip+'\';', function (err, result) {
		if (err)
		{
			console.log(err);
			callback('CQL error'); return ;
		}
		else if (result['rowLength'] == 0)
		{
			result = client.execute('INSERT INTO ips(ip, number_subscribed, uids_unsubscribed) values (\''+ip+'\', 0, {});', function (err, result) {
				if (err)
				{
					console.log(err);
					callback('CQL error'); return ;
				}
			});
			callback(null, {'subscribed': 0, 'unsubscribed': null});
		}
		else if (result['rows'][0]['number_subscribed'] == 5)
		{
			callback('Too many accounts');
			return ;
		}
		else
		{
			callback(null, {'subscribed': result['rows'][0]['number_subscribed'],
							'unsubscribed': result['rows'][0]['uids_unsubscribed']});
			return ;
		}
	});
}

Server.prototype.genUid = function (client, callback) {
	var tries = 5;
	var uuid = require('node-uuid'); // For id generagtion

	uid = uuid.v4();
	function loop(jmp) {
		client.execute('SELECT count(*) FROM users WHERE uid = \''+uid+'\';', function (err, result) {
			console.log('uid: '+uid);
			if (err)
			{
				callback('CQL error'); return ;
			}
			else if (result.rows[0]['count'] == 0)
			{
				callback(null, uid);
			}
			else if (tries-- == 0)
			{
				callback('Coulnd\'t generate uid'); return ;
			}
			else
			{
				uid = uuid.v4();
				jmp(jmp);
			}
		});
	}
	loop(loop);
}

Server.prototype.getUserInfo = function (uid, data, callback) {
	client.execute('SELECT '+data+' FROM users WHERE uid = \''+uid+'\';', function (err, result) {
		if (err)
		{
			console.log(err);
			callback('CQL error'); return ;
		}
		else
		{
			console.log(result);
			callback(null, result);
		}
	});
}

Server.prototype.removeOldest = function (table) {
	console.log(table);
	// client.execute('SELECT '+data+' FROM users WHERE uid = \''+uid+'\';', function (err, result) {
	// 	if (err)
	// 	{
	// 		console.log(err);
	// 		callback('CQL error'); return ;
	// 	}
	// 	else
	// 	{
	// 		console.log(result);
	// 		callback(null, result);
	// 	}
	// });
}

Server.prototype.refactorised = function (ip) {
	console.log('Call to refactorised');
	var	uid = 0;
	async.series(
		[
		// Verification du nombre de comptes
		async.apply(this.ipInfo, server.client, server.client),
		// Generation de l'uid
		async.apply(this.genUid, server.client),
			// Bad looking tricks to change
		async.apply(function(variable, callback) { callback(null, variable); return; }, this),

		],
		// Erreur
		function(err, result) {
			if (err)
				console.log('FAIL: ' + err);
			else
			{
				console.log('subscribed: '+result[0]['subscribed']+', unsubscribed: '+result[0]['unsubscribed']+' and uid: '+result[1]);
				result[2].getUserInfo('uid', 'data', null);
result[0]['unsubscribed'] = ['one', 'two', 'three', 'four', 'five', 'six'];
				if (result[0]['subscribed'] + result[0]['unsubscribed'].length > 5)
					this.removeOldest(result[0]['unsubscribed']);
				//add user
			}


	// 	async.series(
	// 	[
	// 	// Verification du nombre de comptes
	// 	async.apply(this.ipInfo, server.client, server.client),
	// 	// Generation de l'uid
	// 	async.apply(this.genUid, server.client),
	// 		// Bad looking tricks to change
	// 	async.apply(function(variable, callback) { callback(null, variable); return; }, this),

	// 	],
	// 	// Erreur
	// 	function(err, result) {
	// 		if (err)
	// 			console.log('FAIL: ' + err);
	// 		else
	// 		{
	// 			console.log('subscribed: '+result[0]['subscribed']+', unsubscribed: '+result[0]['unsubscribed']+' and uid: '+result[1]);
	// 			result[2].getUserInfo('uid', 'data', null);
	// 			if (result[0]['unsubscribed'])
	// 				console.log(result[0]['unsubscribed']);
	// 			// this.getUserInfo('truc', uid);
	// 		}
	// 	}
	// );


		}
	);
}

function test(msg) {
	console.log(msg);
}

//Server.prototype.addUser = function (ip) {
Server.prototype.addUser = function (ip) {
	// getNewUid(5, test);
	// console.log(this.getNewUid());
	this.refactorised(ip);
	
	// var subscribed;
	// var unsubscribed;
	// var unsubscribed_number;
	// var tries = 5;
	// var uid = undefined;

	// console.log("\t\tREAD THIS 1\t\t\t\t"+this);
	// client.execute('SELECT number_subscribed, uids_unsubscribed FROM ips WHERE ip = \''+ip+'\';', function (err, result) {
	// 	if (err)
	// 	{
	// 		console.log(err);
	// 		throw ('CQL error');
	// 	}
	// 	else if (result['rowLength'] == 0)
	// 	{
	// 		result = client.execute('INSERT INTO ips(ip, number_subscribed, uids_unsubscribed) values (\''+ip+'\', 0, {});', function (err, result) {
	// 			if (err)
	// 			{
	// 				console.log(err);
	// 				throw ('CQL error');
	// 			}
	// 		});
	// 		subscribed = 0;
	// 		unsubscribed = null;
	// 	}
	// 	else
	// 	{
	// 		subscribed = result['rows'][0]['number_subscribed'];
	// 		unsubscribed = result['rows'][0]['uids_unsubscribed'];
	// 	}
	// 	if (subscribed == 5)
	// 		throw ('Too many accounts');

	// 	console.log(subscribed+' : '+unsubscribed);

	// 	(function loop () {
	// 		tries--;
	// 		if (tries == 0)
	// 			return cb('not found');
	// 		uid = uuid.v4();
	// 		client.execute('SELECT count(*) FROM users WHERE uid = \''+uid+'\';', function (err, result) {
	// 			if (err)
	// 			{
	// 				console.log(err);
	// 				throw ('CQL error');
	// 			}
	// 			else if (/*ok*/)
	// 				return cb(null, uid)
	// 			else
	// 				loop();
	// 		});
	// 	})();

	// 	while (uid == undefined)
	// 	{
	// 		if (tries-- == 0)
	// 			return (undefined);
	// 		uid = uuid.v4();
	// 		client.execute('SELECT count(*) FROM users WHERE uid = \''+uid+'\';', function (err, result) {
	// 			uid = undefined;
	// 			if (err)
	// 			{
	// 				console.log(err);
	// 				throw ('CQL error');
	// 			}
	// 			else if (result.rows[0]['count'] != 0)
	// 				 uid = undefined;
	// 		});
	// 	}
	// 	console.log('Tries: '+tries);

	// 	if (unsubscribed)
	// 	{
	// 		console.log(unsubscribed);
	// 	}
	// 	else
	// 		console.log('No unsubscribed user');



	// 	client.execute('INSERT INTO users(uid, creation_date, ip, login, password, safe, sid, socket) values (\''+uid+'\', '+Date.now()+', \''+ip+'\', null, null, true, null, null);', function (err, result) {
	// 		if (err)
	// 		{
	// 			console.log(err);
	// 			throw ('CQL error');
	// 		}
	// 		else
	// 		{
	// 			client.execute('UPDATE ips SET uids_unsubscribed = uids_unsubscribed + {\''+uid+'\'} WHERE ip = \''+ip+'\';', function (err, result) {
	// 				if (err)
	// 				{
	// 					console.log(err);
	// 					throw ('CQL error');
	// 				}
	// 				else
	// 					console.log(result);
	// 			});
	// 		}
	// 	});
	// }),
	// console.log(uid);
	// console.log(uid);
	// return uid;
}
