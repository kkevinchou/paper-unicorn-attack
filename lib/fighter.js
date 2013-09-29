var entityModule = require('./entity.js');

function Fighter() {
    var self = this;

    self.type = 1
    self.xSpeed = 25 / 1000;
    self.ySpeed = 25 / 1000;
}

Fighter.prototype = new entityModule.Entity();

exports.Fighter = Fighter;
