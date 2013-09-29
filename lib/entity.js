function Entity() {
    var self = this;

    self.active = true;
    self.x = 500;
    self.y = 200;
    self.xSpeed = 0;
    self.ySpeed = 0;
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
