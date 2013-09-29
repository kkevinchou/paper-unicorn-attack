var entityModule = require('./entity.js');

var numCloudPatternTypes = 3;
function Cloud(engine, x, y, xSpeed, ySpeed) {
    var self = this;
    entityModule.Entity.apply(self, arguments);

    entityModule.Entity.apply(self, arguments);

    self.cloudSize = 1;
    self.type = entityModule.TYPE_CLOUD;
    self.width = 50;
    self.height = 50;

    // the type of sprite to use for that section of the cloud
    self.cloudPattern = [Math.floor(Math.random()*numCloudPatternTypes)];
}

Cloud.prototype = new entityModule.Entity();


Cloud.prototype.setCloudSize = function(size) {
    this.cloudSize = size;
    self.width = 50*size;
    self.x = 1000 - self.width/2.0;
    this.cloudPattern = [];
    for (var i = 0; i < size; i++) {
        this.cloudPattern.push(Math.floor(Math.random()*numCloudPatternTypes));
    }
};

exports.Cloud = Cloud;
