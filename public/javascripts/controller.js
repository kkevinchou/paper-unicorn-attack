$(function() {
	ready();
});

function isVertical() {
	if (window.innerWidth > window.innerHeight) {
		return false;
	} else {
		return true;
	}
}

var swipeStart = null;
var swipeLast = null;
var tapLast = null;
var inGame = false;
var name = null;
var mouseDown = false;
var isVert = false;
function ready () {
	document.ontouchmove = function(event){
		event.preventDefault();
	}
	//document.getElementById('sound').load();

	$('#knob').on('dragstart', function(event) { event.preventDefault(); });
	$('#knob').attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    $('#pad').attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
	$('#controls').attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
                 
	$( window ).resize(function() {
		if (inGame) {
			if (isVertical() != isVert) {
				showController();
				isVert = isVertical();
			}
		}
	});
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
  	
  	socket.on('tap', function (data) {
  		var text = $("#info").html();
  		$("#info").html(text +"<br> tap result " + data['result']);
    	var result = data['result'];
    	if (result) {
    		//setTimeout(function() {
			//	playSound();
			//}, 1000);
    	}
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
		//showController();
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
	isVert = isVertical();
	if (isVert) {
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
	$('#controls').unbind('touchstart')
	$('#controls').unbind('mousedown')
	if ('ontouchstart' in document.documentElement) {
		$('#controls').bind('touchstart', function (event, data) {
			event.stopPropagation();
			tap();
		});
		$('#pad').bind('touchstart', function (event, data) {
			padTouchStart(event);
		});
		$('#pad').bind('touchmove', function (event) {
			padTouchMove(event);
		});
		$('#pad').bind('touchend', function (event, data) {
			padTouchEnd(event);
		});
		$('#pad').bind('touchcancel', function (event, data) {
			padTouchEnd(event);
		});
	} else {
		$('#controls').bind('mousedown', function (event, data) {
			event.stopPropagation();
			tap();
		});
		$('#pad').bind('mousedown', function (event, data) {
			mouseDown = true;
			padTouchStart(event);
			event.stopPropagation();
		});
		$('#pad').bind('mousemove', function (event, data) {
			if(mouseDown) {
				padTouchMove(event);
			}
			event.stopPropagation();
		});
		$('#pad').bind('mouseup', function (event, data) {
			if (mouseDown) {
				padTouchEnd(event);
				mouseDown = false;
			}
			event.stopPropagation();
		});
		$('#pad').bind('mousecancel', function (event, data) {
			if (mouseDown) {
				padTouchEnd(event);
				mouseDown = false;
			}
			event.stopPropagation();
		});
	}
}

function getPointFromEvent(event) {
	var x = event.pageX;
	if (!x) {
		if (event.originalEvent) {
			var original = event.originalEvent;
			if (original.touches) {
				var touch = original.touches[0];
				if (touch) {
					x = touch.pageX;
				} else {
					x = 0;
				}
			} else {
				x = 0;
			}
		} else {
			x = 0;
		}
	}
	var y = event.pageY;
	if (!y) {
		if (event.originalEvent) {
			var original = event.originalEvent;
			if (original.touches) {
				var touch = original.touches[0];
				if (touch) {
					y = touch.pageY;
				} else {
					y = 0;
				}
			} else {
				y = 0;
			}
		} else {
			y = 0;
		}
	}
	return [x, y];
}

function padTouchStart(event) {
	swipeStart = null;
	swipeLast = null;
	var point = getPointFromEvent(event);
	var x = point[0];
	var y = point[1];
	//$("#info").html("Touch start " + x + ", " + y);
	swipeStart = new Object();
	swipeStart.x = x;
	swipeStart.y = y;
}

function padTouchMove(event) {
	var point = getPointFromEvent(event);
	var x = point[0];
	var y = point[1];
	swipeLast = new Object();
	swipeLast.x = x;
	swipeLast.y = y;
	//$("#info").html("Touch move " + x + ", " + y);
	angle = calculateAngle(swipeStart.x, swipeStart.y, x, y);
	magnitude = calculateMagnitude(swipeStart.x, swipeStart.y, x, y);
	var imgWidth = $("#knob").width();
	var imgHeight = $("#knob").height();
	$('#knob').show();
	$('#knob').css({"position":"absolute", "top": (y - imgHeight/2) + "px", "left": (x - imgWidth/2) + "px"});
	move(angle, magnitude, 0);
}

function padTouchEnd(event) {
	var point = getPointFromEvent(event);
	var x = point[0];
	var y = point[1];
	//$("#info").html("Touch end");
	$("#knob").hide();
	if (swipeLast) {
		angle = calculateAngle(swipeStart.x, swipeStart.y, swipeLast.x, swipeLast.y);
		magnitude = calculateMagnitude(swipeStart.x, swipeStart.y, x, y);
		eventType = 'move';
		socket.emit("move", {"name": name, "angle" :angle, "magnitude": magnitude});
		for(i = 1; i < 6; i++) {
			newMagnitude = magnitude * (5-i) / 5;
			move(angle, newMagnitude, i*100);
		}
	}
	swipeStart = null;
	swipeLast = null;
}

function move(angle, magnitude, delay) {
	setTimeout(function() {
		socket.emit("move", {"name": name, "angle" :angle, "magnitude": magnitude});
	}, delay);
}

function tap() {
	setTimeout(function() {
		playSound();
		socket.emit("tap", {"name": name});
	}, 0);
}

function calculateMagnitude(startX, startY, destinationX, destinationY) {
	magnitude = Math.sqrt(Math.pow((destinationX-startX), 2)+Math.pow((destinationY-startY), 2))
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

function playSound(){ 
	document.getElementById('sound').play();
	document.getElementById('sound').currentTime = 0;
}