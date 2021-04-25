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
			tiles[i][k] = "0";
		}
	}

	var rect = canvas.getBoundingClientRect();

	var mouseDown = false;
	var mouseDownX = -1;
	var mouseDownY = -1;

	var selectedNodeEntity = -1;
	var selectedNodeId = -1;

	var tileMode = true;

	var img = new Array(2);
	img = {};
	img["0"] = new Image();
	img["@"] = new Image();
	img["%"] = new Image();
	img["#"] = new Image();
	img["$"] = new Image();
	img["*"] = new Image();
	img["+"] = new Image();
	img["1"] = new Image();
	img["2"] = new Image();
	img["3"] = new Image();
	img["4"] = new Image();
	img["5"] = new Image();
	img["6"] = new Image();
	img["7"] = new Image();
	img["8"] = new Image();
	img["9"] = new Image();
	img["A"] = new Image();
	img["B"] = new Image();
	img["C"] = new Image();
	img["D"] = new Image();
	img["E"] = new Image();
	img["F"] = new Image();
	img["G"] = new Image();
	img["H"] = new Image();
	img["I"] = new Image();
	img["J"] = new Image();
	img["K"] = new Image();
	img["L"] = new Image();
	img["M"] = new Image();
	img["N"] = new Image();
	img["O"] = new Image();
	img["P"] = new Image();
	img["Q"] = new Image();
	img["R"] = new Image();
	img["S"] = new Image();
	img["T"] = new Image();
	img["U"] = new Image();
	img["V"] = new Image();
	img["W"] = new Image();
	img["X"] = new Image();
	img["Y"] = new Image();
	img["Z"] = new Image();
	img["["] = new Image();
	img["]"] = new Image();
	img["("] = new Image();
	img["!"] = new Image();

	img["0"].src = "images/void.png";
	img["1"].src = "images/ground.png";
	img["2"].src = "images/sand.png";
	img["3"].src = "images/bridge.png";
	img["4"].src = "images/spike.png";
	img["5"].src = "images/lock_red.png";
	img["6"].src = "images/lock_green.png";
	img["7"].src = "images/lock_blue.png";

	img["crop_topleft"] = new Image();
	img["crop_bottomright"] = new Image();
	img["eraser"] = new Image();
	img["edit_nodes"] = new Image();
	img["edit_width"] = new Image();
	img["edit_height"] = new Image();
	img["node"] = new Image();
	img["player"] = new Image();
	img["buggy"] = new Image();
  img["buggy2"] = new Image();
  img["drooler"] = new Image();
	img["platform_moving"] = new Image();
	img["platform_moving_solid"] = new Image();
  img["platform_rotating_clock"] = new Image();
  img["platform_rotating_counter"] = new Image();
  img["mushroom"] = new Image();
  img["flag"] = new Image();
	img["key_red"] = new Image();
	img["key_green"] = new Image();
	img["key_blue"] = new Image();
	img["scarab"] = new Image();
	img["fuzzy"] = new Image();
	img["fuzzy_rotating_clock"] = new Image();
	img["fuzzy_rotating_counter"] = new Image();
	img["exit"] = new Image();
	img["horzbug"] = new Image();
	img["vertbug"] = new Image();
	img["diamond"] = new Image();
	img["virus"] = new Image();

	img["crop_topleft"].src = "images/crop_topleft.png";
	img["crop_bottomright"].src = "images/crop_bottomright.png";
	img["eraser"].src = "images/eraser.png";
	img["edit_nodes"].src = "images/edit_nodes.png";
	img["edit_width"].src = "images/edit_width.png";
	img["edit_height"].src = "images/edit_height.png";
	img["node"].src = "images/node.png";
 	img["player"].src = "images/player.png";
  img["buggy"].src = "images/buggy.png";
  img["buggy2"].src = "images/buggy2.png";
  img["drooler"].src = "images/drooler.png";
  img["platform_moving"].src = "images/platform_moving.png";
  img["platform_moving_solid"].src = "images/platform_moving_solid.png";
  img["platform_rotating_clock"].src = "images/platform_rotating_clock.png";
  img["platform_rotating_counter"].src = "images/platform_rotating_counter.png";
  img["mushroom"].src = "images/mushroom.png";
  img["flag"].src = "images/flag.png";
  img["key_red"].src = "images/key_red.png";
  img["key_green"].src = "images/key_green.png";
  img["key_blue"].src = "images/key_blue.png";
	img["scarab"].src = "images/scarab.png";
  img["fuzzy"].src = "images/fuzzy.png";
	img["fuzzy_rotating_clock"].src = "images/fuzzy_rotating_clock.png";
	img["fuzzy_rotating_counter"].src = "images/fuzzy_rotating_counter.png";
	img["exit"].src = "images/exit.png";
	img["horzbug"].src = "images/horzbug.png";
	img["vertbug"].src = "images/vertbug.png";
	img["diamond"].src = "images/diamond.png";
	img["virus"].src = "images/virus.png";

	entities = new Array(0);



	DrawMap();

	$(document).keyup(function(e) {
     if (e.key === "Escape") { // escape key maps to keycode `27`
        selectedNodeId = -1;
				selectedNodeEntity = -1;
    }
});

	$('#reset').click(function() {
		ResetMap();
		DrawMap();
	});

	$('#mapCanvas').on('mousemove', function(e){
		console.log(selectedNodeEntity);
		rect = canvas.getBoundingClientRect();
		DrawMap();

		x = e.clientX - rect.left;
    y = e.clientY - rect.top;

		if (tileMode == true) {
			x = Math.floor(x/tileSize);
			y = Math.floor(y/tileSize);

			if (selectedTerrainKey != "%" || selectedTerrainKey != "[" || selectedTerrainKey != "]"|| selectedTerrainKey != "(" || selectedTerrainKey != "!") {
				ctx.drawImage(img[selectedTerrainKey], x*tileSize, y*tileSize, tileSize, tileSize);
			} else {
				ctx.drawImage(img[selectedTerrainKey], x*tileSize, y*tileSize-tileSize, tileSize, tileSize*2);
			}

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
			if (selectedTerrainKey.includes("platform") || selectedTerrainKey.includes("edit") || selectedTerrainKey.includes("eraser") || selectedTerrainKey.includes("mushroom")) {
				x = (Math.floor((x*2)/tileSize)/2)*tileSize+tileSize/2;
				y = (Math.floor((y*2)/tileSize)/2)*tileSize+tileSize/2;
			} else {
				x = Math.floor(x/tileSize)*tileSize+tileSize/2;
				y = Math.floor(y/tileSize)*tileSize+tileSize/2;
			}


				if (selectedTerrainKey == "light64") {
						ctx.drawImage(img[selectedTerrainKey], x-tileSize*2, y-tileSize*2, tileSize*4, tileSize*4);
				} else if (selectedTerrainKey == "light128" || selectedTerrainKey == "coneN" || selectedTerrainKey == "coneE" || selectedTerrainKey == "coneS" || selectedTerrainKey == "coneW") {
						ctx.drawImage(img[selectedTerrainKey], x-tileSize*4, y-tileSize*4, tileSize*8, tileSize*8);
				} else if (selectedTerrainKey == "light256") {
						ctx.drawImage(img[selectedTerrainKey], x-tileSize*8, y-tileSize*8, tileSize*16, tileSize*16);
				} else if (selectedTerrainKey == "light512") {
						ctx.drawImage(img[selectedTerrainKey], x-tileSize*16, y-tileSize*16, tileSize*32, tileSize*32);
				}  else {
					ctx.drawImage(img[selectedTerrainKey], x-tileSize/2, y-tileSize/2, tileSize, tileSize);
				}

				if (mouseDown == true && selectedTerrainKey == "eraser") {
					DeleteEntityEntry(x, y);
				}

				if (mouseDown == true && selectedTerrainKey == "edit_width") {
					EditWidth(x, y);
				}

				if (mouseDown == true && selectedTerrainKey == "edit_height") {
					EditHeight(x, y);
				}

				if (mouseDown == true && selectedTerrainKey == "edit_nodes") {
					SelectEntityNode(x, y);
				}
		}

		if (selectedNodeId != -1 && selectedNodeEntity != -1) {
			ctx.strokeStyle = "#FF0000";
			ctx.beginPath();
			ctx.moveTo(entities[selectedNodeEntity][4][selectedNodeId]["x"], entities[selectedNodeEntity][4][selectedNodeId]["y"]);
			ctx.lineTo(x, y);
			ctx.lineTo(entities[selectedNodeEntity][4][(selectedNodeId+1)%entities[selectedNodeEntity][4].length]["x"], entities[selectedNodeEntity][4][(selectedNodeId+1)%entities[selectedNodeEntity][4].length]["y"]);
			ctx.stroke();
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
			if (selectedTerrainKey.includes("platform") || selectedTerrainKey.includes("edit") || selectedTerrainKey.includes("eraser") || selectedTerrainKey.includes("mushroom")) {
				x = (Math.floor((x*2)/tileSize)/2)*tileSize+tileSize/2;
				y = (Math.floor((y*2)/tileSize)/2)*tileSize+tileSize/2;
			} else {
				x = Math.floor(x/tileSize)*tileSize+tileSize/2;
				y = Math.floor(y/tileSize)*tileSize+tileSize/2;
			}
			if (selectedTerrainKey != "eraser" && selectedTerrainKey != "edit_nodes" && selectedTerrainKey != "edit_width" && selectedTerrainKey != "edit_height"  && selectedTerrainKey != "crop_topleft") {
				CreateEntityEntry(selectedTerrainKey, x, y);
			} else if (selectedTerrainKey == "eraser") {
				DeleteEntityEntry(x, y);
			} else if (selectedTerrainKey == "edit_width") {
				EditWidth(x, y);
			} else if (selectedTerrainKey == "crop_topleft") {
				CropTop(x, y);
			} else if (selectedTerrainKey == "edit_height") {
				EditHeight(x, y);
			} else if (selectedTerrainKey == "edit_nodes") {
				if (selectedNodeEntity == -1) {
					SelectEntityNode(x, y);
				} else {
					AddNode(x, y);
				}

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
				tiles[i][k] = "0";
			}
		}
		entities = [];
	}

		function CreateEntityEntry(name, x, y) {

			if (name.includes("platform") || name.includes("mushroom") || name.includes("fuzzy")) {
				entities.push([name, x, y, [1,1]]);
			} else {
				entities.push([name, x, y]);
			}

			if (name == "crop_bottomright") {
				for (var i = 0; i < entities.length; i++) {
					if (entities[i][0] == "crop_bottomright" && entities[i][1]!=x && entities[i][2]!=y) {
						DeleteEntityEntry(entities[i][1], entities[i][2]);
					}
				}
			}
		}

		function DeleteEntityEntry(x, y) {
			for (var i = 0; i < entities.length; i++) {
				if (x > entities[i][1] - tileSize/2 && x < entities[i][1] + tileSize/2 && y > entities[i][2] - tileSize/2 && y < entities[i][2] + tileSize/2) {
						entities.splice(i, 1);
				}
				if (entities[i].length > 4) {
					for (var k = 0; k < entities[i][4].length; k++) {
						if (x > entities[i][4][k]["x"] - tileSize/2 && x < entities[i][4][k]["x"] + tileSize/2 && y > entities[i][4][k]["y"] - tileSize/2 && y < entities[i][4][k]["y"] + tileSize/2) {
							entities[i][4].splice(k, 1);
						}

					}
				}
			}
			selectedNodeId = -1;
			selectedNodeEntity = -1;
		}


		function CropTop(x, y) {
			console.log(x,y);
			x = Math.floor(x/tileSize);
			y = Math.floor(y/tileSize);
			for (var i = 0; i < nY-y; i++) {
				for (var k = 0; k < nX-x; k++) {
						tiles[i][k] = tiles[i+y][k+x];
				}
			}
			for (var i = nY-y; i < nY; i++) {
				for (var k = nX-x; k < nX; k++) {
						tiles[i][k] = 0;
				}
			}

			for (var i = 0; i < entities.length; i++) {
				entities[i][1] -= x*tileSize;
				entities[i][2] -= y*tileSize;
				if (entities[i].length > 4) {
						for (var k = 0; k < entities[i][4].length; k++) {
							entities[i][4][k]["x"] -= x*tileSize;
							entities[i][4][k]["y"] -= y*tileSize;
						}
				}
			}
			for (var i = 0; i < entities.length; i++) {
				if (entities[i][1] < 0 || entities[i][2] < 0) {
					DeleteEntityEntry(entities[i][1], entities[i][2]);
				}
			}
		}


		function EditWidth(x, y) {
			for (var i = 0; i < entities.length; i++) {
				if (entities[i][0].includes("platform") || entities[i][0].includes("mushroom")) {
					if (x > entities[i][1] - tileSize/2 && x < entities[i][1] + tileSize/2 && y > entities[i][2] - tileSize/2 && y < entities[i][2] + tileSize/2) {
						var newWidth = prompt("Enter Platform Width (in tiles)", entities[i][3][0]);
						if (!(newWidth == null)) {
							entities[i][3][0] = newWidth;
						}
					}
				}

			}
		}

		function EditHeight(x, y) {
			for (var i = 0; i < entities.length; i++) {
				if (entities[i][0].includes("solid")) {
					if (x > entities[i][1] - tileSize/2 && x < entities[i][1] + tileSize/2 && y > entities[i][2] - tileSize/2 && y < entities[i][2] + tileSize/2) {
						var newHeight = prompt("Enter Platform Height (in tiles)", entities[i][3][1]);
						if (!(newHeight == null)) {
							entities[i][3][1] = newHeight;
						}
					}
				}
			}
		}


		function SelectEntityNode(x, y) {
			for (var i = 0; i < entities.length; i++) {
				if (entities[i].length > 4) {
					for (var k = 0; k < entities[i][4].length; k++) {
						if (x > entities[i][4][k]["x"] - tileSize/2 && x < entities[i][4][k]["x"] + tileSize/2 && y > entities[i][4][k]["y"] - tileSize/2 && y < entities[i][4][k]["y"] + tileSize/2) {
							selectedNodeEntity = i;
							selectedNodeId = k;
						}

					}
				}
				else if (x > entities[i][1] - tileSize/2 && x < entities[i][1] + tileSize/2 && y > entities[i][2] - tileSize/2 && y < entities[i][2] + tileSize/2) {
					if (entities[i][0].includes("platform") || entities[i][0].includes("fuzzy")) {
						if (entities[i].length <= 4) {
							CreateNodeProfile(i);
						}
					}
				}
			}
		}

		function CreateNodeProfile(n) {
			selectedNodeEntity = n;
			selectedNodeId = 0;
			var node = {};
			node["x"] = entities[n][1];
			node["y"] = entities[n][2];
			var newArray = new Array(0);
			newArray.push(node);
			entities[n].push(newArray);
		}

		Array.prototype.insert = function ( index, item ) {
		    this.splice( index, 0, item );
		};

		function AddNode(x, y) {
			var node = {};
			node["x"] = x;
			node["y"] = y;
			entities[selectedNodeEntity][4].insert(selectedNodeId+1, node);
			selectedNodeId += 1;
		}

		function DrawEntities() {
			for (var i = 0; i < entities.length; i++) {
				//console.log(entities[i][0]);
				if (entities[i][0].includes("platform") || entities[i][0].includes("mushroom")) {
						ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize*entities[i][3][0]/2, entities[i][2]-tileSize*entities[i][3][1]/2, tileSize*entities[i][3][0], tileSize*entities[i][3][1]);
				} else if (entities[i][0] == "exit") {
						ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize/2, entities[i][2]-tileSize/2, tileSize*2, tileSize*2);
				} else if (entities[i][0] == "light128" || entities[i][0] == "coneN" || entities[i][0] == "coneE" || entities[i][0] == "coneS" || entities[i][0] == "coneW") {
						ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize*4, entities[i][2]-tileSize*4, tileSize*8, tileSize*8);
				} else if (entities[i][0] == "light256") {
						ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize*8, entities[i][2]-tileSize*8, tileSize*16, tileSize*16);
				} else if (entities[i][0] == "light512") {
						ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize*16, entities[i][2]-tileSize*16, tileSize*32, tileSize*32);
				}
					if (entities[i].length > 4) {
						ctx.strokeStyle = "#FF0000";
						ctx.beginPath();
						console.log(entities[i]);
						ctx.moveTo(entities[i][4][0]["x"], entities[i][4][0]["y"]);
						for (var k = 0; k < entities[i][4].length; k++) {
							ctx.drawImage(img["node"], entities[i][4][k]["x"]-tileSize/2, entities[i][4][k]["y"]-tileSize/2, tileSize, tileSize);
							ctx.lineTo(entities[i][4][(k+1)%entities[i][4].length]["x"], entities[i][4][(k+1)%entities[i][4].length]["y"]);
						}

						ctx.stroke();
					}
					ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize/2, entities[i][2]-tileSize/2, tileSize, tileSize);
				}


		}

		function DrawMap() {
			var cropX = canvas.width;
			var cropY = canvas.height;
			for (var i = 0; i < entities.length; i++) {
				if (entities[i][0] == "crop_bottomright") {
						cropX = entities[i][1] + tileSize/2;
						cropY = entities[i][2] + tileSize/2;
				}
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillRect(0, 0, cropX, cropY);
			ctx.fillStyle = 'rgb(15, 15, 15)';
			for (var i = 0; i < nY; i++) {
				ctx.fillRect(0, i*tileSize, canvas.width, 1);
			}
			for (var i = 0; i < nX; i++) {
				ctx.fillRect(i*tileSize, 0, 1, canvas.height);
			}

			ctx.strokeStyle = "green";
			ctx.strokeRect(0, 0, 400, 300);

			for (var i = 0; i < nY; i++) {
				for (var k = 0; k < nX; k++) {
					if (tiles[i][k] == "%" || tiles[i][k] == "["  || tiles[i][k] == "]" || tiles[i][k] == "(" || tiles[i][k] == "!") {
						ctx.drawImage(img[tiles[i][k]], k*tileSize, i*tileSize-tileSize, tileSize, tileSize*2);
					} else if (tiles[i][k] != "0") {
						ctx.drawImage(img[tiles[i][k]], k*tileSize, i*tileSize, tileSize, tileSize);
					}

					if (tiles[i][k] == "tempo") {
						ctx.drawImage(img[tiles[i][k]], k*tileSize, i*tileSize-tileSize, tileSize, tileSize*3);
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
			stringu += ",,,,\n";
			//copyToClipboard(stringu);

			for (var i = 0; i < entities.length; i++) {
				stringu += entities[i][0] + ",";
				stringu += (Math.floor(2*entities[i][1]/tileSize)/2).toString() + ",";
				stringu += (Math.floor(2*entities[i][2]/tileSize)/2).toString() + ",";
				console.log(entities[i]);
				if (entities[i].length > 3) {
					stringu += entities[i][3][0].toString() + ",";
					stringu += entities[i][3][1].toString();
				} else {
					stringu += ",";
				}
				stringu += "\n";
				if (entities[i].length > 4) {
					if (entities[i][0].includes("rotating")) {
						stringu += "node,";
						stringu += (Math.floor(2*entities[i][4][1]["x"]/tileSize)/2).toString() + ",";
						stringu += (Math.floor(2*entities[i][4][1]["y"]/tileSize)/2).toString() + ",,\n";
					} else {
						for (var k = 0; k < entities[i][4].length; k++) {
							stringu += "node,";
							stringu += (Math.floor(2*entities[i][4][k]["x"]/tileSize)/2).toString() + ",";
							stringu += (Math.floor(2*entities[i][4][k]["y"]/tileSize)/2).toString() + ",,\n";
						}
					}

				}
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

			var nodeCount = 0;
			var seen_rotate = false;
			for (var i = 1; i < textL.length-1; i++) {
				var entity = textL[i].split(',');
				entity[1] =  parseFloat(entity[1])*tileSize;
				entity[2] =  parseFloat(entity[2])*tileSize;
				if (entity[0].includes("platform") || entity[0].includes("mushroom") || entity[0].includes("fuzzy")) {
					entity[3] = [parseFloat(entity[3]),  parseFloat(entity[4])];
					entity.splice(4, 1);
				} else {
					entity.splice(3, 2);
				}
				if (entity[0].includes("rotating")) {
					seen_rotate = true;
				}
				if (entity[0] == "node") {
					if (selectedNodeEntity == -1) {
						selectedNodeEntity = i-2-nodeCount;
						CreateNodeProfile(selectedNodeEntity);
						if (seen_rotate == true) {
							AddNode(entity[1], entity[2]);
							seen_rotate = false;
						}
					} else {
						AddNode(entity[1], entity[2]);
					}
					nodeCount += 1;
				} else {
					entities.push(entity);
					selectedNodeEntity = -1;
				}

			}

			selectedNodeId = -1;
			selectedNodeEntity = -1;

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
