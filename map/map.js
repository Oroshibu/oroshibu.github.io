import { default as config } from "./modules/config.js";
import { default as instances } from "./modules/instances.js";
import { Block, Entity, GUI, Map, History} from "./modules/classes.js";

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

	var key = 0;

	if (config.tileSize*config.gridSize.y < canvas.height) {
		corner.y = (canvas.height - config.tileSize*config.gridSize.y)/2;
	} 

	if (config.tileSize*config.gridSize.x < canvas.width-config.GUIWidth) {
		corner.x = (canvas.width - config.GUIWidth - config.tileSize*config.gridSize.x)/2 + config.GUIWidth;
	}

	var mouse = {x:0, y:0, lastSeenAt:{x: null, y: null}, inGUI:false, inMap:false, onGrid:{x:0, y:0}, onClick:{x:0, y:0}, hoverResize:0};
	var keys = {leftClick: false, middleClick:false, space:false, shift:false, ctrl:false};

	var mode = "default";
	var shiftMode = false;
	var cornerSave = {x:0, y:0};
	var ctrlMode = 0;

	var map = new History(config.gridSize, config.blockLayers);
	/*
	map._blockLayers[0]._blocks[1][5] = instances["wall"];
	map._blockLayers[0]._blocks[1][2] = instances["wall"];
	map._blockLayers[0]._blocks[4][5] = instances["wall"];
	map._blockLayers[0]._blocks[4][2] = instances["wall"];*/

	var gui = new GUI({x:config.GUISelectBlocksWidth, y:512}, config.GUIY);

	canvas.onwheel = Zoom;

	//DrawCanvas();

	//FUNCTIONS

	function InHitBox(x, y, width, height){
		if (mouse.x >= x && mouse.x < x + width && mouse.y >= y && mouse.y < y + height){
			return true;
		} else {
			return false;
		}
	}

	function MousePosToGridPos() {
		var newX = (mouse.x - corner.x*scale)/scale;
		var newY = (mouse.y - corner.y*scale)/scale;
		return {x:newX, y:newY};
	}

	function ModePicker() {
		if ((keys.space || keys.middleClick) && !mouse.inGUI) {
			mode = "grab";
		}
		else if (mouse.hoverResize > 0) {
			mode = "resize";
		}
		else {
			mode = "default";
		}
		CursorPicker();
	}

	function CursorPicker() {
		if (mode == "grab") {
			document.body.style.cursor = "grab";
		} else if (mode == "resize") {
			if (mouse.hoverResize%2 == 0) {
				document.body.style.cursor = "n-resize";
			} else {
				document.body.style.cursor = "e-resize";
			}
		} else if (mode == "default") {
			document.body.style.cursor = "default";
		}
	}

	function Clamp(number, min, max) {
		return Math.max(min, Math.min(number, max));
	}

	function ClampCorners() {
		corner.x = Clamp(corner.x, -config.tileSize*(map.top()._size.x-1)+config.GUIWidth/scale, canvas.width/scale-config.tileSize);
		corner.y = Clamp(corner.y, -config.tileSize*(map.top()._size.y-1), canvas.height/scale-config.tileSize);
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
			//DrawCanvas();
		}
	  
	}
	canvas.addEventListener('wheel', Zoom);

	function LeftClick(){
		if (keys.shift && mouse.inMap){
			shiftMode = true;
		}
		if (mouse.inGUI && mouse.y > config.GUIY){
			let tmpKey = gui.leftClick(mouse.x, mouse.y);
			if (tmpKey != 0){
				key = tmpKey;
			}
		} else if (mouse.inMap) {
			if (key != 0 && !keys.space && !keys.ctrl) {
				map.newMap();
				map.input(mouse.onGrid.x, mouse.onGrid.y, key);
			}
		}

		if (mouse.hoverResize > 0) {
			map.newMap();
			ctrlMode = mouse.hoverResize;
			cornerSave = {x:corner.x+map.top()._size.x*config.tileSize, y:corner.y+map.top()._size.y*config.tileSize};
		}
	}

	function DrawCanvas() {
		//DRAW GRID
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = config.masterBgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = config.bgOutColor;
		ctx.fillRect(corner.x*scale-2, corner.y*scale-2, map.top()._size.x*config.tileSize*scale+5, map.top()._size.y*config.tileSize*scale+5);
		ctx.fillStyle = config.bgColor;
		ctx.fillRect(corner.x*scale, corner.y*scale, map.top()._size.x*config.tileSize*scale, map.top()._size.y*config.tileSize*scale);
		ctx.fillStyle = config.bgLinesColor;
		for (var i = 0; i < map.top()._size.y+1; i++) {
			ctx.fillRect(corner.x*scale, i*config.tileSize*scale+corner.y*scale, map.top()._size.x*config.tileSize*scale, 1);
		}
		for (var i = 0; i < map.top()._size.x+1; i++) {
			ctx.fillRect(i*config.tileSize*scale+corner.x*scale, corner.y*scale, 1, map.top()._size.y*config.tileSize*scale);
		}

		//DRAW MAP
		map.draw(ctx, corner, scale);
		//DRAW HOVER
		if (key != 0){
			if (mouse.inMap && !keys.space && !keys.middleClick && !keys.ctrl){
				key.drawOnGrid(ctx, corner, scale, mouse.onGrid.x, mouse.onGrid.y);
				//document.body.style.cursor = "none";
			} else {
				CursorPicker();
			}
		}
		//DRAW SHIFT
		if (key != 0 && shiftMode && keys.leftClick){
			if (mouse.inMap){
				let distY = Math.abs(Math.floor(mouse.onClick.y/config.tileSize)-Math.floor(mouse.onGrid.y/config.tileSize))+1;
				let stY = Math.min(Math.floor(mouse.onClick.y/config.tileSize), Math.floor(mouse.onGrid.y/config.tileSize));
				let distX = Math.abs(Math.floor(mouse.onClick.x/config.tileSize)-Math.floor(mouse.onGrid.x/config.tileSize))+1;
				let stX = Math.min(Math.floor(mouse.onClick.x/config.tileSize), Math.floor(mouse.onGrid.x/config.tileSize));
				for (let y = stY; y < stY+distY; y++){
					for (let x = stX; x < stX+distX; x++){
						key.drawOnGrid(ctx, corner, scale, x*config.tileSize, y*config.tileSize);
					}
				}
			}
		}

		//DRAW RESIZE
		if (keys.ctrl) {
			ctx.fillStyle = config.bgOutColor;
			ctx.roundRect(corner.x*scale-2 + (map.top()._size.x*config.tileSize*scale+5)/2 - 8*scale, corner.y*scale-2-8*scale, 16*scale, 16*scale, 6*scale);
			ctx.fill();  
			ctx.roundRect(corner.x*scale-2 + (map.top()._size.x*config.tileSize*scale+5)/2 - 8*scale, corner.y*scale-2-8*scale+map.top()._size.y*config.tileSize*scale+5, 16*scale, 16*scale, 6*scale);
			ctx.fill();  
			ctx.roundRect(corner.x*scale-2 - 8*scale, corner.y*scale-2-8*scale+(map.top()._size.y*config.tileSize*scale+5)/2, 16*scale, 16*scale, 6*scale);
			ctx.fill();  
			ctx.roundRect(corner.x*scale-2 - 8*scale + map.top()._size.x*config.tileSize*scale+5, corner.y*scale-2-8*scale+(map.top()._size.y*config.tileSize*scale+5)/2, 16*scale, 16*scale, 6*scale);
			ctx.fill();  

			if (mouse.hoverResize == 1){
				ctx.fillStyle = config.hoverResizeColor;
				ctx.roundRect(corner.x*scale-2 - 8*scale + map.top()._size.x*config.tileSize*scale+5, corner.y*scale-2-8*scale+(map.top()._size.y*config.tileSize*scale+5)/2, 16*scale, 16*scale, 6*scale);
				ctx.fill();
				ctx.fillRect(corner.x*scale  + map.top()._size.x*config.tileSize*scale+1, corner.y*scale, 2, map.top()._size.y*config.tileSize*scale);
			} else if (mouse.hoverResize == 2) {
				ctx.fillStyle = config.hoverResizeColor;
				ctx.roundRect(corner.x*scale-2 + (map.top()._size.x*config.tileSize*scale+5)/2 - 8*scale, corner.y*scale-2-8*scale, 16*scale, 16*scale, 6*scale);
				ctx.fill();
				ctx.fillRect(corner.x*scale, corner.y*scale-2, map.top()._size.x*config.tileSize*scale, 2);
			} else if (mouse.hoverResize == 3) {
				ctx.fillStyle = config.hoverResizeColor;
				ctx.roundRect(corner.x*scale-2 - 8*scale, corner.y*scale-2-8*scale+(map.top()._size.y*config.tileSize*scale+5)/2, 16*scale, 16*scale, 6*scale);
				ctx.fill();
				ctx.fillRect(corner.x*scale - 2, corner.y*scale, 2, map.top()._size.y*config.tileSize*scale);			
			} else if (mouse.hoverResize == 4) {
				ctx.fillStyle = config.hoverResizeColor;
				ctx.roundRect(corner.x*scale-2 + (map.top()._size.x*config.tileSize*scale+5)/2 - 8*scale, corner.y*scale-2-8*scale+map.top()._size.y*config.tileSize*scale+5, 16*scale, 16*scale, 6*scale);
				ctx.fill();
				ctx.fillRect(corner.x*scale, corner.y*scale  + map.top()._size.y*config.tileSize*scale+1, map.top()._size.x*config.tileSize*scale, 2);
			}
		}

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

		mouse.inMap = (mouse.onGrid.x > 0 && mouse.onGrid.x < map.top()._size.x * config.tileSize && mouse.onGrid.y > 0 && mouse.onGrid.y < map.top()._size.y * config.tileSize);


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

			//DrawCanvas();
		}

		//HOVER GUI
		if (mouse.inGUI && mouse.y > config.GUIY){
			gui.hover(mouse.x, mouse.y);
			//DrawCanvas();
		}

		//HOVER MAP
		if (mouse.inMap && keys.leftClick && key!=0) {
			if (key._layer>=0 && !shiftMode && !keys.middleClick && !keys.space && !keys.ctrl){
				map.input(mouse.onGrid.x, mouse.onGrid.y, key);
			}
		}

		//RESIZE HOVER
		if (keys.ctrl) {
			//ctx.fillStyle = "#ff0000";
			//ctx.fillRect(corner.x*scale-2 - 8*scale + map.top()._size.x*config.tileSize*scale+5,  corner.y*scale-2, 16*scale, map.top()._size.y*config.tileSize*scale+5);
			if (InHitBox(corner.x*scale-2 - 32*scale + map.top()._size.x*config.tileSize*scale+5, corner.y*scale-2, 64*scale, map.top()._size.y*config.tileSize*scale+5)){
				mouse.hoverResize = 1;
			} else if (InHitBox(corner.x*scale-2 - 32*scale, corner.y*scale-2, 64*scale, map.top()._size.y*config.tileSize*scale+5)){
				mouse.hoverResize = 3;
			} else if (InHitBox(corner.x*scale-2, corner.y*scale-2 - 32*scale + map.top()._size.y*config.tileSize*scale+5, map.top()._size.x*config.tileSize*scale+5, 64*scale)){
				mouse.hoverResize = 4;
			} else if (InHitBox(corner.x*scale-2, corner.y*scale-2 - 32*scale, map.top()._size.x*config.tileSize*scale+5, 64*scale)){
				mouse.hoverResize = 2;
			} else {
				mouse.hoverResize = 0;
			}
			ModePicker();
		} else {
			mouse.hoverResize = 0;
		}

		//RESIZE
		if (ctrlMode > 0) {
			map.top().resize(ctrlMode, mouse.onGrid.x, mouse.onGrid.y);
			if (ctrlMode == 2) {
				corner.y = cornerSave.y - map.top()._size.y*config.tileSize;
			} else if (ctrlMode == 3) {
				corner.x = cornerSave.x - map.top()._size.x*config.tileSize;
			}
		}

	});
	
	$('#mainCanvas').on('mousedown', function(e) {
		keys.shift = e.shiftKey;
		if (e.which == 1) {
			e.preventDefault();
			keys.leftClick = true;
			mouse.onClick = mouse.onGrid;
			LeftClick();
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
			if (ctrlMode) {
				ctrlMode = 0;
				mouse.hoverResize = 0;
			}
			if (shiftMode){
				shiftMode = false;
				if(mouse.inMap && key!=0){
					let distY = Math.abs(Math.floor(mouse.onClick.y/config.tileSize)-Math.floor(mouse.onGrid.y/config.tileSize))+1;
					let stY = Math.min(Math.floor(mouse.onClick.y/config.tileSize), Math.floor(mouse.onGrid.y/config.tileSize));
					let distX = Math.abs(Math.floor(mouse.onClick.x/config.tileSize)-Math.floor(mouse.onGrid.x/config.tileSize))+1;
					let stX = Math.min(Math.floor(mouse.onClick.x/config.tileSize), Math.floor(mouse.onGrid.x/config.tileSize));
					for (let y = stY; y < stY+distY; y++){
						for (let x = stX; x < stX+distX; x++){
							map.input(x*config.tileSize, y*config.tileSize, key);
						}
					}
				}
			}
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
		else if (e.ctrlKey && e.key === 'z') {
			map.ctrlz();
		}
		else if (e.ctrlKey && e.key === 'y') {
			map.ctrly();
		}
		keys.ctrl = e.ctrlKey;
		CursorPicker();
   	});

	$(document).keyup(function(e) {
		if (e.key === " ") {
			keys.space = false;
			ModePicker();
		}
		keys.ctrl = e.ctrlKey;
		CursorPicker();
   	});

	setInterval(DrawCanvas, config.canvasRefreshTime);
	   
});
