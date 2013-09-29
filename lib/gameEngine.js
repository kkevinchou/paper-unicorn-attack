var sys = require('sys');
var events = require('events');

var dragonModule = require('./dragon.js');
var fighterModule = require('./fighter.js');
var cargoModule = require('./cargo.js');
var entityModule = require('./entity.js');
var cloudModule = require('./cloud.js');

const CARGO_SPEED = 10

function PaperGameEngine () {
    var self = this;

    self.playerIdTracker = 0;

    self.objects = [];
    self.pendingEvents = [];
    self.clouds = [];

    self.canvasWidth = 1000;
    self.canvasHeight = 600;


    self.cargo = new cargoModule.Cargo(self, 0, self.canvasHeight/2, CARGO_SPEED / 1000, 0);
    self.objects.push(self.cargo);
    self.ended = false;

    self.generateClouds(8);    // generates 8 clouds
};
sys.inherits(PaperGameEngine, events.EventEmitter);

module.exports = PaperGameEngine;

PaperGameEngine.prototype.registerUser = function(controller) {
    var self = this;

    var playerId = self.playerIdTracker++;

    var newPlayer = null
    var configToSend = null;

    if (playerId % 2 == 0) {
        newPlayer = new fighterModule.Fighter(self, 0, 0, 0, 0);
        configToSend = {"character-type": "fighter", "color": "blue" };
        position = fighterModule.generateFighterPosition();
    } else {
        newPlayer = new dragonModule.Dragon(self, 0, 0, 0, 0);
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
            self.removeObject(object);
            break;
        }
    }
};

PaperGameEngine.prototype.removeObject = function(objectToRemove) {
    var self = this;

    for (var i = 0; i < self.objects.length; i++) {
        var object = self.objects[i];
        if (object == objectToRemove) {
            self.objects.splice(i, 1);
            break;
        }
    }
};

PaperGameEngine.prototype.generateClouds = function (count) {
    var self = this;

    for (var i=0; i<count; i++) {
    	var cloud = new cloudModule.Cloud(self, 0, 0, 0, 0);
    	cloud.randomizeCloud();
    	self.clouds.push(cloud);
    	self.objects.push(cloud);
    }
};

PaperGameEngine.prototype.processFrame = function (dt, next) {
    var self = this;

    if (self.ended) {
        next(null);
        return;
    }

	var currentObjects = self.objects.slice(0);
	
    for (var i = 0; i < currentObjects.length; i++) {
        var object = currentObjects[i];

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

			if (controller.getTap()) {
				if (object.type == entityModule.TYPE_DRAGON) {
					var fireBall = object.fireBall();
					if (fireBall) {
						self.objects.push(fireBall);
					}
				} else if (object.type == entityModule.TYPE_FIGHTER) {
					object.dash();
				}
			}
		}

        object.update(dt);
    }

    self.checkCollisions();

    next(null);
};

PaperGameEngine.prototype.checkCollisions = function() {
    var self = this;

    for (var i = 0; i < self.objects.length; i++) {
		for (var j = 0; j < self.objects.length; j++) {
		    var object1 = self.objects[i];
	        var object2 = self.objects[j];
		    if (entityModule.Entity.isIntersecting(object1, object2)) {
				object1.onHit(object2);
				object2.onHit(object1);
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

    if (self.ended) {
        state.game['ended'] = true;
        state.game['winner'] = self.winner;
    }

    return state;
};

PaperGameEngine.prototype.endGame = function(winner) {
    var self = this;

    setTimeout(function() {
      self.emit('reset');
    }, 10000);

    self.ended = true;
    self.winner = winner; // true if cargo, else dragons
};

PaperGameEngine.prototype.sendOneTimeEvent = function(eventType, x, y) {
    var self = this;

    self.pendingEvents.push({'type': eventType, 'x': x, 'y': y});
};
