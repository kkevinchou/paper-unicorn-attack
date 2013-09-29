// this "game loop" is for animations on the end game screen, not actual game play
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 100);
          };
})();



(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();



function drawBackground(context, canvas)
{
	context.drawImage(resources.get("/images/mainbg.png"),0,0,canvas.width, canvas.height); 

}

function Cloud(size) {
	this.size = size;
	this.image = new Image();
	this.image.src = "/images/cloud.png";
	this.x = 800;
	this.y = 20;
}

Cloud.prototype.draw = function(context)
{
	for (var i = 0; i < this.size; i++) {
		var img = resources.get('/images/cloud.png');
		
		context.drawImage(img, this.x + i*20, this.y, 50, 50);



	};
};

var clouds = [];

function generateClouds() {
	var numClouds = 10;
	for (var i = 0; i < numClouds; i++) {

		clouds[i] = new Cloud(4);
		clouds[i].y += 130*i;
		clouds[i].x += 130*i;
	};


}

var context;
var canvas;
//var proton;
//var emitter;
function createEmitterForBlackSmoke() {
    var proton = new Proton();
    var emitter = new Proton.Emitter();
    //set Rate
    emitter.rate = new Proton.Rate(Proton.getSpan(0,1), 0.05);
    //add Initialize
   // emitter.addInitialize(new Proton.Radius(0.1, 0.2));
    emitter.addInitialize(new Proton.Life(1.5,2));
    emitter.addInitialize(new Proton.Velocity(1, Proton.getSpan(125, 135), 'polar'));
    //add Behaviour

    emitter.addInitialize(new Proton.ImageTarget(resources.get('/images/particle1.png')));
     emitter.addBehaviour(new Proton.Color('ff0000', 'random'));
    emitter.addBehaviour(new Proton.Alpha(0.9, 0));
    //set emitter position
    emitter.p.x = canvas.width / 2;
    emitter.p.y = canvas.height / 2;
    emitter.rotation = 45;
    emitter.emit();
    //add emitter to the proton
    proton.addEmitter(emitter);
    // add canvas renderer
    var renderer = new Proton.Renderer('canvas', proton, canvas);
    renderer.onProtonUpdate = function() {
        
    };
    renderer.start();
    return [proton, emitter];
}



var gameState = 0; // if game is one, end screen is being displayed
var victoryDragonFlap = false;
var wingDelay = 0;
function animateVictoryDragon() {
    drawBackground(context, canvas);

    if (victoryDragonFlap) {
        context.drawImage(resources.get('/images/victory_dragon.png'), 0, victoryY, 1000, 1103);

    } else {
        context.drawImage(resources.get('/images/victory_dragon_wing_down.png'), 0, victoryY, 1000, 1103);

    }
    wingDelay ++;

    if (wingDelay > 15) {
        wingDelay = 0;
            victoryDragonFlap = !victoryDragonFlap;

    }

    if (victoryY > 600 - 1103){
        victoryY -= 5;

        if (gameState == 1) {
            requestAnimFrame(animateVictoryDragon);

        }
    }

}

var victoryY = 0;
function animateVictoryPlanes() {
    drawBackground(context, canvas);
    context.drawImage(resources.get('/images/victory_planes.png'), 0, victoryY, 1000, 1400);
    if (victoryY < 0){
        victoryY += 5;

        if (gameState == 1) {
            requestAnimFrame(animateVictoryPlanes);
        }

    }


}

var cloudImagePrefix = "/images/cloud";
var cloudImageOverlap = 60;

function init() {
   // particles();

    console.log("start");

    //testing particle emitter
   // var p;
   // var e;
   // var r = createEmitterForBlackSmoke();
   // p = r[0];
   // e = r[1];


    setBoardSocketCallback(function (data) {
        
        if (data.game.ended) {
            if (gameState == 0) {
                if (data.game.winner) {
                    // planes won
                    victoryY = -1400;
                    requestAnimFrame(animateVictoryPlanes);

                } else {
                    // dragon won
                    victoryY = 600;

                     requestAnimFrame(animateVictoryDragon);

                }
            }
            gameState = 1;
            return;
        }

        gameState = 0;

        drawBackground(context, canvas);


        /// particle stuff

       // context.save();
        //context.globalCompositeOperation = "lighter";
       // p.update();
       // context.restore();


        ///
        var objects = data.game.objects;
        var cloudObjects = [];
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            var type = object.type;

            if (type == 4) {
                // cloud
                cloudObjects.push(object);
                continue;
            }

            context.save();
            
            var x = object.x;
            var y = object.y;
            var adjustedHeadingInDegrees = ((object.heading - 90) + 360) %360;


            context.translate(x,y);            

            // if degree change is between 90 and 270, we need to flip the image
            if (adjustedHeadingInDegrees > 90 && adjustedHeadingInDegrees < 270) {
                context.scale(-1, 1);
                adjustedHeadingInDegrees = 520 - adjustedHeadingInDegrees;
                adjustedHeadingInDegrees %= 360;
            }

            // so now adjustedHeadingInDegrees is either 0 to 90 or 270 to 360
            if (adjustedHeadingInDegrees > 50 && adjustedHeadingInDegrees < 180) {
                adjustedHeadingInDegrees = 50;
            } 

            if (adjustedHeadingInDegrees > 180 && adjustedHeadingInDegrees < 310) {
                adjustedHeadingInDegrees = 310;
            }
            context.rotate(adjustedHeadingInDegrees*Math.PI/180);
            context.translate(-x,-y);            


            if (type == 0) {
                // cargo

                context.drawImage(resources.get("/images/cargo.png"), x-100, y-100, 200, 200);

            } else if (type == 1) {
                // plane
                context.drawImage(resources.get("/images/plane1.png"), x-50, y-50, 100, 100);

            } else if (type == 2) {
                // dragon
                var img;
                if (object.frame ==0) {
                    img = resources.get("/images/dragon1.png");
                } else if (object.frame == 1) {
                    img = resources.get("/images/dragon1-down.png");
                } else if (object.frame == 2) {
                    img = resources.get("/images/dragon1-breathe.png");
                }
                context.drawImage(img, x-50, y-50, 100, 100);


            } else if (type == 3) {
                // fireball
                context.drawImage(resources.get("/images/fireball.png"), x-25, y-25, 50, 50);

            }
            
            context.restore();

            if (object.name) {
                context.strokeText(object.name, x, y);
            }
        };

        //var airplane = data.players[0];
        //context.strokeRect(airplane.x,airplane.y,50,50);


        // draw clouds
        //console.log(cloudObjects.length);
        for (var i = 0; i < cloudObjects.length; i++) {
            var cloud = cloudObjects[i];
          //  console.log(i + " " +cloud);
            var size = cloud.cloudSize;
            var pattern = cloud.cloudPattern;

            var cloudHeight = cloud.height;
            var cloudSectionWidth = (cloud.width + cloudImageOverlap*(size-1))/size;
            var cloudStartX = cloud.x - cloud.width/2.0;
            var cloudXIncrement = cloudSectionWidth - cloudImageOverlap;
            // console.log(cloudSectionWidth);
            for (var s = 0; s < size; s++) {
                var cloudImage = cloudImagePrefix + (pattern[s] + 1) + ".png";

                context.drawImage(resources.get("/images/cloud.png"), cloud.x + s*cloudXIncrement, cloud.y - cloudHeight/2.0, cloudSectionWidth, cloudHeight);
            }
        };

        var newEvents = data.events;
        for (var i = 0; i < newEvents.length; i++) {
            var newEvent = newEvents[i];

        }


   
    });
}



$(document).ready(function(){

   // jQuery methods go here...
   canvas = document.getElementById('myDrawing');
	// Check the element is in the DOM and the browser supports canvas
	if(canvas.getContext) {
		// Initaliase a 2-dimensional drawing context
		context = canvas.getContext('2d');
		//Canvas commands go here


		resources.load([
		    '/images/cloud.png',
            '/images/fireball.png',
            '/images/plane1.png',
            '/images/dragon1.png',
            '/images/cargo.png',
            '/images/darksmoke.png',
            '/images/mainbg.png',
            '/images/dragon1-down.png',
            '/images/dragon1-breathe.png',
            '/images/particle1.png',
            '/images/cloud1.png',
            '/images/cloud2.png',
            '/images/cloud3.png',
            '/images/victory_dragon.png',
            '/images/victory_planes.png',
            '/images/victory_dragon_wing_down.png'
		]);



		//drawBackground(context, canvas);
		//generateClouds();
		resources.onReady(init);
	}

});

