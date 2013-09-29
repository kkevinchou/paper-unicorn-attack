var entityModule = require('./entity.js');

function FireBall(engine, x, y, xSpeed, ySpeed) {
    var self = this;
    entityModule.Entity.apply(self, arguments);

    self.type = entityModule.TYPE_FIREBALL;
    self.width = 50;
    self.height = 50;
}

FireBall.maxSpeed = 80;

FireBall.prototype = new entityModule.Entity();
FireBall.prototype.constructor = FireBall;

FireBall.prototype.update = function(delta) {
    var self = this;

    entityModule.Entity.prototype.update.apply(self, arguments);

    if (self.x + (self.width / 2) < 0) {
        self.die();
    } else if (self.x - (self.width / 2) > self.engine.canvasWidth) {
        self.die();
    } else if (self.y + (self.height / 2) < 0) {
        self.die();
    } else if (self.y - (self.height / 2) > self.engine.canvasHeight) {
        self.die();
    }

};

FireBall.prototype.onHit = function(other) {
    var self = this;

    if (other.type == entityModule.TYPE_FIGHTER || other.type == entityModule.TYPE_CARGO) {
        self.die();
        a;
    }
}

FireBall.prototype.die = function() {
    var self = this;

    self.engine.sendOneTimeEvent("fireballDie", self.x, self.y);
    self.active = false;
	self.engine.removeObject(self);
}

exports.FireBall = FireBall;
