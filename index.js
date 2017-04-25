var express = require('express');
var app     = express();
var http    = require('http').Server( app );
var io      = require('socket.io')( http );

app.use(express.static('./public/'))

function Sensors() {

}
Sensors.prototype.getData = function() {
	return {
		orientation : {
			alpha : Math.random(),
			beta  : Math.random() + 90,
			gamma : Math.random()
		},
		height : (1+Math.cos( Date.now() / 1000 - Math.PI/2) )
	}
}

var sensors = new Sensors();

app.get("/sensors", function( req, res ) {
	res.json();
});


io.on( 'connection', function( socket ) {
	console.log('a user connected');

	setInterval(function(){
		socket.emit("sensors", sensors.getData() );
	}, 10);

	socket.on( 'disconnect', function() {
		console.log('user disconnected');
	});

	socket.on( 'ping', function( msg ) {
		console.log('user ping\'d', arguments);
		socker.emit( 'pong', msg );
	});
});


http.listen(3000, function () {
	console.log('Controller + visualizer app listening on port 3000!')
})
