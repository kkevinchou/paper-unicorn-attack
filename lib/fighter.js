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

function generateFighterPosition() {
    var x = 100;
    var y = Math.floor(Math.random() * 400) + 100;

    return [x, y];
}

exports.Fighter = Fighter;
exports.generateFighterPosition = generateFighterPosition;
