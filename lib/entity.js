function Entity() {
    var self = this;

    self.active = true;
    self.x = 0;
    self.y = 0;
    self.width = 10;
    self.height = 10;
    self.xSpeed = 0;
    self.ySpeed = 0;
    self.maxSpeed = 25;
    self.type = ''; // Cargo = 0, Fighter = 1, Dragon = 2
    self.color = '';
    self.health = 2; // Full = 2, Injured = 1, Dead = 0
}

Entity.isIntersecting = function(entity1, entity2) {
    var left1 = entity1.x - entity1.width/2;
    var top1 = entity1.y - entity1.height/2;
    var right1 = entity1.x + entity1.width/2;
    var bottom1 = entity1.y + entity1.height/2;
    var left2 = entity2.x - entity2.width/2;
    var top2 = entity2.y - entity2.height/2;
    var right2 = entity2.x + entity2.width/2;
    var bottom2 = entity2.y + entity2.height/2;

    return (left1 <= right2 || left2 <= right1) && (top1 <= bottom2 || top2 <= bottom1); 
};

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
    if (self.controller) {
        ret.name = self.controller.name;
    }

    return ret;
};

exports.Entity = Entity;
