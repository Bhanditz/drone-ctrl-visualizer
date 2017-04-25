
var socket = new io( "http://localhost:3000" );
$(document).ready( function(){
    console.info( "Ready!" );

    function doping() {
        var msg = Array(8).fill(0).map(function(){ return parseInt(Math.random()*16).toString( 16 ).toUpperCase() }).join("");
        socket.emit( 'pling', [ msg, Date.now() ] );
    }
    socket.on( "plong", function( args ) {
        console.info("Plong", args[0], (Date.now()-args[1])+"ms");
        setTimeout(doping, 10000);
    })
    doping();

    socket.on( 'connect', function() {
        console.info( "Connected as client "+ socket.id +"!" );
    	document.getElementById("info-client-id").innerHTML = socket.id;
    });

    socket.on( 'disconnect', function() {
        console.error( "Disconnected!" );
    });

    socket.on( "sensors", function(data) {
        drone.pos.y = data.height;
        drone.orientation = data.orientation;
        drone.pos.x = data.pos.x;
        drone.pos.z = data.pos.z;

    	document.getElementById("info-alpha").innerHTML = data.orientation.alpha;
        document.getElementById("info-beta").innerHTML  = data.orientation.beta;
    	document.getElementById("info-gamma").innerHTML = data.orientation.gamma;
    })
})
