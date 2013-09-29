var entityModule = require('./entity.js');

const BASE_SPEED = 120;
const DASH_SPEED = 300;
const DASH_DURATION = 1250;
const DASH_COOLDOWN = 1000;

function Fighter(engine, x, y, xSpeed, ySpeed) {
    var self = this;

    entityModule.Entity.apply(self, arguments);
    self.type = entityModule.TYPE_FIGHTER;
    self.xSpeed = 25 / 1000;
    self.ySpeed = 25 / 1000;
    self.maxSpeed = BASE_SPEED;
    self.attackMode = false;
	self.isOnCooldown = false;
}

Fighter.prototype = new entityModule.Entity();

Fighter.prototype.onHit = function(other) {
    var self = this;

    if (self.isInvulnerable) {
        return;
    }

    if (other.type == entityModule.TYPE_DRAGON) {
        // check for fighter attack mode
        if (!self.attackMode) {
            self.takeDamage();
        }
    }
    else if (other.type == entityModule.TYPE_FIREBALL) {
        self.takeDamage();
    }
};

Fighter.prototype.dash = function() {
    var self = this;

    self.attackMode = true;
    self.maxSpeed = DASH_SPEED;
	self.isOnCooldown = true;
	
	// invulnerable during dash
	self.setInvulnerable(DASH_DURATION);

    setTimeout(function() {
        self.maxSpeed = BASE_SPEED;
        self.attackMode = false;

		// start cooldown
		setTimeout(function() {
			self.isOnCooldown = false;
		}, DASH_COOLDOWN);
    }, DASH_DURATION);
}

Fighter.prototype.takeDamage = function() {
    var self = this;

    self.health = self.health - 1;
    if (self.health <= 0) {
        self.die();
    }
    else { // fighter gets injured
        self.engine.sendOneTimeEvent("fighterInjured");

        self.setInvulnerable(entityModule.INJURED_TIME);
    }
}

Fighter.prototype.die = function() {
    var self = this;

    self.engine.sendOneTimeEvent("fighterDie")
    self.active = false;
    self.isInvulnerable = true;

    // respawn in 5 seconds on left side of field
    setTimeout(function() {
        position = generateFighterPosition();
        self.x = position[0];
        self.y = position[1];
        self.health = 2;
        self.heading = entityModule.HEADING_EAST;
        self.active = true;
        self.isInvulnerable = false;
    }, entityModule.RESPAWN_TIME)
}

Fighter.prototype.setInvulnerable = function(time) {
	var self = this;
	
	// invulnerable for time milliseconds
    self.isInvulnerable = true;
    setTimeout(function() {
        self.isInvulnerable = false;
    }, time);
}

Fighter.prototype.frontendRepresentation = function() {
    var self = this;

    json = entityModule.Entity.prototype.frontendRepresentation.apply(self, arguments);

    json.dashing = self.attackMode;
    return json;
}

function generateFighterPosition() {
    var x = 100;
    var y = Math.floor(Math.random() * 400) + 100;

    return [x, y];
}

exports.Fighter = Fighter;
exports.generateFighterPosition = generateFighterPosition;
