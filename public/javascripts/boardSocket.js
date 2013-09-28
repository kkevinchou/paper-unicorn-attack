$(function () {
	setupBoardSocketIO()
});

var socket = null;
var boardSocketCallback = null;
function setupBoardSocketIO() {
	socket = io.connect('/board');

	socket.on('connect', function (data) {
		boardSocketConnected();
		socket.on('state', function (data) {
			if (boardSocketCallback) {
				boardSocketCallback(data);
			}
		});
	});

  	// socket.on('config', function (data) {
    	// alert('config: ' + data['character-type'] + ', ' + data['color']);
  	// });
}

function setBoardSocketCallback(callback) {
	boardSocketCallback = callback;
};

function boardSocketConnected() {
	
}
