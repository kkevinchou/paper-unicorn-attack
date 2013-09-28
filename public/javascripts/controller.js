$(function() {
	ready();
});

var swipeStart = null;
var inGame = false;
function ready () {
	setupSocketIO();
	
	showStartPage();
}

var socket = null;
function setupSocketIO() {
	socket = io.connect('http://localhost');

	socket.on('connect', function (data) {
		socketConnected();
	});

  	socket.on('config', function (data) {
    	setupController(data);
  	});
}

function socketConnected() {
	if (inGame) {
		joinGame();
	}
}

function showStartPage() {
	hideController();
	$('#startPage').show();
	inGame = false;
	$('#join').click(function (data) {
		joinGame();
	});
}

function hideStartPage() {
	$('#startPage').hide();
}

function joinGame() {
	name = $('#name').val();
	if (name) {
		socket.emit('join', {"name":name});
		showController();
	} else {
		alert('Enter a name');
	}
}

function showController() {
	hideStartPage();
	$('#controller').show();
	inGame = true;
}

function hideController() {
	$('#controller').hide();
}

function setupController(data) {
	showController();
	$('#controller').css('background-color', data['color']);
	$('#controller').swipe({
    	swipeStatus:processSwipe
    });
}

function processSwipe(event, phase, direction, distance, duration, fingers) {
	var str = "<h4>Swipe Phase : " + phase + "<br/>";
    str += "x: " + event.x + ", y: " + event.y  + "<br/>";
	if (phase == 'start') {
    	swipeStart = new Object();
		swipeStart.x = event.x;
		swipeStart.y = event.y;
	} else if (phase == 'end') {
		swipeStart = null;
	} else {
		angle = calculateAngle(swipeStart.x, swipeStart.y, event.x, event.y);
		str += "Angle: " + angle + "<br/>";
	}
	str += "Direction from inital touch: " + direction + "<br/>";
	str += "Distance from inital touch: " + distance + "<br/>";
	str += "Duration of swipe: " + duration + "<br/>";
	str += "Fingers used: " + fingers + "<br/></h4>";
	$("#info").html(str);
}

function calculateAngle(startX, startY, destinationX, destinationY) {
	angle = Math.atan((destinationY-startY) / (destinationX-startX)) * 180 / Math.PI;
	if (destinationX > startX) {
		angle += 90;
	} else {
		angle += 270;
	}
	return angle;
}