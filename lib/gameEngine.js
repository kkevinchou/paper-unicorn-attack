var dragonModule = require('./dragon.js');
var fighterModule = require('./fighter.js');
var cargoModule = require('./cargo.js');
var entityModule = require('./entity.js');

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

			var xSpeed = Math.cos((angle - 90) * Math.PI / 180.0) * object.maxSpeed / 1000;
			var ySpeed = Math.sin((angle - 90) * Math.PI / 180.0) * object.maxSpeed / 1000;

			object.xSpeed = xSpeed;
			object.ySpeed = ySpeed;

			console.log('controller ' + i + ' angle: ' + angle + ' magnitude: ' + magnitude);

			if (controller.getTap()) {
				console.log('TAP!');
			}
		}

		object.update(dt);
	}

	next(null);
};

PaperGameEngine.prototype.checkCollisions = function() {
    var self = this;
    var CARGO = 0;
    var FIGHTER = 1;
    var DRAGON = 2;
    var FIREBALL = 3;
    var CLOUD = 4;

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
