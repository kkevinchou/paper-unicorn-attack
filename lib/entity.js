function Entity(engine, x, y, xSpeed, ySpeed) {
    var self = this;

	self.engine = engine;
    self.active = true;
    self.x = x;
    self.y = y;
    self.xSpeed = xSpeed;
    self.ySpeed = ySpeed;
    self.maxSpeed = 50;
    self.type = ''; // Fighter = 0, Cargo = 1, Dragon = 2, Fireball = 3
    self.color = '';
	self.health = 2; // Full = 2, Injured = 1, Dead = 0
    self.heading = 90;
}

Entity.prototype.update = function(delta) {
    var self = this;

	if (self.active) {
    	self.x += delta * self.xSpeed;
    	self.y += delta * self.ySpeed;
	}
};

Entity.prototype.frontendRepresentation = function() {
    var self = this;

    var ret = {
        type: self.type,
        x: self.x,
        y: self.y,
        heading: self.heading,
        color: self.color,
        health: self.health
    };
    if (self.controller) {
        ret.name = self.controller.name;
    }
    if (self.type == 4) {
        // cloud
        ret.cloudSize = self.cloudSize;
        ret.cloudPattern = self.cloudPattern;
    }

    return ret;
};

exports.Entity = Entity;
