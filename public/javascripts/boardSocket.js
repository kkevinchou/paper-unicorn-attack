$(function () {
	setupBoardSocketIO()
});

var socket = null;
var boardSocketCallback = null;
var boardDisconnectCallback = null;
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

	socket.on('disconnect', function (data) {
		if (boardDisconnectCallback) {
			boardDisconnectCallback(data);
		}
	});
}

function setBoardSocketCallback(callback) {
	boardSocketCallback = callback;
};

function setBoardDisconnectCallback(callback) {
	boardDisconnectCallback = callback;
}

function boardSocketConnected() {
	
}
