
var setObjectQuaternion = function() {
	var zee = new THREE.Vector3( 0, 0, 1 );
	var euler = new THREE.Euler();
    var q0 = new THREE.Quaternion();
	var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) );

	return function( quaternion, alpha, beta, gamma ) {
		euler.set( beta, alpha, -gamma, 'YXZ' );
		quaternion.setFromEuler( euler );
		quaternion.multiply( q1 );
	}
}();



var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var renderer, camera, scene, drone;

var drone, ground, axisHelper;

var socket = new io();

function makeSkybox( src ) {
	var geometry = new THREE.SphereGeometry( 500, 16, 8 );
	geometry.scale( - 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( src )
	} );
	return new THREE.Mesh( geometry, material );
}

function makeGround( size, segments ) {
	var geometry     = new THREE.PlaneGeometry( size, size, segments, segments )
	var materialEven = new THREE.MeshBasicMaterial( { color: 0xccccfc } )
	var materialOdd  = new THREE.MeshBasicMaterial( { color: 0x444464 } )
	var materials    = [ materialEven, materialOdd ];

	for(var x = 0; x < segments; x++)
	for(var y = 0; y < segments; y++) {
		var i = x * segments + y, j = 2 * i;
		  geometry.faces[ j ].materialIndex = geometry.faces[ j + 1 ].materialIndex = ( x + y ) % 2;
	}

	var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
	mesh.position.set( 0, 0, 0 );
	mesh.rotation.set( -Math.PI/2, 0, 0 );
	mesh.updateProjectionMatrix = true;

	return mesh;
}

init();
setTimeout(function(){
//	var event =
//	window.dispatchEvent( );
}, 10);

function init () {

    drone = new Drone();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.constRadius = 10;
    camera.lookAt(drone.obj.position);

    scene = new THREE.Scene();
	ground = makeGround( 11, 11 );
    axisHelper = new THREE.AxisHelper( 10 ); // X = Red, Y = Green, Z = Blue
    axisHelper.material.linewidth = 5;
    scene.add(camera);
    scene.add( drone.obj );
    scene.add( makeSkybox( 'skybox/130980896.jpg' ) );
    scene.add( ground );
    scene.add( axisHelper );


    renderer = new THREE.WebGLRenderer({
        canvas : document.getElementById("canvas"),
        antialias : true
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );


    //get orientation info
    if (window.DeviceOrientationEvent) {
        window.addEventListener( "deviceorientation", function ( event ) {
        	document.getElementById("alpha").innerHTML = event.alpha;
        	document.getElementById("beta").innerHTML  = event.beta;
        	document.getElementById("gamma").innerHTML = event.gamma;
//            drone.setRawData( event.alpha, event.beta, event.gamma );
//            setObjectQuaternion( drone.obj.quaternion, event.alpha * 0.017453292519943295, event.beta * 0.017453292519943295, event.gamma * 0.017453292519943295 );
            setObjectQuaternion( camera.quaternion, event.alpha * 0.017453292519943295, event.beta * 0.017453292519943295, event.gamma * 0.017453292519943295 );
        }, true);
    } else console.error(new Error("window.DeviceOrientationEvent not supported"));

	window.addEventListener( 'resize', function() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );

    loop();
}



function loop() {

    drone.update();
    camera.position.copy( drone.obj.position );
    camera.translateZ( camera.constRadius );

	renderer.render( scene, camera );
    requestAnimationFrame( loop );
}
