var http        = require('http');
var url         = require("url");
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var urlBDD = 'mongodb://localhost:27017/test';

var server = http.createServer(function(req, res) 
{
	var page = url.parse(req.url).pathname;
	
	res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
	if (page == '/') 
	{
        res.write('Welcome');
    }
    else if (page == '/highscore') 
    {
		MongoClient.connect(urlBDD, function(err, db) 
		{
			var jsonArr = [];
			if (err) throw err;
				console.log("Connected to Database.");
			
			var collection = db.collection('test');			
			collection.find({}, {'limit':10}).sort({score: -1}).toArray(function(err, docs) {            
			  docs.forEach(function(doc) {
				jsonArr.push({
					name: doc.name,
					score: doc.score
				});
			  });
			  console.log('********')
			  console.log(JSON.stringify(jsonArr));
			  res.end(JSON.stringify(jsonArr));
			});
		});
    }
    else if (page == '/register') 
    {
        var params = querystring.parse(url.parse(req.url).query);
		
		if ('name' in params && 'score' in params) 
		{
			
			var entity = new Object();
			entity.name = params['name'];
			entity.score = parseInt(params['score']);
			
			MongoClient.connect(urlBDD, function(err, db) 
			{
				if (err) throw err;
					console.log("Connected to Database.");
			
				var collection = db.collection('test');	
				collection.insertOne(entity, function(err, r) 
				{

				});
			});
			
			res.end('Added');
		}
		else {
			res.write('Error');
		}
    }
	else if (page == '/collision') 
	{
		var params = querystring.parse(url.parse(req.url).query);
		if ('playerX' in params && 'enemyX' in params && 'enemyY' in params) {
		    var collision = 0;
			var playerY = 455;
			playerX = parseInt(params['playerX']);
			enemyX = parseInt(params['enemyX']);
			enemyY = parseInt(params['enemyY']);

			if ( playerX == enemyX && playerY - enemyY <= 145 && enemyY <= 600)
				collision = 1;
			
			var c = new Object();
			c.collision = collision;
			res.write(JSON.stringify(c));
		}
		else 
		{
			res.write('Error');
		}
		res.end();
	}
	else if (page == '/rand') 
	{
		
        var rand = Math.random();
		var r = new Object();
		(rand > 0.50) ? r.rand = 0 : r.rand = 1;
		res.end(JSON.stringify(r));
    }
});
console.log("Server is running.");
server.listen(8080);
