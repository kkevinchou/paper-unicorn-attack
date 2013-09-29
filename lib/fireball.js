var entityModule = require('./entity.js');

function FireBall(engine, x, y, xSpeed, ySpeed) {
	var self = this;
	entityModule.Entity.apply(self, arguments);

	self.type = 3;
}

FireBall.maxSpeed = 80;

FireBall.prototype = new entityModule.Entity();
FireBall.prototype.constructor = FireBall;

FireBall.prototype.onHit = function(other) {
    var self = this;
	
	if (other.type === 0) {
		self.engine.sendOneTimeEvent("fireball", self.x, self.y)
	}
	
	self.active = false;
}

FireBall.prototype.die = function() {
	var self = this;
	
	self.active = false;
}

exports.FireBall = FireBall;
