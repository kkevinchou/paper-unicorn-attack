var gameEngineModule = require('./gameEngine.js');

var globalGameInstance = null;

exports.start = function () {
	globalGameInstance = new PaperGame();
};

// PaperGame calss constructor
function PaperGame () {
	var self = this;

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
	console.log('sending state to frontend', state);
};
