
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


$(document).ready(function(){

   // jQuery methods go here...
   var canvas = document.getElementById('myDrawing');
	// Check the element is in the DOM and the browser supports canvas
	if(canvas.getContext) {
		// Initaliase a 2-dimensional drawing context
		var context = canvas.getContext('2d');
		//Canvas commands go here

		drawBackground(context, canvas);



	}

});

