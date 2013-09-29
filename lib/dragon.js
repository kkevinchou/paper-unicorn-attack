var entityModule = require('./entity.js');
var fireballModule = require('./fireball.js');

function Dragon(engine, x, y, xSpeed, ySpeed) {
	var self = this;
	entityModule.Entity.apply(self, arguments);
	
	self.type = entityModule.TYPE_DRAGON;
    self.heading = entityModule.HEADING_WEST;
}

var NORMAL_FRAME = 0;
var FLAP_FRAME = 1;
var FIRE_FRAME = 2;
var FRAME_TIME = 500;

Dragon.prototype = new entityModule.Entity();
Dragon.prototype.constructor = Dragon;

Dragon.prototype.update = function(delta) {
    var self = this;

    entityModule.Entity.prototype.update.apply(self, arguments);
    self.frameTime += delta;

    if (self.frame == NORMAL_FRAME && self.frameTime >= FRAME_TIME) {
        self.frameTime -= FRAME_TIME;
        self.frame = 1;
    } else if (self.frame == FLAP_FRAME && self.frameTime >= FRAME_TIME) {
        self.frameTime -= FRAME_TIME;
        self.frame = 0;
    } else if (self.frame == FIRE_FRAME && self.frameTime >= FRAME_TIME) {
        self.frameTime -= FRAME_TIME;
        self.frame = 0;
    }

};

Dragon.prototype.onHit = function(other) {
	var self = this;
	
	if (self.isInvulnerable) {
		return;
	}
	
	if (other.type === entityModule.TYPE_CARGO) {
		// check for fighter attack mode
		if (other.attackMode) {
			self.takeDamage();
		}
		else {
			other.takeDamage();
		}
	}
	else if (other.type === 1) {
		self.takeDamage();
	}
}

Dragon.prototype.fireBall = function() {
	var self = this;

    self.frame = FIRE_FRAME;
    self.frameTime = 0;
	
    var normValue = Math.sqrt(self.xSpeed * self.xSpeed + self.ySpeed * self.ySpeed);

    if (normValue == 0) {
        normValue = 1;
    }

    angle = self.heading;
    adjustedAngle = angle - 90;

    var fireBallXSpeed = Math.cos(adjustedAngle * Math.PI / 180.0) * fireballModule.FireBall.maxSpeed / 1000;
    var fireBallYSpeed = Math.sin(adjustedAngle * Math.PI / 180.0) * fireballModule.FireBall.maxSpeed / 1000;

    var fireball = new fireballModule.FireBall(self.engine, self.x, self.y, fireBallXSpeed, fireBallYSpeed);

    return fireball;
}

Dragon.prototype.takeDamage = function() {
	var self = this;
	
	self.health = self.health - 1;
	if (self.health <= 0) {
		self.die();
	}
	else { // dragon gets injured
		self.engine.sendOneTimeEvent("dragonInjured");
		
		// invulnerable for 2 seconds
		self.isInvulnerable = true;
		setTimeout(function() {
			self.isInvulnerable = false;
		}, 2000);
	}
}

Dragon.prototype.die = function() {
	var self = this;
	
	self.engine.sendOneTimeEvent("dragonDie")
	self.active = false;
	self.isInvulnerable = true;
	
	// respawn in 5 seconds on right side of field
	setTimeout(function() {
        position = generateDragonPosition();
		self.x = position[0];
		self.y = position[1];
		self.health = 2;
		self.heading = entityModule.HEADING_WEST;
		self.active = true;
		self.isInvulnerable = false;
	})
}

function generateDragonPosition() {
    var x = 900;
    var y = Math.floor(Math.random() * 400) + 100;

    return [x, y];
}

exports.Dragon = Dragon;
exports.generateDragonPosition = generateDragonPosition;
