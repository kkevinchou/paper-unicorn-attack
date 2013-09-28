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

PaperGameEngine.prototype.registerUser = function(controller) {
	var self = this;

	var playerId = self.playerIdTracker++;

	var newPlayer = null
	var configToSend = null;

	if (playerId % 2 == 0) {
		newPlayer = new fighterModule.Fighter();
		configToSend = {"character-type": "fighter", "color": "blue" };
	} else {
		newPlayer = new dragonModule.Dragon();
		configToSend = {"character-type": "dragon", "color": "red" };
	}

	newPlayer.controller = controller;
	self.objects.push(newPlayer);
	newPlayer.controller.sendConfig(configToSend);

	console.log('registered a new player');

	return playerId;
};

PaperGameEngine.prototype.unregisterUser = function(controller) {
	var self = this;

	for (var i = 0; i < self.objects.length; i++) {
		var object = self.objects[i];
		if (object.controller == controller) {
			console.log('found and removed a player');
			self.objects.splice(i, 1);	// Remove the object from self.objects
			break;
		}
	}
};

PaperGameEngine.prototype.processFrame = function (dt, next) {
	var self = this;

	for (var i = 0; i < self.objects.length; i++) {
		self.objects[i].update(1);
		if (self.objects[i].controller) {
			var controller = self.objects[i].controller;
			var angle = controller.getAngle();
			var magnitude = controller.getMagnitude();
			console.log('controller ' + i + ' angle: ' + angle + ' magnitude: ' + magnitude);
			if (controller.getTap()) {
				console.log('TAP!');
			}
		}
	}

	next(null);
};

PaperGameEngine.prototype.getGameState = function () {
	var self = this;

	var objects = [];
	for (var i = 0; i < self.objects.length; i++) {
		objects.push(self.objects[i].frontendRepresentation());
	}

	var state = {
		'game': {
			'objects': objects
		},
		'events': []
	};

	return state;
};
