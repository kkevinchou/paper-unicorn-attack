var entityModule = require('./entity.js');

function FireBall(x, y, direction) {
    self.speed = 100;
    self.xSpeed = self.speed * Math.cos(direction);
    self.ySpeed = self.speed * Math.sin(direction);
}

FireBall.prototype.onHit = function(other) {
    other.active = false;
}

exports.FireBall = FireBall;
