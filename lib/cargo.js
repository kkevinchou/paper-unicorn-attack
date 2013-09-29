var entityModule = require('./entity.js');

function Cargo(engine, x, y, xSpeed, ySpeed) {
    var self = this;

    entityModule.Entity.apply(self, arguments);
    // TODO: scale health according to number of players in the game
    self.type = entityModule.TYPE_CARGO;
    self.health = 20;
}

Cargo.prototype = new entityModule.Entity();
Cargo.prototype.constructor = Cargo;

Cargo.prototype.onHit = function(other) {
    var self = this;
};

exports.Cargo = Cargo;
