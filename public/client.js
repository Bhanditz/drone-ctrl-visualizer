
var socket = new io( "http://localhost:3000" );
$(document).ready( function(){
    console.info( "Ready!" );
    setInterval( function(){
        console.info(
            socket.emit( 'ping', { msg: Date.now() }, function() {
                console.info( arguments );
            })
        );
    }, 1000)

    socket.on( 'connect', function() {
        console.info( "Connected!" );
    });

    socket.on( 'disconnect', function() {
        console.error( "Disconnected!" );
    });

    socket.on( "sensors", function(data) {
        drone.pos.y = data.height;
        drone.orientation = data.orientation;
        drone.pos.x = data.pos.x;
        drone.pos.z = data.pos.z;
    })
})
