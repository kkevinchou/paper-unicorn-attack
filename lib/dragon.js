var entityModule = require('./entity.js');

function Dragon() {
}

Dragon.prototype = new entityModule.Entity();

Dragon.prototype.onHit = function(other) {

}

Dragon.prototype.fireBall = function(direction) {
}

exports.Dragon = Dragon;
