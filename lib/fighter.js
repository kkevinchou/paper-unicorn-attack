var entityModule = require('./entity.js');

function Fighter(engine, x, y, xSpeed, ySpeed) {
    var self = this;

    entityModule.Entity.apply(self, arguments);
    self.type = entityModule.TYPE_FIGHTER;
    self.xSpeed = 25 / 1000;
    self.ySpeed = 25 / 1000;
}

Fighter.prototype = new entityModule.Entity();

Fighter.prototype.onHit = function(other) {
    var self = this;

	
};

Fighter.prototype.takeDamage = function() {
	var self = this;
	
	self.health = self.health - 1;
	if (self.health <= 0) {
		self.die();
	}
	else { // fighter gets injured
		self.engine.sendOneTimeEvent("fighterInjured");
		
		// invulnerable for 2 seconds
		self.isInvulnerable = true;
		setTimeout(function() {
			self.isInvulnerable = false;
		}, 2000);
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
	})
}

function generateFighterPosition() {
    var x = 100;
    var y = Math.floor(Math.random() * 400) + 100;

    return [x, y];
}

exports.Fighter = Fighter;
exports.generateFighterPosition = generateFighterPosition;
