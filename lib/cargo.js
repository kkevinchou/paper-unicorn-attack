var entityModule = require('./entity.js');

function Cargo(engine, x, y, xSpeed, ySpeed) {
    var self = this;

    entityModule.Entity.apply(self, arguments);
    // TODO: scale health according to number of players in the game
    self.type = entityModule.TYPE_CARGO;
    self.health = 20;
    self.engine = engine;
}

Cargo.prototype = new entityModule.Entity();
Cargo.prototype.constructor = Cargo;

Cargo.prototype.update = function(delta) {
    var self = this;
    
    entityModule.Entity.prototype.update.apply(self, arguments);
    if (self.x == self.engine.canvasWidth - self.width) {
    self.engine.endGame(true);
    }
}

Cargo.prototype.onHit = function(other) {
    var self = this;

    if (other.type == entityModule.TYPE_FIREBALL) {
    self.health--;
        if (self.health === 0) {
        // end game
        self.engine.endGame(false);
    }
    }
};

exports.Cargo = Cargo;
