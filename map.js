$(document).ready(function(){

	var tileDict = {};
	var selectedColor = "#292738";
	var selectedSprite = "none";
	var selectedTerrainKey = "B";
	var width = parseInt($('#width').val());
	var height = parseInt($('#height').val());
	var multX = parseInt($('#multX').val());
	var multY = parseInt($('#multY').val());
	var tileSize = parseInt($('#tileSize').val());
	var nTiles = ((width * multX) / tileSize) * ((height * multY) / tileSize);
	BuildMap(width, height, multX, multY, tileSize);
	//var indico = "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccxxxxxxcccxxxxxxccccccccccccxxxxxxcccxxxxxxcccccccccccxxxxxxxcccxxxxxxxccccccccxxxxxcccccccccccxxxxxccccccxxxxxcccccccccccxxxxxccccccxxxcccccccccccccccxxxccccccxxxccccxxcccxxccccxxxccccccxxxcccxxcccccxxcccxxxccccccxxxcccxcccccccxcccxxxcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccxxxcccxcccccccxcccxxxccccccxxxcccxxcccccxxcccxxxccccccxxxccccxxcccxxccccxxxccccccxxxcccccccccccccccxxxccccccxxxxxcccccccccccxxxxxccccccxxxxxcccccccccccxxxxxccccccccxxxxxxxcccxxxxxxxcccccccccccxxxxxxcccxxxxxxccccccccccccxxxxxxcccxxxxxxccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
	
	$('#init').click(function() {
		selectedColor = "#292738";
		selectedSprite = "none";
		selectedTerrainKey = "B";
		var width = parseInt($('#width').val());
		var height = parseInt($('#height').val());
		var multX = parseInt($('#multX').val());
		var multY = parseInt($('#multY').val());
		var tileSize = parseInt($('#tileSize').val());
		var nTiles = ((width * multX) / tileSize) * ((height * multY) / tileSize);
		BuildMap(width, height, multX, multY, tileSize);
	});
	
	$('#scrolldown').click(function() {
	  document.body.scrollTop = 2000; // For Safari
	  document.documentElement.scrollTop = 2000; // For Chrome, Firefox, IE and Opera
	});

	$('#importenemies').click(function(){
		  document.body.scrollTop = 0; // For Safari
		  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		//BuildMap(width, height, multX, multY, tileSize);
		var textE = document.getElementById("mapImporter").value;
		/*$(this).css({'background-color': selectedColor});
		$(this).css({'background-image': selectedSprite});
		$(this).css({'background-size': "contain"});
		$(this).css({'background-repeat': "no-repeat"});*/
		
		for (k = 0; k < 27; k++) { 
			for (i = 0; i < 27; i++) { 
					var origin = i+k*27;
					tileDict[origin] = textE.substring(i+k*27+k*2, 1+i+k*27+k*2);
					var impCol = "#67dbd0";
					var impSpr = "none";

					switch (textE.substring(i+k*27+k*2, 1+i+k*27+k*2)) {
						case 's':
							impSpr = "url(images/mine.png)";
							break;
						case 'm':
							impSpr = "url(images/magnet.png)";
							break;
						case 'c':
							impSpr = "url(images/core.png)";
							break;
						case 'b':
							impSpr = "url(images/blackhole.png)";
							break;
						case 'o':
							impSpr = "url(images/suck.png)";
							break;
						case 't':
							impSpr = "url(images/stealer.png)";
							break;
						case '>':
							impSpr = "url(images/right_huge.png)";
							break;
						case '<':
							impSpr = "url(images/left_huge.png)";
							break;	
						case 'v':
							impSpr = "url(images/down_huge.png)";
							break;
						case '^':
							impSpr = "url(images/up_huge.png)";
							break;		
						case 'r':
							impSpr = "url(images/meteor.png)";
							break;								
						default:
							impCol = "white";
							impSpr = "none";						
							
					}
					if (textE.substring(i+k*27+k*2, 1+i+k*27+k*2) != " "){
						$('#'+ origin).css({'background-size': "contain"});
						$('#'+ origin).css({'background-repeat': "no-repeat"});
						$('#'+ origin).css({'background-color': impCol});
						$('#'+ origin).css({'background-image': impSpr});
					}
			}
		}
	});
	
	$('#importwalls').click(function(){
		  document.body.scrollTop = 0; // For Safari
		  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		//BuildMap(width, height, multX, multY, tileSize);
		var textE = document.getElementById("mapImporter").value;
		/*$(this).css({'background-color': selectedColor});
		$(this).css({'background-image': selectedSprite});
		$(this).css({'background-size': "contain"});
		$(this).css({'background-repeat': "no-repeat"});*/
		
		for (k = 0; k < 13; k++) { 
			for (i = 0; i < 13; i++) { 
					var origin = i+k*27;
					tileDict[origin] = textE.substring(i+k*13+k*2, 1+i+k*13+k*2);
					var impCol = "#292738";
					var impSpr = "url(images/wall.png)";

					if (textE.substring(i+k*13+k*2, 1+i+k*13+k*2) == "#"){
						$('#'+ origin).css({'background-size': "contain"});
						$('#'+ origin).css({'background-repeat': "no-repeat"});
						$('#'+ origin).css({'background-color': impCol});
						$('#'+ origin).css({'background-image': impSpr});
						
						var origin2 = (origin - origin%27) + (27 - origin%27) - 1;
				
						$('#'+ origin2).css({'background-size': "contain"});
						$('#'+ origin2).css({'background-repeat': "no-repeat"});
						$('#'+ origin2).css({'background-color': impCol});
						$('#'+ origin2).css({'background-image': impSpr});
						tileDict[origin2] = "#";

						
						origin = (26 - Math.floor(origin/27))*27 + origin%27;
						
						$('#'+ origin).css({'background-size': "contain"});
						$('#'+ origin).css({'background-repeat': "no-repeat"});
						$('#'+ origin).css({'background-color': impCol});
						$('#'+ origin).css({'background-image': impSpr});
						tileDict[origin] = "#";

						
						origin2 = (origin - origin%27) + (27 - origin%27) - 1;
						
						$('#'+ origin2).css({'background-size': "contain"});
						$('#'+ origin2).css({'background-repeat': "no-repeat"});
						$('#'+ origin2).css({'background-color': impCol});
						$('#'+ origin2).css({'background-image': impSpr});
						tileDict[origin2] = "#";

					}
			}
		}
	});
	
	$('#exportenemies').click(function(){
		var fname = $('#filename').val(); 
		var stringu = "";
		//stringu += "```\n";
		for (k = 0; k < 27; k++) { 
			for (i = 0; i < 27; i++) { 
				if (tileDict[i+k*27]=="B" || tileDict[i+k*27]=="#" || tileDict[i+k*27]=="b" || tileDict[i+k*27]=="x") {
					stringu += " ";
				} else if (tileDict[i+k*27]=="g") {
					stringu += "b";
				} else {
					stringu += tileDict[i+k*27];
				}
			}
			//stringu += ";\n";
			stringu += ";";
		}
		//stringu += "```";
		copyToClipboard(stringu);
		  
		//download(stringu, fname, "application/json")
	});
	
	$('#exportwalls').click(function(){
		var fname = $('#filename').val(); 
		var stringu = "";
		//stringu += "```\n";
		for (k = 0; k < 13; k++) { 
			for (i = 0; i < 13; i++) { 
				if (tileDict[i+k*27]=="B") {
					stringu += " ";
				} else if (tileDict[i+k*27]=="#" || tileDict[i+k*27]=="b" || tileDict[i+k*27]=="x") {
					stringu += tileDict[i+k*27];
				} else {
					stringu += " ";
				}
			}
			//stringu += ";\n";
			stringu += ";";
		}
		//stringu += "```";
		copyToClipboard(stringu);
		  
		//download(stringu, fname, "application/json")
	});

	$('.terrain').click(function() {
		selectedColor = $(this).css("background-color");
		selectedSprite = $(this).css("background-image");
		selectedTerrainKey = $(this).text();
		$('.terrain').css({"border-style":"none"});
		$(this).css({'border-style':'solid'});
	});

	$('#map').on('mousemove', '.tile', function(e){
		if (e.buttons === 1) {
	    	//$(this).css({'background-color': selectedColor});
			$(this).css({'background-color': selectedColor});
			$(this).css({'background-image': selectedSprite});
			$(this).css({'background-size': "contain"});
			$(this).css({'background-repeat': "no-repeat"});
	    	var id = $(this).attr('id');
			if ((selectedTerrainKey == "#") || (tileDict[id]== "#") || (selectedTerrainKey == "b") || (tileDict[id]== "b") || (selectedTerrainKey == "x") || (tileDict[id]== "x")) {
				var origin = (id - id%27) + (27 - id%27) - 1;
				
				$('#'+ origin).css({'background-color': selectedColor});
				$('#'+ origin).css({'background-image': selectedSprite});
				$('#'+ origin).css({'background-size': "contain"});
				$('#'+ origin).css({'background-repeat': "no-repeat"});
				tileDict[origin] = selectedTerrainKey;
				if (selectedTerrainKey == 'B') {
					$('#'+ origin).css({'background-color': $(this).css('color')});
				}
				
				var origin = (26 - Math.floor(id/27))*27 + id%27;
				
				$('#'+ origin).css({'background-color': selectedColor});
				$('#'+ origin).css({'background-image': selectedSprite});
				$('#'+ origin).css({'background-size': "contain"});
				$('#'+ origin).css({'background-repeat': "no-repeat"});
				tileDict[origin] = selectedTerrainKey;
				if (selectedTerrainKey == 'B') {
					$('#'+ origin).css({'background-color': $(this).css('color')});
				}
				
				var origin = (origin - origin%27) + (27 - origin%27) - 1;
				
				$('#'+ origin).css({'background-color': selectedColor});
				$('#'+ origin).css({'background-image': selectedSprite});
				$('#'+ origin).css({'background-size': "contain"});
				$('#'+ origin).css({'background-repeat': "no-repeat"});
				tileDict[origin] = selectedTerrainKey;
				if (selectedTerrainKey == 'B') {
					$('#'+ origin).css({'background-color': $(this).css('color')});
				}
			}
			if (selectedTerrainKey == 'B') {
				$(this).css({'background-color': $(this).css('color')});
			}
			

	    	tileDict[id] = selectedTerrainKey;
			
		}
	});
	
	$('#map').on('mousedown', '.tile', function(e){
		if (e.buttons === 1) {
	    	//$(this).css({'background-color': selectedColor});
			$(this).css({'background-color': selectedColor});
			$(this).css({'background-image': selectedSprite});
			$(this).css({'background-size': "contain"});
			$(this).css({'background-repeat': "no-repeat"});
	    	var id = $(this).attr('id');
			if ((selectedTerrainKey == "#") || (tileDict[id]== "#") || (selectedTerrainKey == "b") || (tileDict[id]== "b") || (selectedTerrainKey == "x") || (tileDict[id]== "x")) {
				var origin = (id - id%27) + (27 - id%27) - 1;
				
				$('#'+ origin).css({'background-color': selectedColor});
				$('#'+ origin).css({'background-image': selectedSprite});
				$('#'+ origin).css({'background-size': "contain"});
				$('#'+ origin).css({'background-repeat': "no-repeat"});
				tileDict[origin] = selectedTerrainKey;
				if (selectedTerrainKey == 'B') {
					$('#'+ origin).css({'background-color': $(this).css('color')});
				}
				
				var origin = (26 - Math.floor(id/27))*27 + id%27;
				
				$('#'+ origin).css({'background-color': selectedColor});
				$('#'+ origin).css({'background-image': selectedSprite});
				$('#'+ origin).css({'background-size': "contain"});
				$('#'+ origin).css({'background-repeat': "no-repeat"});
				tileDict[origin] = selectedTerrainKey;
				if (selectedTerrainKey == 'B') {
					$('#'+ origin).css({'background-color': $(this).css('color')});
				}
				
				var origin = (origin - origin%27) + (27 - origin%27) - 1;
				
				$('#'+ origin).css({'background-color': selectedColor});
				$('#'+ origin).css({'background-image': selectedSprite});
				$('#'+ origin).css({'background-size': "contain"});
				$('#'+ origin).css({'background-repeat': "no-repeat"});
				tileDict[origin] = selectedTerrainKey;
				if (selectedTerrainKey == 'B') {
					$('#'+ origin).css({'background-color': $(this).css('color')});
				}
			}
			if (selectedTerrainKey == 'B') {
				$(this).css({'background-color': $(this).css('color')});
			}
			

	    	tileDict[id] = selectedTerrainKey;
		}
	});

	function BuildMap(width, height, multX, multY, tileSize) {
		
		tileDict = {};
		$('#map').empty();

		var cols = Math.floor((width / tileSize) * multX);
		var rows = Math.floor((height / tileSize) * multY);

		var displayTileSizeX = 24;
		var displayTileSizeY = 24;

		document.getElementById('map').style.setProperty('--ncols', cols.toString());
		document.getElementById('map').style.setProperty('--nrows', rows.toString());
		document.getElementById('map').style.setProperty('--tileX', displayTileSizeX.toString() + "px");
		document.getElementById('map').style.setProperty('--tileY', displayTileSizeY.toString() + "px");

		var index = 0;
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				$('#map').append('<div class="tile" id="'+ index + '" style="width:' + displayTileSizeX + 'px;height:' + displayTileSizeY + 'px;"></div>');
				tileDict[index] = selectedTerrainKey;
				index++;
			}
		}

		$('#nTiles').text((cols * rows));
		$('#cols').text(cols);
		$('#rows').text(rows);
		
		//TODO - make tiles and map not draggable
		
		// color the origin
		//var origin = Math.floor(((cols * rows) / 2) - (cols/2));
		var origin = Math.floor(((cols * rows) / 2));

		$('#'+origin).css('background-color', 'red');
		$('#'+origin).css('color', 'red');
		
        var indico = "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccxxxxxxcccxxxxxxccccccccccccxxxxxxcccxxxxxxcccccccccccxxxxxxxcccxxxxxxxccccccccxxxxxcccccccccccxxxxxccccccxxxxxcccccccccccxxxxxccccccxxxcccccccccccccccxxxccccccxxxccccxxcccxxccccxxxccccccxxxcccxxcccccxxcccxxxccccccxxxcccxcccccccxcccxxxcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccxxxcccxcccccccxcccxxxccccccxxxcccxxcccccxxcccxxxccccccxxxccccxxcccxxccccxxxccccccxxxcccccccccccccccxxxccccccxxxxxcccccccccccxxxxxccccccxxxxxcccccccccccxxxxxccccccccxxxxxxxcccxxxxxxxcccccccccccxxxxxxcccxxxxxxccccccccccccxxxxxxcccxxxxxxccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
		for (i = 0; i < 729; i++) {
			if (indico.substring(i, i+1)=="x") {
				origin = i;
				$('#'+ origin).css('background-color', '#373548');
				$('#'+ origin).css('color', '#373548');
			}
		}
	}

	// Function to download data to a file
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

