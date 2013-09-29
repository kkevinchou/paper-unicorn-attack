$(function() {
	ready();
});

function isMobile() {
	if( navigator.userAgent.match(/Android/i)
 		|| navigator.userAgent.match(/webOS/i)
 		|| navigator.userAgent.match(/iPhone/i)
 		|| navigator.userAgent.match(/iPad/i)
 		|| navigator.userAgent.match(/iPod/i)
 		|| navigator.userAgent.match(/BlackBerry/i)
 		|| navigator.userAgent.match(/Windows Phone/i)){
    	return true;
	} else {
    	return false;
  	}
}

var swipeStart = null;
var swipeLast = null;
var inGame = false;
var name = null;
function ready () {
	document.ontouchmove = function(event){
		event.preventDefault();
	}
	setupSocketIO();
	
	showStartPage();
}

var socket = null;
function setupSocketIO() {
	socket = io.connect('/controller');

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
		$('input#name').blur();
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
	$("#knob").hide();
	inGame = true;
	$('#quit').unbind('click');
	$('#quit').click(function (data) {
		quitGame();
	});
	
	$('#pad').css('background-color', '#00ffff');
	if (isMobile()) {
		$("#controls").detach().insertBefore("#pad");
		$('#pad').removeClass('left').addClass('bottom');
		$('#controls').removeClass('right').addClass('top');
	} else {
		$("#pad").detach().insertBefore("#controls");
		$('#pad').removeClass('bottom').addClass('left');
		$('#controls').removeClass('top').addClass('right');
	}
}

function hideController() {
	$('#controller').hide();
	$('#knob').hide();
	$('#bomb').hide();
	$('#quit').unbind('click');
}

function setupController(data) {
	showController();
	$('#handle').text(data['name']);
	$('#controls').css('background-color', data['color']);
	$('#controls').click(function(event) {
		tap();
	});
	$('#pad').swipe({
		swipeStatus:processSwipe
    });
}

function processSwipe(event, phase, direction, distance, duration, fingers) {
	event.stopPropagation();
	var str = "<h4>Swipe Phase : " + phase + "<br/>";
	var x = event.pageX;
	if (!x) {
		if (event.touches) {
			var touch = event.touches[0];
			if (touch) {
				x = touch.pageX;
			} else {
				x = 0;
			}
		} else {
			x = 0;
		}
	}
	var y = event.pageY;
	if (!y) {
		if (event.touches) {
			var touch = event.touches[0];
			if (touch) {
				y = touch.pageY;
			} else {
				y = 0;
			}
		} else {
			y = 0;
		}
	}
    str += "x: " + x + ", y: " + y  + "<br/>";
	if (phase == 'start') {
    	swipeStart = new Object();
		swipeStart.x = x;
		swipeStart.y = y;
		var imgWidth = $("#knob").width();
		var imgHeight = $("#knob").height();
	} else if (phase == 'end') {
		var eventType = 'move';
		if (direction) {
			angle = calculateAngle(swipeStart.x, swipeStart.y, swipeLast.x, swipeLast.y);
			magnitude = calculateMagnitude(swipeStart.x, swipeStart.y, x, y);
			eventType = 'move';
			$("#knob").hide();
			socket.emit("move", {"name": name, "angle" :angle, "magnitude": magnitude});
			for(i = 1; i < 6; i++) {
				newMagnitude = magnitude * (5-i) / 5;
				move(angle, newMagnitude, i*100);
			}
		} else {
			/*eventType = 'tap';
			centerX = $('#controller').width() / 2;
			centerY = $('#controller').height() / 2;
			angle = calculateAngle(centerX, centerY, swipeStart.x, swipeStart.y);
			magnitude = calculateMagnitude(centerX, centerY, swipeStart.x, swipeStart.y);
			$("#bomb").show();
			var imgWidth = $("#bomb").width();
			var imgHeight = $("#bomb").height();
			$('#bomb').css({"position":"absolute", "top": (swipeStart.y - imgHeight/2) + "px", "left": (swipeStart.x - imgWidth/2) + "px"});
			$("#bomb").fadeOut(500);
			tap(angle, magnitude, 0);*/
		}
		swipeStart = null;
	} else {
		angle = calculateAngle(swipeStart.x, swipeStart.y, x, y);
		magnitude = calculateMagnitude(swipeStart.x, swipeStart.y, x, y);
		swipeLast = new Object();
		swipeLast.x = x;
		swipeLast.y = y;
		str += "Angle: " + angle + "<br/>";
		str += "Magnitude: " + angle + "<br/>";
		var imgWidth = $("#knob").width();
		var imgHeight = $("#knob").height();
		$('#knob').show();
		$('#knob').css({"position":"absolute", "top": (y - imgHeight/2) + "px", "left": (x - imgWidth/2) + "px"});
		move(angle, magnitude, 0);
	}
	str += "Direction from inital touch: " + direction + "<br/>";
	str += "Distance from inital touch: " + distance + "<br/>";
	str += "Duration of swipe: " + duration + "<br/>";
	str += "Fingers used: " + fingers + "<br/></h4>";
	// $("#info").html(str);
}

function move(angle, magnitude, delay) {
	setTimeout(function() {
		socket.emit("move", {"name": name, "angle" :angle, "magnitude": magnitude});
	}, delay);
}

function tap() {
	setTimeout(function() {
		socket.emit("tap", {"name": name});
	}, 0);
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