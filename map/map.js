import { default as config } from "./modules/config.js";

$(document).ready(function(){

	var body = document.body;
	var html = document.documentElement;

	var height = Math.max(
		body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight
	);

	var canvas = document.getElementById('mainCanvas');
	canvas.width = document.body.clientWidth; 
    canvas.height = height;

	var ctx = canvas.getContext('2d');

	var scale = 1;
	var corner = {x:0, y:0};
	var mouse = {x:0, y:0, lastSeenAt:{x: null, y: null}, middleClick:false};

	canvas.onwheel = Zoom;

	DrawCanvas();

	function Zoom(event) {
		event.preventDefault();

		if (scale >=config.zoomLimits.min && scale <= config.zoomLimits.max) {

			console.log(scale);
			var newScale = scale + event.deltaY * -config.zoomScale;
			newScale = Math.min(Math.max(config.zoomLimits.min, newScale), config.zoomLimits.max);
			console.log(newScale);

			corner.x -= mouse.x/newScale - mouse.x/scale;
			corner.y -= mouse.y/newScale - mouse.y/scale;
		  
			scale = newScale;
		}
	  


		DrawCanvas();
	  
	}
	canvas.addEventListener('wheel', Zoom);

	function DrawCanvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = config.bgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = config.bgLinesColor;
		for (var i = 0; i < 50; i++) {
			ctx.fillRect(0, i*config.tileSize*scale-corner.y*scale, canvas.width, 1);
		}
		for (var i = 0; i < 50; i++) {
			ctx.fillRect(i*config.tileSize*scale-corner.x*scale, 0, 1, canvas.height);
		}
	}
	
	

	$('#mainCanvas').on('mousemove', function(e){
		var rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;

		if (mouse.middleClick) {
			if (mouse.lastSeenAt.x != null) {
				var dist = {x:mouse.lastSeenAt.x - mouse.x, y:mouse.lastSeenAt.y - mouse.y};
			
				corner.x += dist.x/scale;
				corner.y += dist.y/scale;
			}

			mouse.lastSeenAt.x = mouse.x;
			mouse.lastSeenAt.y = mouse.y;

			DrawCanvas();
		}
	});
	
	$('#mainCanvas').on('mousedown', function(e) {
		if( e.which == 2 ) {
		   e.preventDefault();

			mouse.middleClick = true;
		}
	});

	$('#mainCanvas').on('mouseup', function(e) {
		if( e.which == 2 ) {
		   e.preventDefault();

			mouse.middleClick = false;
			mouse.lastSeenAt.x = null;
		}
	});

});
