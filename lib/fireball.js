var entityModule = require('./entity.js');

function FireBall(x, y, xSpeed, ySpeed) {
	var self = this;
	self.type = 3;
	self.x = x;
	self.y = y;
    self.xSpeed = xSpeed;
    self.ySpeed = ySpeed;
}

FireBall.prototype.onHit = function(other) {
    var self = this;
	
	other.active = false;
}

exports.FireBall = FireBall;
