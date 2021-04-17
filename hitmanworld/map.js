$(document).ready(function(){

	document.documentElement.scrollTop = 0;

	var canvas = document.getElementById('mapCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'rgb(30, 30, 30)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var selectedColor = "#292738";
	var selectedSprite = "none";
	var selectedTerrainKey = "A";
	var width = parseInt($('#width').val());
	var height = parseInt($('#height').val());
	var multX = parseInt($('#multX').val());
	var multY = parseInt($('#multY').val());
	var tileSize = parseInt($('#tileSize').val());
	var nX = ((width * multX) / tileSize);
	var nY = ((height * multY) / tileSize);
	var tiles = new Array(nY);
	for (var i = 0; i < nY; i++) {
  	tiles[i] = new Array(nX);
	}
	for (var i = 0; i < nY; i++) {
		for (var k = 0; k < nX; k++) {
			tiles[i][k] = "A";
		}
	}

	var rect = canvas.getBoundingClientRect();

	var mouseDown = false;
	var mouseDownX = -1;
	var mouseDownY = -1;

	var tileMode = false;

	var img = new Array(2);
	img = {};
	img["A"] = new Image();
	img["A"].src = "images/void.png";
	img["B"] = new Image();
	img["B"].src = "images/walltop.png";
	img["C"] = new Image();
	img["C"].src = "images/wallbot.png";
	img["eraser"] = new Image();
	img["eraser"].src = "images/eraser.png";
	img["chair"] = new Image();
	img["chair"].src = "images/chair.png";

	entities = new Array(0);



	DrawMap();

	$('#reset').click(function() {
		for (var i = 0; i < nY; i++) {
			for (var k = 0; k < nX; k++) {
				tiles[i][k] = "A";
			}
		}
		entities = [];
		DrawMap();
	});

	$('#mapCanvas').on('mousemove', function(e){
		rect = canvas.getBoundingClientRect();
		DrawMap();

		x = e.clientX - rect.left;
    y = e.clientY - rect.top;

		if (tileMode == true) {
			x = Math.floor(x/tileSize);
			y = Math.floor(y/tileSize);

			ctx.drawImage(img[selectedTerrainKey], x*tileSize, y*tileSize, tileSize, tileSize);

			if (mouseDownX != -1) {
				var distanceX = Math.abs(mouseDownX - x);
				var startpointX = mouseDownX;
				if (mouseDownX > x) {
					startpointX = x;
				}
				var distanceY = Math.abs(mouseDownY - y);
				var startpointY = mouseDownY;
				if (mouseDownY > y) {
					startpointY = y;
				}
				for (var i = 0; i <= distanceX; i++) {
					for (var k = 0; k <= distanceY; k++) {
							ctx.drawImage(img[selectedTerrainKey], startpointX*tileSize+i*tileSize, startpointY*tileSize+k*tileSize, tileSize, tileSize);
					}
				}
			}

			if (mouseDown == true && mouseDownX == -1){
				tiles[y][x] = selectedTerrainKey;
			}
		} else {
				ctx.drawImage(img[selectedTerrainKey], x-tileSize/2, y-tileSize/2, tileSize, tileSize);

				if (mouseDown == true && selectedTerrainKey == "eraser") {
					DeleteEntityEntry(x - tileSize/2, y - tileSize/2);
				}
		}


	});

	$('#mapCanvas').on('mousedown', function(e){
		if (tileMode == true) {
			var shiftKeyPressed = e.shiftKey
			if (shiftKeyPressed) {
				rect = canvas.getBoundingClientRect();
				mouseDownX = e.clientX - rect.left;
				mouseDownY = e.clientY - rect.top;
				mouseDownX = Math.floor(mouseDownX/tileSize);
				mouseDownY = Math.floor(mouseDownY/tileSize);
			} else {
				mouseDownX = -1;
				tiles[y][x] = selectedTerrainKey;
				DrawMap();
			}
		} else {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
			if (selectedTerrainKey != "eraser") {
				CreateEntityEntry(selectedTerrainKey, x - tileSize/2, y - tileSize/2);
			} else {
				DeleteEntityEntry(x - tileSize/2, y - tileSize/2);
			}

			DrawMap();
		}

		mouseDown = true;

		});

	$('#mapCanvas').on('mouseup', function(e){
		mouseDown = false;

		if (mouseDownX != -1 && tileMode == true) {

			x = e.clientX - rect.left;
			y = e.clientY - rect.top;

			x = Math.floor(x/tileSize);
			y = Math.floor(y/tileSize);

			var distanceX = Math.abs(mouseDownX - x);
			var startpointX = mouseDownX;
			if (mouseDownX > x) {
				startpointX = x;
			}
			var distanceY = Math.abs(mouseDownY - y);
			var startpointY = mouseDownY;
			if (mouseDownY > y) {
				startpointY = y;
			}
			for (var i = 0; i <= distanceX; i++) {
				for (var k = 0; k <= distanceY; k++) {
						//ctx.drawImage(img[selectedTerrainKey], startpointX*tileSize+i*tileSize, startpointY*tileSize+k*tileSize, tileSize, tileSize);
						tiles[startpointY+k][startpointX+i] = selectedTerrainKey;
				}
			}
			mouseDownX = -1;
		}


	});


	$('.terrain').click(function() {
		selectedColor = $(this).css("background-color");
		selectedSprite = $(this).css("background-image");
		var img = new Image();
		img.src = $(this).css("background-image");
		selectedTerrainKey = $(this).text();
		$('.terrain').css({"border-style":"none"});
		$(this).css({'border-style':'solid'});

		if (selectedTerrainKey.length > 1) {
			tileMode = false;
		} else {
			tileMode = true;
		}

	});

		function CreateEntityEntry(name, x, y) {
			entities.push([name, x, y])
		}

		function DeleteEntityEntry(x, y) {
			for (var i = 0; i < entities.length; i++) {
				if (x > entities[i][1] - tileSize/2 && x < entities[i][1] + tileSize/2 && y > entities[i][2] - tileSize/2 && y < entities[i][2] + tileSize/2) {
						entities.splice(i, 1);
				}
			}
		}

		function DrawEntities() {
			for (var i = 0; i < entities.length; i++) {
				ctx.drawImage(img[entities[i][0]], entities[i][1], entities[i][2], tileSize, tileSize);
			}
		}

		function DrawMap() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgb(30, 30, 30)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgb(35, 35, 35)';
			for (var i = 0; i < nY; i++) {
				ctx.fillRect(0, i*tileSize, canvas.width, 1);
			}
			for (var i = 0; i < nX; i++) {
				ctx.fillRect(i*tileSize, 0, 1, canvas.height);
			}

			for (var i = 0; i < nY; i++) {
				for (var k = 0; k < nX; k++) {
					if (tiles[i][k] != "A") {
						ctx.drawImage(img[tiles[i][k]], k*tileSize, i*tileSize, tileSize, tileSize);
						if (tiles[i][k] == "B") {
							if (tiles[i+1][k] == "A") {
								ctx.drawImage(img["C"], k*tileSize, (i+1)*tileSize, tileSize, tileSize);
							}
						}
					}
				}
			}
			DrawEntities();
		}
});