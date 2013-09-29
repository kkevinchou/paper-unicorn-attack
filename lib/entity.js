const TYPE_CARGO = 0;
const TYPE_FIGHTER = 1;
const TYPE_DRAGON = 2;
const TYPE_FIREBALL = 3;
const TYPE_CLOUD = 4;
const HEADING_EAST = 90;
const HEADING_WEST = 270;

function Entity(engine, x, y, xSpeed, ySpeed) {
    var self = this;

    self.engine = engine;
    self.active = true;
    self.x = x;
    self.y = y;
    self.xSpeed = xSpeed;
    self.ySpeed = ySpeed;
    self.maxSpeed = 50;
    self.type = '';
    self.color = '';
    self.health = 2; // Full = 2, Injured = 1, Dead = 0
    self.heading = HEADING_EAST;
    self.isInvulnerable = false;
    self.frame = 0;
    self.frameTime = 0;
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
        frame: self.frame,
        heading: self.heading,
        color: self.color,
        health: self.health,
        width: self.width,
        height: self.height
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
exports.TYPE_CARGO = TYPE_CARGO;
exports.TYPE_FIGHTER = TYPE_FIGHTER;
exports.TYPE_DRAGON = TYPE_DRAGON;
exports.TYPE_FIREBALL = TYPE_FIREBALL;
exports.TYPE_CLOUD = TYPE_CLOUD;
exports.HEADING_EAST = HEADING_EAST;
exports.HEADING_WEST = HEADING_WEST;
