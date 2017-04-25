function Drone() {
    this.$alpha = null;
    this.$beta  = null;
    this.$gamma = null;

    this.orientation = null;

    this.euler = new THREE.Euler( 0, 0, 0, 'ZXY' );

    this.pos = new THREE.Vector3( 0, 0, 0 );

    this.obj = new THREE.Mesh( new THREE.BoxGeometry( 1, .1, 1 ), new THREE.MeshBasicMaterial( { color: 0xff00ff } ) );
    this.obj.add(new THREE.LineSegments( new THREE.EdgesGeometry( this.obj.geometry )
	           , new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 1 }) ));

    var axisHelper = new THREE.AxisHelper( 10 ); // X = Red, Y = Green, Z = Blue
    axisHelper.material.linewidth = 5;
    axisHelper.material.needsUpdate = true;
    axisHelper.material.matrixWorldNeedsUpdate = true;
    this.obj.add( axisHelper );
}

Drone.prototype.update = function () {
    this.obj.position.set( this.pos.x, this.pos.y + 0.05, this.pos.z );

    if (!!this.orientation)
        setObjectQuaternion( this.obj.quaternion, this.orientation.alpha * 0.017453292519943295, this.orientation.beta * 0.017453292519943295, this.orientation.gamma * 0.017453292519943295 );

    return;
/*    var Rz = (this.$alpha) / 180 * Math.PI;
    var Rx = (this.$beta) / 180 * Math.PI;
    var Ry = (this.$gamma) / 180 * Math.PI;
    this.obj.rotation.copy( this.euler );
//    this.obj.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), Rz );
//    this.obj.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), Rx );
//    this.obj.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), Ry );
//    var Rx =  -this.$beta / 180 * Math.PI;
//    var Ry =  (-this.$alpha) / 180 * Math.PI;
//    var Rz = 0 && this.$gamma / 180 * Math.PI;
    var Rx = 0 && (this.$beta-90) / 180 * Math.PI;
    var Ry =  (this.$alpha) / 180 * Math.PI;
    var Rz =   0 && this.$gamma / 180 * Math.PI;
    this.euler = new THREE.Euler( Rx, Ry, Rz, 'XYZ' );
    this.rotation = new THREE.Vector3(0, 0, 1);
    this.rotation.applyEuler(this.euler);
    this.obj.rotation.copy( this.euler );*/
}
