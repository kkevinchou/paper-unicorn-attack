function Entity() {
    var self = this;

    self.active = true;
    self.x = 0;
    self.y = 0;
    self.xSpeed = 10;
    self.ySpeed = 0;
    self.type = '' // Fighter, Cargo, Dragon
    self.color = ''
}

Entity.prototype.update = function(delta) {
    var self = this;

    self.x += delta * self.xSpeed;
    self.y += delta * self.ySpeed;
}

exports.Entity = Entity;
