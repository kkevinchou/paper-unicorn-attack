
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var controller = require('./routes/controller');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/controller', controller.index);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var numPlayers = 0;
io.sockets.on('connection', function (socket) {
	console.log('new socket.io connection');
	numPlayers++;
	if (numPlayers % 2 == 0) {
		socket.emit('config', { "character-type": "dragon", "color": "red" });
	} else {
		socket.emit('config', { "character-type": "dragon", "color": "blue" });
	}
	
	socket.on('move', function (data) {
		console.log('character sent motion', data);
	});
});

var gameLoopModule = require('./lib/gameLoop.js');
gameLoopModule.start();
