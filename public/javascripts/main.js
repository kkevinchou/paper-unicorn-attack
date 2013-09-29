// shim layer with setTimeout fallback
/*window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();*/



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
	context.beginPath();
    context.rect(0,0,canvas.width, canvas.height);
    context.fillStyle = 'lightblue';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();		
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
var proton;
var emitter;
function particles() {
    proton = new Proton();
    emitter = new Proton.Emitter();
    //set Rate
    emitter.rate = new Proton.Rate(Proton.getSpan(0,1), 0.05);
    //add Initialize
   // emitter.addInitialize(new Proton.Radius(0.1, 0.2));
    emitter.addInitialize(new Proton.Life(1.5,2));
    emitter.addInitialize(new Proton.Velocity(1, Proton.getSpan(125, 135), 'polar'));
    //add Behaviour

    emitter.addInitialize(new Proton.ImageTarget(resources.get('/images/fireball.png')));
    //emitter.addBehaviour(new Proton.Color('ff0000', 'random'));
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
    console.log(renderer);
}
function init() {
    particles();
    console.log("start");


    setBoardSocketCallback(function (data) {
        drawBackground(context, canvas);

        /// particle stuff

       // context.save();
        //context.globalCompositeOperation = "lighter";
      //  proton.update();
       // context.restore();

        ///
        var objects = data.game.objects;
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];

            var type = object.type;
            var x = object.x;
            var y = object.y;

            console.log (x + " " + y);

            context.strokeRect(x, y, 50, 50);
            if (object.name) {
                context.strokeText(object.name, x + 5, y + 30);
            }
        };

        //var airplane = data.players[0];
        //context.strokeRect(airplane.x,airplane.y,50,50);


        // clouds
        for (var i = 0; i < clouds.length; i++) {
            var cloud = clouds[i];
            cloud.x -= 1;
        };

            for (var i = 0; i < clouds.length; i++) {
            var cloud = clouds[i];
            cloud.draw(context);
        };

   
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
            '/images/fireball.png'
		]);



		//drawBackground(context, canvas);
		generateClouds();
		resources.onReady(init);
	}

});

