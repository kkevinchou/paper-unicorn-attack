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
	
	var fireball = new fireballModule.FireBall(self.x, self.y, self.xSpeed, self.ySpeed);
	
	return fireball;
}

exports.Dragon = Dragon;
