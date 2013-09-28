var dragonModule = require('./dragon.js');
var fighterModule = require('./fighter.js');

function PaperGameEngine () {
	var self = this;

	self.playerIdTracker = 0;

	self.dragon = new dragonModule.Dragon();
	self.objects = []
	self.objects.push(self.dragon)

};

module.exports = PaperGameEngine;

PaperGameEngine.prototype.registerUser = function() {
	playerId = self.playerIdTracker++;

	newPlayer = null

	if (playerId % 2 == 0) {
		newPlayer = new fighterModule.Fighter();
	} else {
		newPlayer = new dragonModule.Dragon();
	}

	self.objects.push(newPlayer);

	return playerId;
}

PaperGameEngine.prototype.processFrame = function (next) {
	var self = this;

	for (var i = 0; i < self.objects.length; i++) {
		self.objects[i].update(1);
		console.log(self.objects[i].x);
	}

	next(null);
};

PaperGameEngine.prototype.getGameState = function () {
	var self = this;

	var state = {
		'players': [
			{'type': 'dragon', 'color': 'blue', 'x': self.dragon.x, 'y': self.dragon.y},
		]
	};

	return state;
};
