var engineModule = require('./gameEngine.js');
var entityModule = require('./entity.js');

function FireBall(engine, x, y, xSpeed, ySpeed) {
	var self = this;
	entityModule.Entity.call(self, engine);

	self.type = 3;
	self.x = x;
	self.y = y;
    self.xSpeed = xSpeed;
    self.ySpeed = ySpeed;
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

exports.FireBall = FireBall;
