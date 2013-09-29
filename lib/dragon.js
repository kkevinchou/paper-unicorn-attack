var entityModule = require('./entity.js');
var fireballModule = require('./fireball.js');

function Dragon(engine, x, y, xSpeed, ySpeed) {
	var self = this;
	entityModule.Entity.apply(self, arguments);
	
	self.type = 2;
    self.heading = 270;
}

Dragon.prototype = new entityModule.Entity();
Dragon.prototype.constructor = Dragon;

Dragon.prototype.onHit = function(other) {
	var self = this;
	
	if (other.type === 0) {
		// check for fighter attack mode
		if (other.attackMode) {
			self.takeDamage();
		}
		else {
			// TODO: set plane velocity to 0?
		}
	}
	else if (other.type === 1) {
		self.takeDamage();
	}
}

Dragon.prototype.fireBall = function() {
	var self = this;
	
    var normValue = Math.sqrt(self.xSpeed * self.xSpeed + self.ySpeed * self.ySpeed);

    if (normValue == 0) {
        normValue = 1;
    }

    var fireBallXSpeed = self.xSpeed / normValue * fireballModule.FireBall.maxSpeed / 1000;
    var fireBallYSpeed = self.ySpeed / normValue * fireballModule.FireBall.maxSpeed / 1000;

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
	
	// respawn in 5 seconds on right side of field
	setTimeout(function() {
		self.x = 500;
		self.y = 500;
		self.health = 2;
		self.heading = 270;
		self.active = true;
		self.invulnerable = false;
	})
}

exports.Dragon = Dragon;
