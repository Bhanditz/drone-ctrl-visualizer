const bluetooth = require("node-bluetooth");

const device = new bluetooth.DeviceINQ();


device.listPairedDevices(function(){
	console.log.apply(console, arguments);
});


device.on('finished', function(){
	console.log("FINISHED:");
	console.log.apply(console, arguments);
}).on('found', function( address, name ){
	console.log("FOUND:", address, name);
}).inquire();
