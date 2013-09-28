function Entity() {
    var self = this;

    self.active = true;
    self.x = 0;
    self.y = 0;
    self.xSpeed = 10;
    self.ySpeed = 0;
    self.type = ''; // Fighter = 0, Cargo = 1, Dragon = 2
    self.color = '';
	self.health = 2; // Full = 2, Injured = 1, Dead = 0
}

Entity.prototype.update = function(delta) {
    var self = this;

    self.x += delta * self.xSpeed;
    self.y += delta * self.ySpeed;
};

Entity.prototype.frontendRepresentation = function() {
    var self = this;

    var ret = {
        type: self.type,
        x: self.x,
        y: self.y,
        color: self.color,
        health: self.health
    };

    return ret;
};

exports.Entity = Entity;
