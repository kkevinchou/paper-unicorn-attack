var entityModule = require('./entity.js');
var fireballModule = require('./fireball.js');

function Dragon(engine, x, y, xSpeed, ySpeed) {
	var self = this;
	entityModule.Entity.apply(self, arguments);
	
	self.type = entityModule.TYPE_DRAGON;
    self.heading = 270;
}

Dragon.prototype = new entityModule.Entity();
Dragon.prototype.constructor = Dragon;

Dragon.prototype.onHit = function(other) {
	var self = this;
	
	if (other.type === entityModule.TYPE_CARGO) {
		// check for fighter attack mode
		if (other.attackMode) {
			self.health = self.health - 1;
			if (self.health <= 0) {
				self.die();
			}
		}
		else {
			// set plane velocity to 0?
		}
	}
	else {
		
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

Dragon.prototype.die = function() {
	var self = this;
	
	self.engine.sendOneTimeEvent("dragonDie")
	self.active = false;
	// set respawn
}

exports.Dragon = Dragon;
