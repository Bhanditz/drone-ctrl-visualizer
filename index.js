var express = require('express');
var app     = express();
var http    = require('http').Server( app );
var io      = require('socket.io')( http );

app.use(express.static('./public/'))

function Sensors() {
	this.orientation = {
			alpha :  0,
			beta  : 90,
			gamma :  0
	};
	this.height = null;
	this.pos = { x: 0, z: 0 }

	this.moveFactor = {
		forwards : 0.05
	}
}
Sensors.prototype.getData = function() {
	return { orientation : this.orientation, height : this.height, pos : this.pos };
}
Sensors.prototype.move = function( forwards ) {
	console.log(forwards);
	if (!!this.orientation) {
		this.pos.x += Math.cos( this.orientation.alpha / 180 * Math.PI ) * forwards * this.moveFactor.forwards;

		this.pos.z -= Math.sin( this.orientation.alpha / 180 * Math.PI ) * forwards * this.moveFactor.forwards;
	}
	console.log( this.pos );
}


var sensors = new Sensors();

app.get("/sensors", function( req, res ) {
	res.json(sensors);
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

http.listen(3000, function () {
	console.log('Controller + visualizer app listening on port 3000!')

	setInterval(function() {
		sensors.orientation.alpha += Math.random() - .5;
		sensors.orientation.beta  += Math.random() - .5;
		sensors.orientation.gamma += Math.random() - .5;
		sensors.height = (1+Math.cos( Date.now() / 1000 - Math.PI/2) );
	}, 10);

	ready();
})
