var entityModule = require('./entity.js');

function Cloud() {
    var self = this;

    self.type = 1
    self.xSpeed = 25 / 1000;
    self.ySpeed = 25 / 1000;
}

Cloud.prototype = new entityModule.Entity();

exports.Cloud = Cloud;
