var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1']});

function launch_query(query) {
	client.execute(query, function (err, result) {
		if (err)
			console.log(err);
		else
			console.log(result);
	});
}

launch_query('DROP KEYSPACE game;');
