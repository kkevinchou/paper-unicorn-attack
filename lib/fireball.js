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

    if (other.type == entityModule.TYPE_FIGHTER || other.type == entityModule.TYPE_CARGO) {
        self.die();
    }
}

FireBall.prototype.die = function() {
    var self = this;

    self.engine.sendOneTimeEvent("fireballDie", self.x, self.y);
    self.active = false;
	self.engine.removeObject(self);
}

exports.FireBall = FireBall;
