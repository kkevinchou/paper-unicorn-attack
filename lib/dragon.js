var entityModule = require('./entity.js');
var fireballModule = require('./fireball.js');

function Dragon() {
	var self = this;
	
	self.type = 2;
	self.xSpeed = 50 / 1000;
	self.ySpeed = 0;
}

Dragon.prototype = new entityModule.Entity();
Dragon.prototype.constructor = Dragon;

Dragon.prototype.onHit = function(other) {
	var self = this;
	
	self.health = self.health - 1;
	if (self.health <= 0) {
		self.active = false;
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

	var fireball = new fireballModule.FireBall(self.x, self.y, fireBallXSpeed, fireBallYSpeed);

	return fireball;
}

exports.Dragon = Dragon;
