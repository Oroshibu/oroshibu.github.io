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

	var tileMode = true;

	var img = new Array(2);
	img = {};
	img["A"] = new Image();
	img["A"].src = "images/void.png";
	img["B"] = new Image();
	img["B"].src = "images/floor.png";
	img["C"] = new Image();
	img["C"].src = "images/walltop.png";
	img["D"] = new Image();
	img["D"].src = "images/walltop.png";
	img["E"] = new Image();
	img["E"].src = "images/walltop.png";
	img["F"] = new Image();
	img["F"].src = "images/walltop.png";
	img["G"] = new Image();
	img["G"].src = "images/walltop.png";
	img["3"] = new Image();
	img["3"].src = "images/wallbot.png";
	img["4"] = new Image();
	img["4"].src = "images/wallbot1.png";
	img["5"] = new Image();
	img["5"].src = "images/wallbot2.png";
	img["6"] = new Image();
	img["6"].src = "images/wallbot3.png";
	img["7"] = new Image();
	img["7"].src = "images/wallbot4.png";
	img["eraser"] = new Image();
	img["eraser"].src = "images/eraser.png";
	img["player"] = new Image();
	img["player"].src = "images/player.png";
	img["chair"] = new Image();
	img["chair"].src = "images/chair.png";

	entities = new Array(0);



	DrawMap();

	$('#reset').click(function() {
		ResetMap();
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

	function ResetMap() {
		for (var i = 0; i < nY; i++) {
			for (var k = 0; k < nX; k++) {
				tiles[i][k] = "A";
			}
		}
		entities = [];
	}

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
				//console.log(entities[i][0]);
				ctx.drawImage(img[entities[i][0]], entities[i][1], entities[i][2], tileSize, tileSize);
			}
		}

		function DrawMap() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgb(120, 120, 120)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgb(125, 125, 125)';
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
					}
				}
			}

			for (var i = 0; i < nY; i++) {
				for (var k = 0; k < nX; k++) {
					if (tiles[i][k] != "A") {
						if (tiles[i][k] == "C") {
							if (tiles[i+1][k] == "A" || tiles[i+1][k] == "B") {
								ctx.drawImage(img["3"], k*tileSize, (i+1)*tileSize, tileSize, tileSize);
							}
						}

						if (tiles[i][k] == "D") {
							if (tiles[i+1][k] == "A" || tiles[i+1][k] == "B") {
								ctx.drawImage(img["4"], k*tileSize, (i+1)*tileSize, tileSize, tileSize);
							}
						}

						if (tiles[i][k] == "E") {
							if (tiles[i+1][k] == "A" || tiles[i+1][k] == "B") {
								ctx.drawImage(img["5"], k*tileSize, (i+1)*tileSize, tileSize, tileSize);
							}
						}

						if (tiles[i][k] == "F") {
							if (tiles[i+1][k] == "A" || tiles[i+1][k] == "B") {
								ctx.drawImage(img["6"], k*tileSize, (i+1)*tileSize, tileSize, tileSize);
							}
						}

						if (tiles[i][k] == "G") {
							if (tiles[i+1][k] == "A" || tiles[i+1][k] == "B") {
								ctx.drawImage(img["7"], k*tileSize, (i+1)*tileSize, tileSize, tileSize);
							}
						}
					}
				}
			}
			DrawEntities();
		}

		$('#exportenemies').click(function(){
			var fname = $('#filename').val();
			fname = "map.csv";
			var stringu = "";
			for (var i = 0; i < nY; i++) {
				for (var k = 0; k < nX; k++) {
					stringu += tiles[i][k];
				}
				stringu += ":";
			}
			stringu += ",,\n";
			//copyToClipboard(stringu);

			for (var i = 0; i < entities.length; i++) {
				stringu += entities[i][0] + ",";
				stringu += entities[i][1].toString() + ",";
				stringu += entities[i][2].toString() + "\n";
			}

			download(stringu, fname, "application/csv")
		});

		document.getElementById("import").onchange = function(event)
		{
			var input = event.target;

			var reader = new FileReader();
			reader.onload = function(){
				var text = reader.result;
				loadLevel(text);
				//var node = document.getElementById('output');
				//node.innerText = text;
				//console.log(reader.result.substring(0, 200));
			};
			reader.readAsText(input.files[0]);
		};

		function loadLevel(text) {
			ResetMap();
			var textL = text.split('\n');
			var gridL = textL[0].split(':');
			for (var i = 0; i < nY; i++) {
				for (var k = 0; k < nX; k++) {
					tiles[i][k] = gridL[i][k];
				}
			}

			for (var i = 1; i < textL.length-1; i++) {
				var entity = textL[i].split(',');
				entity[1] =  parseFloat(entity[1]);
				entity[2] =  parseFloat(entity[2]);
				entities.push(entity);
			}

			DrawMap();

		}

		function download(data, filename, type) {
				var file = new Blob([data], {type: type});


				if (window.navigator.msSaveOrOpenBlob) // IE10+
						window.navigator.msSaveOrOpenBlob(file, filename);
				else { // Others
						var a = document.createElement("a"),
										url = URL.createObjectURL(file);
						a.href = url;
						a.download = filename;
						document.body.appendChild(a);
						a.click();
						setTimeout(function() {
								document.body.removeChild(a);
								window.URL.revokeObjectURL(url);
						}, 0);
				}
		}




});
