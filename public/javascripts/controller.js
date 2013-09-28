$(function() {
	ready();
});

function ready () {
	setupSocketIO();
}

var socket = null;
function setupSocketIO() {
	socket = io.connect('http://localhost');

	socket.on('connect', function (data) {
		socketConnected();
	});

  	socket.on('config', function (data) {
    	alert('config: ' + data['character-type'] + ', ' + data['color']);
  	});
}

function socketConnected() {
	alert('connected');
	socket.emit('move', {x: 5, y: 10});
}
