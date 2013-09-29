var dragonModule = require('./dragon.js');
var fighterModule = require('./fighter.js');
var cargoModule = require('./cargo.js');

function PaperGameEngine () {
	var self = this;

	self.playerIdTracker = 0;

	self.objects = [];
    self.cargo = new cargoModule.Cargo();
    self.objects.push(self.cargo);
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
		var object = self.objects[i];

		if (object.controller) {
			var controller = object.controller;
			var angle = controller.getAngle();
			var magnitude = controller.getMagnitude();

			adjustedAngle = angle - 90;

			var xSpeed = Math.cos(adjustedAngle * Math.PI / 180.0) * object.maxSpeed * magnitude / 1000;
			var ySpeed = Math.sin(adjustedAngle * Math.PI / 180.0) * object.maxSpeed * magnitude / 1000;

			console.log(ySpeed);

			object.xSpeed = xSpeed;
			object.ySpeed = ySpeed;

			// console.log('controller ' + i + ' angle: ' + angle + ' magnitude: ' + magnitude);

			if (controller.getTap()) {
				console.log('TAP!');
			}
		}

		object.update(dt);
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
