
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

module.exports = Sensors;
