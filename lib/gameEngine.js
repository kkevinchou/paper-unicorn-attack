var sys = require('sys');
var events = require('events');


var dragonModule = require('./dragon.js');
var fighterModule = require('./fighter.js');
var cargoModule = require('./cargo.js');
var entityModule = require('./entity.js');
var cloudModule = require('./cloud.js');

function PaperGameEngine () {
	var self = this;

	self.playerIdTracker = 0;

	self.objects = [];
	self.pendingEvents = [];
    self.cargo = new cargoModule.Cargo();
    self.objects.push(self.cargo);
    self.clouds = [];

    self.canvasWidth = 1000;
    self.canvasHeight = 600;

    self.generateClouds(6);	// generates 6 clouds
};
sys.inherits(PaperGameEngine, events.EventEmitter);

module.exports = PaperGameEngine;

PaperGameEngine.prototype.registerUser = function(controller) {
	var self = this;

	var playerId = self.playerIdTracker++;

	var newPlayer = null
	var configToSend = null;

	if (playerId % 2 == 0) {
		newPlayer = new fighterModule.Fighter();
		configToSend = {"character-type": "fighter", "color": "blue" };
		position = fighterModule.generateFighterPosition();
	} else {
		newPlayer = new dragonModule.Dragon(self, 0, 0, 50/1000, 0);
		configToSend = {"character-type": "dragon", "color": "red" };
		position = dragonModule.generateDragonPosition();
	}

	newPlayer.x = position[0];
	newPlayer.y = position[1];

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

PaperGameEngine.prototype.generateClouds = function (count) {
	var self = this;

    for (var i=0; i<count; i++) {
    	var x = Math.round(Math.random() * self.canvasWidth);
    	var y = Math.round(Math.random() * self.canvasHeight);
    	var speedX = Math.round(Math.random() * (20 / 1000)) - (10/1000);
    	var speedY = Math.round(Math.random() * (20 / 1000)) - (10/1000);

    	var cloud = new cloudModule.Cloud(self, x, y, speedX, speedY);
    	self.clouds.push(cloud);
    	self.objects.push(cloud);
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

PaperGameEngine.prototype.checkCollisions = function() {
    var self = this;

    for (var i = 0; i < self.objects.length; i++) {
	for (var j = i+1; j < self.objects.length; j++) {
	    var object1 = self.objects[i];
            var object2 = self.objects[j];
	    if (entityModule.Entity.isIntersecting(object1, object2)) {
		object1.onHit(object1);
		object2.onHit(object2);
	    }
	}
    }
}

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
