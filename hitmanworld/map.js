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

	img["0"].src = "images/void.png";
	img["%"].src = "images/glass.png";
	img["#"].src = "images/floor1.png";
	img["$"].src = "images/floor2.png";
	img["*"].src = "images/floor3.png";
	img["+"].src = "images/floor4.png";
	img["1"].src = "images/walltop1.png";
	img["2"].src = "images/walltop2.png";
	img["3"].src = "images/walltop3.png";
	img["4"].src = "images/walltop4.png";
	img["5"].src = "images/walltop5.png";
	img["6"].src = "images/wallside1.png";
	img["7"].src = "images/wallside2.png";
	img["8"].src = "images/wallside3.png";
	img["9"].src = "images/wallside4.png";
	img["A"].src = "images/wallside5.png";
	img["B"].src = "images/wallside6.png";
	img["C"].src = "images/wallside7.png";
	img["D"].src = "images/wallside8.png";
	img["E"].src = "images/wallside9.png";
	img["F"].src = "images/wallside10.png";
	img["G"].src = "images/wallside11.png";
	img["H"].src = "images/wallside12.png";
	img["I"].src = "images/wallside13.png";
	img["J"].src = "images/wallside14.png";
	img["K"].src = "images/wallside15.png";
	img["L"].src = "images/wallside16.png";
	img["M"].src = "images/wallside17.png";
	img["N"].src = "images/wallside18.png";
	img["O"].src = "images/wallside19.png";
	img["P"].src = "images/wallside20.png";
	img["Q"].src = "images/wallside21.png";
	img["R"].src = "images/wallside22.png";
	img["S"].src = "images/wallside23.png";
	img["T"].src = "images/wallside24.png";
	img["U"].src = "images/wallside25.png";
	img["V"].src = "images/wallside26.png";
	img["W"].src = "images/wallside27.png";
	img["X"].src = "images/wallside28.png";
	img["Y"].src = "images/wallside29.png";
	img["Z"].src = "images/wallside30.png";
	img["["].src = "images/red_door.png";
	img["]"].src = "images/green_door.png";

	img["eraser"] = new Image();
	img["player"] = new Image();
	img["chair"] = new Image();
	img["monitor"] = new Image();
	img["knife"] = new Image();
	img["suppressed_pistol"] = new Image();
	img["pistol"] = new Image();
	img["shotgun"] = new Image();
	img["cop_pistol"] = new Image();
	img["cop_shotgun"] = new Image();
	img["target"] = new Image();
	img["bystander"] = new Image();
	img["edit_nodes"] = new Image();
	img["node"] = new Image();
	img["grunt"] = new Image();
	img["grunt_chair"] = new Image();
	img["grunt_knife"] = new Image();
	img["grunt_suppressed_pistol"] = new Image();
	img["grunt_pistol"] = new Image();
	img["grunt_shotgun"] = new Image();
	img["light64"] = new Image();
	img["light128"] = new Image();
	img["light256"] = new Image();
	img["coneN"] = new Image();
	img["coneE"] = new Image();
	img["coneS"] = new Image();
	img["coneW"] = new Image();
	img["eraser"].src = "images/eraser.png";
	img["player"].src = "images/player.png";
	img["chair"].src = "images/chair.png";
	img["monitor"].src = "images/monitor.png";
	img["knife"].src = "images/knife.png";
	img["suppressed_pistol"].src = "images/suppressed_pistol.png";
	img["pistol"].src = "images/pistol.png";
	img["shotgun"].src = "images/shotgun.png";
	img["cop_pistol"].src = "images/cop_pistol.png";
	img["cop_shotgun"].src = "images/cop_shotgun.png";
	img["target"].src = "images/target.png";
	img["bystander"].src = "images/bystander.png";
	img["edit_nodes"].src = "images/edit_nodes.png";
	img["node"].src = "images/node.png";
	img["grunt"].src = "images/grunt.png";
	img["grunt_chair"].src = "images/grunt_chair.png";
	img["grunt_knife"].src = "images/grunt_knife.png";
	img["grunt_suppressed_pistol"].src = "images/grunt_suppressed_pistol.png";
	img["grunt_pistol"].src = "images/grunt_pistol.png";
	img["grunt_shotgun"].src = "images/grunt_shotgun.png";
	img["light64"].src = "images/light.png";
	img["light64"].src = "images/light.png";
	img["light128"].src = "images/light.png";
	img["light256"].src = "images/light.png";
	img["coneN"].src = "images/coneN.png";
	img["coneE"].src = "images/coneE.png";
	img["coneS"].src = "images/coneS.png";
	img["coneW"].src = "images/coneW.png";



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

			if (selectedTerrainKey != "%" || selectedTerrainKey != "[" || selectedTerrainKey != "]") {
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

				if (selectedTerrainKey == "light64") {
						ctx.drawImage(img[selectedTerrainKey], x-tileSize*2, y-tileSize*2, tileSize*4, tileSize*4);
				} else if (selectedTerrainKey == "light128" || selectedTerrainKey == "coneN" || selectedTerrainKey == "coneE" || selectedTerrainKey == "coneS" || selectedTerrainKey == "coneW") {
						ctx.drawImage(img[selectedTerrainKey], x-tileSize*4, y-tileSize*4, tileSize*8, tileSize*8);
				} else if (selectedTerrainKey == "light256") {
						ctx.drawImage(img[selectedTerrainKey], x-tileSize*8, y-tileSize*8, tileSize*16, tileSize*16);
				} else {
					ctx.drawImage(img[selectedTerrainKey], x-tileSize/2, y-tileSize/2, tileSize, tileSize);
				}

				if (mouseDown == true && selectedTerrainKey == "eraser") {
					DeleteEntityEntry(x, y);
				}

				if (mouseDown == true && selectedTerrainKey == "edit_nodes") {
					SelectEntityNode(x, y);
				}
		}

		if (selectedNodeId != -1 && selectedNodeEntity != -1) {
			ctx.strokeStyle = "#FF0000";
			ctx.beginPath();
			ctx.moveTo(entities[selectedNodeEntity][3][selectedNodeId]["x"], entities[selectedNodeEntity][3][selectedNodeId]["y"]);
			ctx.lineTo(x, y);
			ctx.lineTo(entities[selectedNodeEntity][3][(selectedNodeId+1)%entities[selectedNodeEntity][3].length]["x"], entities[selectedNodeEntity][3][(selectedNodeId+1)%entities[selectedNodeEntity][3].length]["y"]);
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
			if (selectedTerrainKey != "eraser" && selectedTerrainKey != "edit_nodes") {
				CreateEntityEntry(selectedTerrainKey, x, y);
			} else if (selectedTerrainKey == "eraser") {
				DeleteEntityEntry(x, y);
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
			entities.push([name, x, y])
		}

		function DeleteEntityEntry(x, y) {
			for (var i = 0; i < entities.length; i++) {
				if (x > entities[i][1] - tileSize/2 && x < entities[i][1] + tileSize/2 && y > entities[i][2] - tileSize/2 && y < entities[i][2] + tileSize/2) {
						entities.splice(i, 1);
				}
				if (entities[i].length > 3) {
					for (var k = 0; k < entities[i][3].length; k++) {
						if (x > entities[i][3][k]["x"] - tileSize/2 && x < entities[i][3][k]["x"] + tileSize/2 && y > entities[i][3][k]["y"] - tileSize/2 && y < entities[i][3][k]["y"] + tileSize/2) {
							entities[i][3].splice(k, 1);
						}

					}
				}
			}
			selectedNodeId = -1;
			selectedNodeEntity = -1;
		}

		function SelectEntityNode(x, y) {
			for (var i = 0; i < entities.length; i++) {
				if (entities[i].length > 3) {
					for (var k = 0; k < entities[i][3].length; k++) {
						if (x > entities[i][3][k]["x"] - tileSize/2 && x < entities[i][3][k]["x"] + tileSize/2 && y > entities[i][3][k]["y"] - tileSize/2 && y < entities[i][3][k]["y"] + tileSize/2) {
							selectedNodeEntity = i;
							selectedNodeId = k;
						}

					}
				}
				else if (x > entities[i][1] - tileSize/2 && x < entities[i][1] + tileSize/2 && y > entities[i][2] - tileSize/2 && y < entities[i][2] + tileSize/2) {
					if (entities[i][0].includes("grunt")) {
						if (entities[i].length <= 3) {
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
			entities[selectedNodeEntity][3].insert(selectedNodeId+1, node);
			selectedNodeId += 1;
		}

		function DrawEntities() {
			for (var i = 0; i < entities.length; i++) {
				//console.log(entities[i][0]);
				if (entities[i][0] == "light64") {
						ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize*2, entities[i][2]-tileSize*2, tileSize*4, tileSize*4);
				} else if (entities[i][0] == "light128" || entities[i][0] == "coneN" || entities[i][0] == "coneE" || entities[i][0] == "coneS" || entities[i][0] == "coneW") {
						ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize*4, entities[i][2]-tileSize*4, tileSize*8, tileSize*8);
				} else if (entities[i][0] == "light256") {
						ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize*8, entities[i][2]-tileSize*8, tileSize*16, tileSize*16);
				} else {
					if (entities[i].length > 3) {
						ctx.strokeStyle = "#FF0000";
						ctx.beginPath();
						ctx.moveTo(entities[i][3][0]["x"], entities[i][3][0]["y"]);
						for (var k = 0; k < entities[i][3].length; k++) {
							ctx.drawImage(img["node"], entities[i][3][k]["x"]-tileSize/2, entities[i][3][k]["y"]-tileSize/2, tileSize, tileSize);
							ctx.lineTo(entities[i][3][(k+1)%entities[i][3].length]["x"], entities[i][3][(k+1)%entities[i][3].length]["y"]);
						}

						ctx.stroke();
					}
					ctx.drawImage(img[entities[i][0]], entities[i][1]-tileSize/2, entities[i][2]-tileSize/2, tileSize, tileSize);
				}

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
					if (tiles[i][k] == "%" || tiles[i][k] == "["  || tiles[i][k] == "]") {
						ctx.drawImage(img[tiles[i][k]], k*tileSize, i*tileSize-tileSize, tileSize, tileSize*2);
					} else if (tiles[i][k] != "0") {
						ctx.drawImage(img[tiles[i][k]], k*tileSize, i*tileSize, tileSize, tileSize);
					}

					if (tiles[i][k] == "2" || tiles[i][k] == "3" || tiles[i][k] == "4" || tiles[i][k] == "5") {
						ctx.drawImage(img[tiles[i][k]], k*tileSize, i*tileSize-tileSize, tileSize, tileSize*3);
					}
				}
			}
			/*
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
			}*/
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
				stringu += Math.round(entities[i][1]).toString() + ",";
				stringu += Math.round(entities[i][2]).toString() + "\n";
				if (entities[i].length > 3) {
					for (var k = 0; k < entities[i][3].length; k++) {
						stringu += "node,";
						stringu += Math.round(entities[i][3][k]["x"]).toString() + ",";
						stringu += Math.round(entities[i][3][k]["y"]).toString() + "\n";
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

			for (var i = 1; i < textL.length-1; i++) {
				var entity = textL[i].split(',');
				entity[1] =  parseFloat(entity[1]);
				entity[2] =  parseFloat(entity[2]);
				if (entity[0] == "node") {
					if (selectedNodeEntity == -1) {
						selectedNodeEntity = i-2;
						CreateNodeProfile(selectedNodeEntity);
					} else {
						AddNode(entity[1], entity[2]);
					}
				} else {
					entities.push(entity);
					selectedNodeEntity = -1;
				}

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
