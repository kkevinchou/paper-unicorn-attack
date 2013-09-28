var globalGameInstance = null;

exports.start = function () {
	globalGameInstance = new PaperGame();
};

function PaperGame () {
	var self = this;

	console.log('paper game class constructor called');
	self.start();
};

// This is an instance method "start"
PaperGame.prototype.start = function () {
	var self = this;

	console.log('game started');
	self.mainLoop();
};

PaperGame.prototype.mainLoop = function () {
	var self = this;

	console.log('main loop run');

	self.scheduleNextLoop();
};

PaperGame.prototype.scheduleNextLoop = function () {
	var self = this;

	// TODO: calculate how long to wait depending on last run time
	var interval = 100;	// 100 milliseconds
	setTimeout(function () {
		self.mainLoop();
	}, interval);
};
