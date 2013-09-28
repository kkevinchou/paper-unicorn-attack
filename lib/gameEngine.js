var dragonModule = require('./dragon.js');

function PaperGameEngine () {
	var self = this;

	self.mainAirplanePosition = {x: 50, y: 50, direction: {x: 5, y: 3}};
	
	self.dragon = new dragonModule.Dragon();
	self.objects = []
	self.objects.push(self.dragon)
};

module.exports = PaperGameEngine;

PaperGameEngine.prototype.processFrame = function (next) {
	var self = this;

	for (var i = 0; i < self.objects.length; i++) {
		self.objects[i].update(1);
		console.log(self.objects[i].x);
	}

	//console.log('in processFrame');

	self.mainAirplanePosition.x += self.mainAirplanePosition.direction.x;
	if (self.mainAirplanePosition.x > 200 || self.mainAirplanePosition.x < 50) {
		self.mainAirplanePosition.direction.x *= -1;
	}

	self.mainAirplanePosition.y += self.mainAirplanePosition.direction.y;
	if (self.mainAirplanePosition.y > 170 || self.mainAirplanePosition.y < 40) {
		self.mainAirplanePosition.direction.y *= -1;
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
