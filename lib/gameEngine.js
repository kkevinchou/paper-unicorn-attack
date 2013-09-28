
function PaperGameEngine () {
	var self = this;

	self.mainAirplanePosition = {x: 50, y: 50, direction: {x: 5, y: 3}};
};
module.exports = PaperGameEngine;

PaperGameEngine.prototype.processFrame = function (next) {
	var self = this;

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
		'mainAirplane': {x: self.mainAirplanePosition.x, y: self.mainAirplanePosition.y},
		'characters': [
			{'type': 'dragon', 'color': 'blue'},
			{'type': 'dragon', 'color': 'red'}
		]
	};

	return state;
};
