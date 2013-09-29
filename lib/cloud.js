var entityModule = require('./entity.js');

var numCloudPatternTypes = 3;
function Cloud(engine, x, y, xSpeed, ySpeed) {
    var self = this;
    entityModule.Entity.apply(self, arguments);

    self.cloudSize = 1;
    self.type = entityModule.TYPE_CLOUD;
    self.width = 100;
    self.height = 100;

    // the type of sprite to use for that section of the cloud
    self.cloudPattern = [Math.floor(Math.random()*numCloudPatternTypes)];
}

Cloud.prototype = new entityModule.Entity();

Cloud.prototype.update = function(delta) {
    var self = this;
    
    entityModule.Entity.prototype.update.apply(self, arguments);
    if (self.x > (self.engine.canvasWidth + self.width + 50)) {
        self.randomizeCloud();
    }
}

Cloud.prototype.randomizeCloud = function() {
    var self = this;

    self.setCloudSize(Math.floor(Math.random()*4) + 1);
    var x = Math.round(Math.random() * -(self.engine.canvasWidth / 1.5));
    var y = Math.round(Math.random() * (self.engine.canvasHeight - self.height));
    var speedX = (Math.round(Math.random() * 50.0) / 1000.0) + (25/1000.0);

    self.x = x;
    self.y = y;
    self.xSpeed = speedX;
    
    self.resetX();
};

Cloud.prototype.setCloudSize = function(size) {
    var self = this;

	self.cloudSize = size;

    if (size == 1) {
        self.width = 100

    } else {
        self.width = 70*size;

    }

	self.cloudPattern = [];
	for (var i = 0; i < size; i++) {
		self.cloudPattern.push(Math.floor(Math.random()*numCloudPatternTypes));
	}
};

Cloud.prototype.resetX = function() {
    this.x = Math.floor(this.x - this.width/2.0);
}

exports.Cloud = Cloud;
