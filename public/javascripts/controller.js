$(function() {
	ready();
});

var swipeStart = null;
var inGame = false;
var name = null;
function ready () {
	setupSocketIO();
	
	showStartPage();
}

var socket = null;
function setupSocketIO() {
	socket = io.connect('http://localhost/controller');

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
	$('#join').unbind('click');
	$('#join').click(function (data) {
		joinGame();
	});
}

function hideStartPage() {
	$('#startPage').hide();
	$('#join').unbind('click');
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

function quitGame() {
	socket.emit('quit', {"name": name});
	showStartPage();
}

function showController() {
	hideStartPage();
	$('#controller').show();
	$("#pad").hide();
	inGame = true;
	$('#quit').unbind('click');
	$('#quit').click(function (data) {
		quitGame();
	});
}

function hideController() {
	$('#controller').hide();
	$('#pad').hide();
	$('#bomb').hide();
	$('#quit').unbind('click');
}

function setupController(data) {
	showController();
	$('#handle').text(data['name']);
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
		var imgWidth = $("#pad").width();
		var imgHeight = $("#pad").height();
	} else if (phase == 'end') {
		angle = calculateAngle(swipeStart.x, swipeStart.y, event.x, event.y);
		magnitude = calculateMagnitude(swipeStart.x, swipeStart.y, event.x, event.y);
		var eventType = 'move';
		if (direction) {
			eventType = 'move';
			$("#pad").fadeOut(500);
		} else {
			eventType = 'tap';
			centerX = $('#controller').width() / 2;
			centerY = $('#controller').height() / 2;
			angle = calculateAngle(centerX, centerY, event.x, event.y);
			magnitude = calculateMagnitude(centerX, centerY, event.x, event.y);
			$("#bomb").show();
			var imgWidth = $("#bomb").width();
			var imgHeight = $("#bomb").height();
			$('#bomb').css({"position":"absolute", "top": (event.y - imgHeight/2) + "px", "left": (event.x - imgWidth/2) + "px"});
			$("#bomb").fadeOut(500);
		}
		socket.emit(eventType, {"name": name, "angle" :angle, "magnitude": magnitude});
		swipeStart = null;
	} else {
		angle = calculateAngle(swipeStart.x, swipeStart.y, event.x, event.y);
		str += "Angle: " + angle + "<br/>";
		var imgWidth = $("#pad").width();
		var imgHeight = $("#pad").height();
		$('#pad').show();
		$('#pad').css({"position":"absolute", "top": (event.y - imgHeight/2) + "px", "left": (event.x - imgWidth/2) + "px"});
	}
	str += "Direction from inital touch: " + direction + "<br/>";
	str += "Distance from inital touch: " + distance + "<br/>";
	str += "Duration of swipe: " + duration + "<br/>";
	str += "Fingers used: " + fingers + "<br/></h4>";
	$("#info").html(str);
}

function calculateMagnitude(startX, startY, destinationX, destinationY) {
	magnitude = Math.sqrt(Math.pow((destinationX-startX), 2), Math.pow((destinationY-startY), 2))
	return magnitude;
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