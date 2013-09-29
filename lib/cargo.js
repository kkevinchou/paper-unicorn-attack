var entityModule = require('./entity.js');

function Cargo() {
    var self = this;
    
    // TODO: scale health according to number of players in the game
    self.type = 1;
    self.health = 20;
    self.xSpeed = 25;
}

Cargo.prototype = new entityModule.Entity();
Cargo.prototype.constructor = Cargo;

exports.Cargo = Cargo;