var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: "game"});
// var client = new cassandra.Client({ contactPoints: ['127.0.0.1']});

function launch_query(query) {
	client.execute(query, function (err, result) {
		if (err)
			console.log(err);
		else
			console.log(result);
	});
}

// launch_query('CREATE KEYSPACE game WITH REPLICATION = { \'class\' : \'SimpleStrategy\', \'replication_factor\' : 1 };');


launch_query('USE game;');
launch_query('CREATE TABLE users (  
uid varchar PRIMARY KEY,          
suscribed boolean PRIMARY KEY,
login varchar,                    
password varchar,                 
ip bigint,                        
sid bigint,                       
safe boolean,                     
socket bigint,                    
creation_date bigint              
);');

										// launch_query('CREATE TABLE ips (      
										// 	ip bigint PRIMARY KEY,           
										// 	uids set<varchar>                 
										// );');

										// launch_query('SELECT login FROM users;');
										// var uid = '42';
										// var ip = 21;
										// launch_query('UPDATE ips
										//        SET ips = ips + {\''+uid+'\'} WHERE ip = '+ip+';');

										// launch_query('INSERT INTO ips (ip, uids)
										//        VALUES(21, {\'42\'});');

// launch_query('UPDATE ips SET uids = uids + {\'63\'} WHERE ip = 21;');

launch_query('SELECT count(*) FROM ips WHERE ip = 21;');

// client.execute('SELECT name, email FROM game where key=?', ['mick-jagger'], function (err, result) {
// 	if (err)
// 		console.log(err);
// 	else
// 		console.log(result);
// });

	  // var user = result.rows[0];
	  // //The row is an object with the column names as property keys
	  // console.log("Hello %s, your email is %s", user.name, user.email);