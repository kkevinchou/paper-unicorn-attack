var entityModule = require('./entity.js');

function FireBall(engine, x, y, xSpeed, ySpeed) {
	var self = this;
	entityModule.Entity.apply(self, arguments);

	self.type = entityModule.TYPE_FIREBALL;
}

FireBall.maxSpeed = 80;

FireBall.prototype = new entityModule.Entity();
FireBall.prototype.constructor = FireBall;

FireBall.prototype.onHit = function(other) {
    var self = this;
	
	if (other.type === entityModule.TYPE_FIREBALL) {
		self.die();
	}
	
	self.active = false;
}

FireBall.prototype.die = function() {
	var self = this;
	
	self.engine.sendOneTimeEvent("fireballDie", self.x, self.y);
	self.active = false;
	
	// TODO: destroy object
}

exports.FireBall = FireBall;
