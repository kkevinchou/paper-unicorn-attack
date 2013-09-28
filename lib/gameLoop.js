var gameEngineModule = require('./gameEngine.js');
var gameInputModule = require('./gameInput.js');

var globalGameInstance = null;

exports.start = function () {
	globalGameInstance = new PaperGame();
};


exports.controllerConnected = function (socket) {
	globalGameInstance.controllerConnected(socket);
};

exports.boardConnected = function (socket) {
	globalGameInstance.boardConnected(socket);
};

// PaperGame calss constructor
function PaperGame () {
	var self = this;

	self.boards = [];
	self.engine = new gameEngineModule();
	self.start();
};

// This is an instance method "start"
PaperGame.prototype.start = function () {
	var self = this;

	console.log('game started');
	self.mainLoop();
};

PaperGame.prototype.scheduleNextLoop = function () {
	var self = this;

	// TODO: calculate how long to wait depending on last run time
	var interval = 100;	// 100 milliseconds
	setTimeout(function () {
		self.mainLoop();
	}, interval);
};

PaperGame.prototype.mainLoop = function () {
	var self = this;

	// 1. process input
	self.engine.processFrame(function (err) {
		if (err) {
			console.log('processFrame returned error', err);
		}

		var gameState = self.engine.getGameState();
		self.sendStateToFrontend(gameState);

		self.scheduleNextLoop();
	});
};

PaperGame.prototype.sendStateToFrontend = function (state) {
	var self = this;

	self.boards.forEach(function (boardSocket) {
		boardSocket.emit('state', state);
	});
};

PaperGame.prototype.controllerConnected = function (socket) {
	var self = this;

	var input = new gameInputModule.ControllerConnection(self, socket);	// it will add itself to the game
};

PaperGame.prototype.registerUser = function (controller) {
	var self = this;
	self.engine.registerUser(controller);
};

PaperGame.prototype.unregisterUser = function (controller) {
	var self = this;
	self.engine.unregisterUser(controller);
};

PaperGame.prototype.boardConnected = function (socket) {
	var self = this;

	console.log('new socket.io board connection');
	self.boards.push(socket);
	socket.on('disconnect', function () {
		console.log('socket.io board disconnected');
		var i = 0;
		self.boards.forEach(function (potentialSocket) {
			if (socket.id == potentialSocket.id) {
				delete self.boards[i];
			} else {
				i++;
			}
		});
	});
};

