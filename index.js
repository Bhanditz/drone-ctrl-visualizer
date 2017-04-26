var fs = require('fs');
var express = require('express');
var app     = express();
var https   = require('https');
var Sensors = require('./sensors.js');
var io      = require('socket.io');
//var http    = require('http').Server( app );


var httpsOptions = {
	key               : fs.readFileSync("./server.key"),
	cert              : fs.readFileSync("./server.crt"),
	requestCert       : true,
	rejetUnauthorized : false
};

var sensors = new Sensors();

var server = https.createServer(httpsOptions, app).listen(1337, function () {
	console.log('Controller + visualizer app listening on port 1337!')

	setInterval(function() {
		sensors.orientation.alpha += Math.random() - .5;
		sensors.orientation.beta  += Math.random() - .5;
		sensors.orientation.gamma += Math.random() - .5;
		sensors.height = (1+Math.cos( Date.now() / 1000 - Math.PI/2) );
	}, 10);

	ready();
});
io = io.listen( server );



app.use(express.static('./public/'));
app.get("/sensors", function( req, res ) {
	res.json(sensors.getData());
});



io.on( 'connection', function( socket ) {
	console.log('a user '+ socket.id +' connected');

	socket.on( 'disconnect', function() {
		console.log('user '+ socket.id +' disconnected');
	});

	socket.on( "pling", function( msg ) {
		console.log('user '+ socket.id +' pling\'d', arguments);
		socket.emit( 'plong', msg );
	});

	socket.on( 'ctrl', function( json ) {
		json = JSON.parse( json );
		if (!!json.longitudinal)  {
			sensors.move(json.longitudinal);
		}
		console.info("ctrl from user "+ socket.id, arguments)
	});
});

function ready() {
	ready = function(){};

	setInterval( function() {
		io.emit("sensors", sensors.getData() );
	}, 10);
}
