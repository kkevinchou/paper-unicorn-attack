var dragonModule = require('./dragon.js');
var fighterModule = require('./fighter.js');
var cargoModule = require('./cargo.js');

function PaperGameEngine () {
	var self = this;

	self.playerIdTracker = 0;

	self.objects = [];
	self.pendingEvents = [];
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
		spawnX = 100;
	} else {
		newPlayer = new dragonModule.Dragon(self, 150, 150, 50/1000, 0);
		configToSend = {"character-type": "dragon", "color": "red" };
		spawnX = 900;
	}

	spawnY = Math.floor(Math.random() * 600) + 100;
	newPlayer.x = spawnX;
	newPlayer.y = spawnY;

	newPlayer.controller = controller;
	newPlayer.controller.sendConfig(configToSend);

	console.log('registered a new player');
	self.objects.push(newPlayer);

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

			object.heading = angle;
			adjustedAngle = angle - 90;

			var xSpeed = Math.cos(adjustedAngle * Math.PI / 180.0) * object.maxSpeed * magnitude / 1000;
			var ySpeed = Math.sin(adjustedAngle * Math.PI / 180.0) * object.maxSpeed * magnitude / 1000;

			object.xSpeed = xSpeed;
			object.ySpeed = ySpeed;

			// console.log('controller ' + i + ' angle: ' + angle + ' magnitude: ' + magnitude);

			if (object.type == 2 && controller.getTap()) {
				fireBall = object.fireBall();
				self.objects.push(fireBall);
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
		var object = self.objects[i];
		if (object.active) {
			objects.push(self.objects[i].frontendRepresentation());
		}
	}

	var state = {
		'game': {
			'objects': objects
		},
		'events': self.pendingEvents
	};
	if (self.pendingEvents.length) {
		self.pendingEvents = [];
	}

	return state;
};

PaperGameEngine.prototype.sendOneTimeEvent = function(eventType, x, y) {
	var self = this;

	self.pendingEvents.push({'type': eventType, 'x': x, 'y': y});
};
