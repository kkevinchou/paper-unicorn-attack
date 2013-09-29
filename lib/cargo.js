var entityModule = require('./entity.js');

function Cargo() {
    var self = this;
    
    // TODO: scale health according to number of players in the game
    self.type = 0;
    self.health = 20;
    self.xSpeed = 10 / 1000;
}

Cargo.prototype = new entityModule.Entity();
Cargo.prototype.constructor = Cargo;

exports.Cargo = Cargo;
