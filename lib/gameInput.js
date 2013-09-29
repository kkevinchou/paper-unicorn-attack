function ControllerConnection(game, socket) {
    var self = this;

    self.game = game;
    self.socket = socket;

    self.angle = 0;
    self.magnitude = 0;
    self.name = "";
    self.id = socket.id;
    self.registered = false;
    self.pendingTap = false;

    console.log('new socket.io connection');
    socket.on('join', function(data) {
        console.log(data['name'], 'joined the game');
        self.name = data['name'];

        self.game.registerUser(self);
        self.registered = true;
    });

    socket.on('move', function (data) {
        console.log(data['name'], 'sent motion', data);
        self.angle = data.angle;
        self.magnitude = data.magnitude;
    });

    socket.on('tap', function (data) {
        console.log(data['name'], 'tapped', data);
        self.pendingTap = true;
    });

    socket.on('quit', function (data) {
        if (self.registered) {
            self.registered = false;
            self.game.unregisterUser(self);
        }
    });

    socket.on('disconnect', function () {
        if (self.registered) {
            self.registered = false;
            self.game.unregisterUser(self);
        }
    });
};

ControllerConnection.prototype.getID = function()
{
    return this.id;
};

ControllerConnection.prototype.getAngle = function() // Degrees 0.0 -> 360.0, 0 at top going clockwise
{
    return this.angle;
};

ControllerConnection.prototype.getMagnitude = function()    // 0.0 -> 1.0
{
    var self = this;

    var magnitude = Math.min(255, self.magnitude);
    magnitude = Math.max(0, magnitude);
    return magnitude / 255.0;
};

ControllerConnection.prototype.getTap = function()
{
    var self = this;

    var ret = false;
    if (self.pendingTap) {
        ret = true;
        self.pendingTap = false;
    }

    return ret;
}

ControllerConnection.prototype.sendConfig = function(config) {
    var self = this;

    self.socket.emit('config', config);
};

exports.ControllerConnection = ControllerConnection;
