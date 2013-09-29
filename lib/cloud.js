var entityModule = require('./entity.js');

var numCloudPatternTypes = 3;
function Cloud() {
    var self = this;

    self.cloudSize = 1;
    self.type = 4;
    self.xSpeed = -25 / 1000;
    self.ySpeed = 0;
    self.x = 1000 - 50/2.0;
    self.y = 300;
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
