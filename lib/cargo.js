var entityModule = require('./entity.js');

function Cargo(engine, x, y, xSpeed, ySpeed) {
    var self = this;

    entityModule.Entity.apply(self, arguments);
    // TODO: scale health according to number of players in the game
    self.type = entityModule.TYPE_CARGO;
    self.health = 20;
    self.engine = engine;
    self.width = 80;
    self.height = 35;
}

Cargo.prototype = new entityModule.Entity();
Cargo.prototype.constructor = Cargo;

Cargo.prototype.update = function(delta) {
    var self = this;
    
    entityModule.Entity.prototype.update.apply(self, arguments);
    if (self.x >= self.engine.canvasWidth) {
        self.engine.endGame(true);
    }
}

Cargo.prototype.onHit = function(other) {
    var self = this;

    if (other.type == entityModule.TYPE_FIREBALL) {
        self.takeDamage();
    }
};

Cargo.prototype.takeDamage = function() {
	var self = this;
	
	self.engine.sendOneTimeEvent('audio', { filename: 'unicorn.wav' });

    self.health = self.health - 1;
    if (self.health <= 0) {
        self.die();
    }
    else { // cargo plane gets injured
        // invulnerable for 2 seconds
        self.isInvulnerable = true;
        setTimeout(function() {
            self.isInvulnerable = false;
        }, entityModule.INJURED_TIME);
    }
};

Cargo.prototype.die = function() {
	var self = this;

    self.active = false;
    self.isInvulnerable = true;

    self.engine.endGame(false);
};

exports.Cargo = Cargo;
