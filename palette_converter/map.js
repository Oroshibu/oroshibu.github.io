$(document).ready(function(){

	const EL = (sel) => document.querySelector(sel);
	var canvas = document.createElement('canvas');
	const ctx = canvas.getContext("2d");
	var canvas2 = document.createElement('canvas2');
	const ctx2 = canvas2.getContext("2d");

	var palette = [[],[],[],[]];

	function readImage() {
		if (!this.files || !this.files[0]) return;
		
		const FR = new FileReader();
		FR.addEventListener("load", (evt) => {
			const img = new Image();
			img.addEventListener("load", () => {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.drawImage(img, 0, 0);
			});
			img.src = evt.target.result;
		});
		FR.readAsDataURL(this.files[0]);

		importPalette();
	}

	function readImage2() {
		if (!this.files || !this.files[0]) return;
		
		const FR = new FileReader();
		FR.addEventListener("load", (evt) => {
			const img = new Image();
			img.addEventListener("load", () => {
			ctx2.clearRect(0, 0, ctx2.canvas2.width, ctx2.canvas2.height);
			ctx2.drawImage(img, 0, 0);
			});
			img.src = evt.target.result;
		});
		FR.readAsDataURL(this.files[0]);
	}

	function importPalette() {
		for (var i = 1; i < 4; i++) {
			for (var k = 1; k < 4; k++) {
				var pixelData = canvas2.getContext('2d').getImageData(ctx.canvas2.width/4*i, ctx.canvas2.height/4*k, 1, 1).data;
				palette[i][k] = pixelData;
				console.log(palette[i][k]);
			}
		}

	}

	EL("#fileUpload").addEventListener("change", readImage);
	EL("#fileUpload2").addEventListener("change", readImage2);


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
			for (var i = 1; i < textL.length-1; i++) {
				var entity = textL[i].split(',');
				entity[1] =  parseFloat(entity[1]);
				entity[2] =  parseFloat(entity[2]);
				if (entity[0] == "node") {
					if (selectedNodeEntity == -1) {
						selectedNodeEntity = i-2-nodeCount;
						CreateNodeProfile(selectedNodeEntity);
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
