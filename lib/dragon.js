var entityModule = require('./entity.js');
var fireballModule = require('./fireball.js');

function Dragon() {
	var self = this;
	
	self.type = 2;
	self.xSpeed = 50 / 1000;
	self.ySpeed = 0;
}

Dragon.prototype = new entityModule.Entity();

Dragon.prototype.onHit = function(other) {
	// self.health
}

Dragon.prototype.fireBall = function(direction) {
	
}

exports.Dragon = Dragon;
