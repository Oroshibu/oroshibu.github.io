import { default as config } from "./modules/config.js";
import { default as instances } from "./modules/instances.js";
import { Block, Entity, GUI, Map } from "./modules/classes.js";

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
	if (width < 2 * radius) radius = width / 2;
	if (height < 2 * radius) radius = height / 2;
	this.beginPath();
	this.moveTo(x + radius, y);
	this.arcTo(x + width, y, x + width, y + height, radius);
	this.arcTo(x + width, y + height, x, y + height, radius);
	this.arcTo(x, y + height, x, y, radius);
	this.arcTo(x, y, x + width, y, radius);
	this.closePath();
	return this;
}

$(document).ready(function(){

	//INIT

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
	ctx.imageSmoothingEnabled = false;

	var scale = 1;
	var corner = {x:config.GUIWidth, y:0};

	if (config.tileSize*config.gridSize.y < canvas.height) {
		corner.y = (canvas.height - config.tileSize*config.gridSize.y)/2;
	} 

	if (config.tileSize*config.gridSize.x < canvas.width-config.GUIWidth) {
		corner.x = (canvas.width - config.GUIWidth - config.tileSize*config.gridSize.x)/2 + config.GUIWidth;
	}

	var mouse = {x:0, y:0, lastSeenAt:{x: null, y: null}, inGUI:false, onGrid:{x:0, y:0}};
	var keys = {leftClick: false, middleClick:false, space:false};

	var mode = "default";

	var map = new Map(config.gridSize, config.blockLayers);

	map._blockLayers[0]._blocks[1][5] = instances["wall"];
	map._blockLayers[0]._blocks[1][2] = instances["wall"];
	map._blockLayers[0]._blocks[4][5] = instances["wall"];
	map._blockLayers[0]._blocks[4][2] = instances["wall"];

	var gui = new GUI({x:config.GUISelectBlocksWidth, y:512}, config.GUIY);

	canvas.onwheel = Zoom;

	DrawCanvas();

	//FUNCTIONS

	function MousePosToGridPos() {
		var newX = (mouse.x - corner.x*scale)/scale;
		var newY = (mouse.y - corner.y*scale)/scale;
		return {x:newX, y:newY};
	}

	function ModePicker() {
		if ((keys.space || keys.middleClick) && !mouse.inGUI) {
			mode = "grab";
		} else {
			mode = "default";
		}
		CursorPicker();
	}

	function CursorPicker() {
		if (mode == "grab") {
			document.body.style.cursor = "grab";
		} else if (mode == "default") {
			document.body.style.cursor = "default";
		}
		
	}

	function Clamp(number, min, max) {
		return Math.max(min, Math.min(number, max));
	}

	function ClampCorners() {
		corner.x = Clamp(corner.x, -config.tileSize*(config.gridSize.x-1)+config.GUIWidth/scale, canvas.width/scale-config.tileSize);
		corner.y = Clamp(corner.y, -config.tileSize*(config.gridSize.y-1), canvas.height/scale-config.tileSize);
	}

	function Zoom(event) {
		event.preventDefault();

		if (!mouse.inGUI) {
			if (scale >=config.zoomLimits.min && scale <= config.zoomLimits.max) {

				var newScale = scale + event.deltaY * -config.zoomScale;
				newScale = Clamp(newScale, config.zoomLimits.min, config.zoomLimits.max);
	
				corner.x += mouse.x/newScale - mouse.x/scale;
				corner.y += mouse.y/newScale - mouse.y/scale;
				
				scale = newScale;
			}
		  
	
			ClampCorners();
			DrawCanvas();
		}
	  
	}
	canvas.addEventListener('wheel', Zoom);

	function DrawCanvas() {
		//DRAW GRID
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = config.masterBgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = config.bgOutColor;
		ctx.fillRect(corner.x*scale-2, corner.y*scale-2, config.gridSize.x*config.tileSize*scale+5, config.gridSize.y*config.tileSize*scale+5);
		ctx.fillStyle = config.bgColor;
		ctx.fillRect(corner.x*scale, corner.y*scale, config.gridSize.x*config.tileSize*scale, config.gridSize.y*config.tileSize*scale);
		ctx.fillStyle = config.bgLinesColor;
		for (var i = 0; i < config.gridSize.y+1; i++) {
			ctx.fillRect(corner.x*scale, i*config.tileSize*scale+corner.y*scale, config.gridSize.x*config.tileSize*scale, 1);
		}
		for (var i = 0; i < config.gridSize.x+1; i++) {
			ctx.fillRect(i*config.tileSize*scale+corner.x*scale, corner.y*scale, 1, config.gridSize.y*config.tileSize*scale);
		}
		//DRAW MAP
		map.draw(ctx, corner, scale);

		//DRAW GUI BAR
		ctx.fillStyle = config.GUIBgColor;
		ctx.fillRect(0, 0, config.GUIWidth, canvas.height);
		gui.drawGUI(ctx);
	}

	$('#mainCanvas').on('mousemove', function(e){
		var rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;

		mouse.onGrid = MousePosToGridPos();

		mouse.inGUI = (mouse.x<config.GUIWidth);

		//DRAG CANVAS
		if ((keys.middleClick || (keys.leftClick && keys.space)) && !mouse.inGUI) {
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

		//HOVER GUI
		if (mouse.inGUI && mouse.y > config.GUIY){
			gui.hover(mouse.x, mouse.y);
			DrawCanvas();
		}

	});
	
	$('#mainCanvas').on('mousedown', function(e) {
		if (e.which == 1) {
			e.preventDefault();
			keys.leftClick = true;
		}
		else if( e.which == 2 ) {
			e.preventDefault();
			keys.middleClick = true;
			ModePicker();
		}
		CursorPicker();
	});

	$('#mainCanvas').on('mouseup', function(e) {
		if( e.which == 1 ) {
			e.preventDefault();
			keys.leftClick = false;
			mouse.lastSeenAt.x = null;
		}
		else if( e.which == 2 ) {
			e.preventDefault();
			keys.middleClick = false;
			mouse.lastSeenAt.x = null;
			ModePicker();
		}
		CursorPicker();
	});

	$(document).keydown(function(e) {
		if (e.key === " ") {
			keys.space = true;
			ModePicker();
		}
		CursorPicker();
   	});

	$(document).keyup(function(e) {
		if (e.key === " ") {
			keys.space = false;
			ModePicker();
		}
		CursorPicker();
   	});
	   
});
