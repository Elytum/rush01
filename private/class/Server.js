if (uuid == undefined)
	var uuid = require('node-uuid'); // For id generagtion

eval(require('fs').readFileSync('./public/class/User.js')+''); // Import class user

function Server(client) {
	this.client = client;
}

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
		else if (result['rows'][0]['number_subscribed'] >= 5)
		{
			callback('Too many accounts'); return ;
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
			callback(null, undefined); return ;
		}
		else
		{
			var str = result['rows'][0][data];
			if (str.constructor.name == 'Long' || str.constructor.name == 'Int')
				callback(null, parseInt(str));
			else
				callback(null, str);
		}
	});
}

Server.prototype.rmUser = function (uid, callback) {
	client.execute('select ip, password from users where uid = \''+uid+'\';', function (err, result) {
		if (result && result['rows'][0])
		{
			console.log(result);
			console.log(result['rows']);
			console.log(result['rows'][0]);
			ip = result['rows'][0]['ip'];
			subscribed = (result['rows'][0]['password'] != null) ? true : false;
				client.execute('DELETE FROM users WHERE uid = \''+uid+'\';', function (err, result) {
				if (err) { callback(err); return ; }
				else
				{
					if (subscribed)
						client.execute('UPDATE ips SET number_subscribed = number_subscribed - 1 WHERE ip = \''+ip+'\';', function (err, result)
							{ if (err) callback(err); else callback(null, true); return ; });
					else
						client.execute('UPDATE ips SET uids_unsubscribed = uids_unsubscribed - {\''+uid+'\'} WHERE ip = \''+ip+'\';', function (err, result)
							{ if (err) callback(err); else callback(null, true); return ; });
				}
			});
		}
	});
}

Server.prototype.rmOldestUser = function (table, callback) {
	cpy = this;
	if (table == null || table.length == 0)
		return ;

	var request = 'SELECT creation_date FROM users WHERE uid in (';
	var first = true;

	for (var key in table) {
		if (first == true)
			first = false;
		else
			request += ',';
		request += '\''+table[key]+'\'';
	}
	request += ');';
	client.execute(request, function (err, result) {
		if (err)
		{
			console.log(err);
		}
		else
		{
			var oldest_key = 0;
			var key = 1;

			while (result['rows'][key])
			{
				if (result['rows'][key]['creation_date'] < result['rows'][oldest_key]['creation_date'])
					oldest_key = key;
				++key;
			}
			cpy.rmUser(table[oldest_key], callback);
			return ;
		}
	});
}

Server.prototype.addUser = function (ip, callback) {
	async.series(
		[
		// Verification du nombre de comptes
		async.apply(this.ipInfo, server.client, ip),
		// Generation de l'uid
		async.apply(this.genUid, server.client),
			// Bad looking trick to change
		async.apply(function(variable, callback) { callback(null, variable); return; }, this),

		],
		// Erreur
		function(err, result) {
			if (err)
				console.log('FAIL: ' + err);
			else
			{
				subscribed = result[0]['subscribed'];
				unsubscribed = result[0]['unsubscribed'];
				uid = result[1];
				server = result[2];
				if (unsubscribed && subscribed + unsubscribed.length >= 5)
					 server.rmOldestUser(unsubscribed);
				// Add user
				client.execute('INSERT INTO users(uid, creation_date, ip, login, password, safe, sid, socket) values (\''+uid+'\', '+Date.now()+', \''+ip+'\', null, null, true, null, null);', function (err, res) {
					if (err)
					{
						console.log(err);
						callback('Coulnd\'t insert user');
					}
					else
					{
						client.execute('UPDATE ips SET uids_unsubscribed = uids_unsubscribed + {\''+uid+'\'} WHERE ip = \''+ip+'\';', function (err, res)
							{ if (err) console.log(err); });
							callback(null, uid);
					}
				});
			}
		}
	);
}
