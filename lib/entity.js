const TYPE_CARGO = 0;
const TYPE_FIGHTER = 1;
const TYPE_DRAGON = 2;
const TYPE_FIREBALL = 3;
const TYPE_CLOUD = 4;
const HEADING_EAST = 90;
const HEADING_WEST = 270;
const INJURED_TIME = 2000;
const INJURE_FRAME_TIME = 200;
const RESPAWN_TIME = 5000;

var idSequence = 1;
function Entity(engine, x, y, xSpeed, ySpeed) {
    var self = this;

    self.id = idSequence++;
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
	self.injureFrame = 0;
	self.injureFrameTime = 0;
    self.frame = 0;
    self.frameTime = 0;
    self.width = 50;
    self.height = 50;
    self.colorId = Math.floor(Math.random() * 11);
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

    return (!(left1 > right2 || left2 > right1 || top1 > bottom2 || top2 > bottom1));
};

Entity.prototype.update = function(delta) {
    var self = this;

    if (self.active) {
        self.x += delta * self.xSpeed;
        self.y += delta * self.ySpeed;
    }

    if (self.type == TYPE_FIGHTER || self.type == TYPE_DRAGON || self.type == TYPE_CARGO) {
        if (self.x < 0) {
            self.x = 0;
        } else if (self.x > self.engine.canvasWidth && self.type != TYPE_CARGO) {
            self.x = self.engine.canvasWidth;
        }

        if (self.y < 0) {
            self.y = 0;
        } else if (self.y > self.engine.canvasHeight) {
            self.y = self.engine.canvasHeight;
        }
    }

	// set flicker while invulnerable
	if (self.type != TYPE_FIREBALL) {
		if (self.isInvulnerable) {	
			self.injureFrameTime += delta;
			if (self.injureFrame == 0 && self.injureFrameTime >= INJURE_FRAME_TIME) {
		        self.injureFrameTime -= INJURE_FRAME_TIME;
		        self.injureFrame = 1;
		    } else if (self.injureFrame == 1 && self.injureFrameTime >= INJURE_FRAME_TIME) {
		        self.injureFrameTime -= INJURE_FRAME_TIME;
		        self.injureFrame = 0;
		    }
		}
		else {
			self.injureFrame = 0;
		}
	}
};

Entity.prototype.onHit = function(object1, object2) {

}

Entity.prototype.frontendRepresentation = function() {
    var self = this;

    var ret = {
        id: self.id,
        type: self.type,
        x: self.x,
        y: self.y,
        frame: self.frame,
		injureFrame: self.injureFrame,
        heading: self.heading,
        color: self.color,
        health: self.health,
        width: self.width,
        height: self.height,
        colorId: self.colorId
    };
    if (self.controller) {
        ret.name = self.controller.name;
    }
    if (self.type == TYPE_CLOUD) {
        // cloud
        ret.cloudSize = self.cloudSize;
        ret.cloudPattern = self.cloudPattern;
    }
	else if (self.type == TYPE_FIGHTER) {
		ret.dashing = self.attackMode;
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
exports.INJURED_TIME = INJURED_TIME;
exports.RESPAWN_TIME = RESPAWN_TIME;
