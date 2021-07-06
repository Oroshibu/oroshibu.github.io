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
	var corner = {x:config.guiWidth, y:0};

	if (config.tileSize*config.gridSize.y < canvas.height) {
		corner.y = (canvas.height - config.tileSize*config.gridSize.y)/2;
	} 

	if (config.tileSize*config.gridSize.x < canvas.width-config.guiWidth) {
		corner.x = (canvas.width - config.guiWidth - config.tileSize*config.gridSize.x)/2 + config.guiWidth;
	}

	var mouse = {x:0, y:0, lastSeenAt:{x: null, y: null}, middleClick:false};

	canvas.onwheel = Zoom;

	DrawCanvas();

	function Clamp(number, min, max) {
		return Math.max(min, Math.min(number, max));
	}

	function ClampCorners() {
		corner.x = Clamp(corner.x, -config.tileSize*(config.gridSize.x-1)+config.guiWidth/scale, canvas.width/scale-config.tileSize);
		corner.y = Clamp(corner.y, -config.tileSize*(config.gridSize.y-1), canvas.height/scale-config.tileSize);
	}

	function Zoom(event) {
		event.preventDefault();

		if (scale >=config.zoomLimits.min && scale <= config.zoomLimits.max) {

			console.log(scale);
			var newScale = scale + event.deltaY * -config.zoomScale;
			newScale = Clamp(newScale, config.zoomLimits.min, config.zoomLimits.max);

			corner.x += mouse.x/newScale - mouse.x/scale;
			corner.y += mouse.y/newScale - mouse.y/scale;
			
			scale = newScale;
		}
	  

		ClampCorners();
		DrawCanvas();
	  
	}
	canvas.addEventListener('wheel', Zoom);

	function DrawCanvas() {
		//DRAW GRID
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = config.masterBgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = config.bgColor;
		ctx.fillRect(corner.x*scale, corner.y*scale, config.gridSize.x*config.tileSize*scale, config.gridSize.y*config.tileSize*scale);
		ctx.fillStyle = config.bgLinesColor;
		for (var i = 0; i < config.gridSize.y; i++) {
			ctx.fillRect(corner.x*scale, i*config.tileSize*scale+corner.y*scale, config.gridSize.x*config.tileSize*scale, 1);
		}
		for (var i = 0; i < config.gridSize.x; i++) {
			ctx.fillRect(i*config.tileSize*scale+corner.x*scale, corner.y*scale, 1, config.gridSize.y*config.tileSize*scale);
		}
		//DRAW ENTITES IDK

		//DRAW GUI BAR
		ctx.fillStyle = config.guiBgColor;
		ctx.fillRect(0, 0, config.guiWidth, canvas.height);
	}
	
	

	$('#mainCanvas').on('mousemove', function(e){
		var rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;

		if (mouse.middleClick) {
			if (mouse.lastSeenAt.x != null) {
				var dist = {x:mouse.lastSeenAt.x - mouse.x, y:mouse.lastSeenAt.y - mouse.y};
			
				corner.x -= dist.x/scale;
				corner.y -= dist.y/scale;
				ClampCorners();
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
