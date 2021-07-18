import { default as config } from "./config.js";
import { default as instances } from "./instances.js";


function Clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

export class GUI {
    constructor(size = {x:256, y:256}, y = 100){
        this._GUIY = y;
        this._size = size;
        this._categories = {};
        this._categoriesNames = [];
        this._selectedCategory = 0;
        this._scroll = 0;
        this._perX = Math.floor((this._size.x-config.GUIMargin)/(config.GUITileSize+config.GUIMargin));
        this._adaptX = Math.floor((this._size.x-(this._perX*(config.GUITileSize+config.GUIMargin)+config.GUIMargin))/2);
        this._categHeight = 32;
        this._categHover = -1;
        for (let i in instances){
            if (this._categories[instances[i]._category] == null) {
                this._categories[instances[i]._category] = [];
                this._categoriesNames.push(instances[i]._category);
            }
            this._categories[instances[i]._category].push(instances[i]);
        }
    }
   
    hover(x, y) {
        this.unhover();
        if (x>(config.GUIWidth-this._size.x)/2 && x<this._size.x+(config.GUIWidth-this._size.x)/2) {
            if (y-this._GUIY < this._categHeight && this._categoriesNames.length > 1) {
                let relativex = Math.floor((x - (config.GUIWidth-this._size.x)/2)/(this._size.x/this._categoriesNames.length));
                this._categHover = relativex;
            } else {
                let relativex = Math.floor((x - (config.GUIWidth-this._size.x)/2 - this._adaptX - config.GUIMargin)/(config.GUITileSize+config.GUIMargin));
                let relativey = Math.floor((y - this._GUIY - config.GUIMargin - this._scroll - this._categHeight)/(config.GUITileSize+config.GUIMargin));
                if (relativex >= 0 && relativey >= 0 && relativex < this._perX){
                    let i = relativex + relativey*this._perX;
                    if (this._categories[this._categoriesNames[this._selectedCategory]][i] != null){
                        this._categories[this._categoriesNames[this._selectedCategory]][i].GUIHover();
                    }
                }
            }          
        }

    }

    unhover() {
        this._categHover = -1;
        for (let i in this._categories[this._categoriesNames[this._selectedCategory]]){
            this._categories[this._categoriesNames[this._selectedCategory]][i].GUIUnhover();
        }
    }

    drawGUI(ctx){
        //CATEGORIES LIST
        if (this._categoriesNames.length > 1) {
            for(let i = 0; i < this._categoriesNames.length; i++){
                if (i == this._categHover || i == this._selectedCategory) {
                    ctx.fillStyle = config.masterBgColor;
                } else {
                    ctx.fillStyle = config.GUIBgColor;
                }
                ctx.roundRect(((config.GUIWidth-this._size.x)/2)+i*(this._size.x/this._categoriesNames.length), this._GUIY, this._size.x/this._categoriesNames.length, this._categHeight*2, config.GUIMargin*2);
                ctx.fill();  
                if (i == this._categHover || i == this._selectedCategory) {
                    ctx.fillStyle = config.textColor1;
                } else {
                    ctx.fillStyle = config.textColor2;
                }
                
                ctx.font = (this._categHeight/2.5).toString()+'px Roboto';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle'; 
                ctx.fillText(this._categoriesNames[i], ((config.GUIWidth-this._size.x)/2)+(i+0.5)*(this._size.x/this._categoriesNames.length), this._GUIY+(this._categHeight/2));

            }
        
        }
        //INSIDE CATEGORIES
		ctx.fillStyle = config.masterBgColor;
		ctx.roundRect((config.GUIWidth-this._size.x)/2, this._GUIY + this._categHeight, this._size.x, this._size.y, config.GUIMargin);
		ctx.fill();
        for (let i in this._categories[this._categoriesNames[this._selectedCategory]]){
            let obj = this._categories[this._categoriesNames[this._selectedCategory]][i];
            let objx = (i%this._perX)*(config.GUITileSize+config.GUIMargin);
            let objy = Math.floor(i/this._perX)*(config.GUITileSize+config.GUIMargin);
            obj.drawOnUI(ctx, config.GUITileSize, objx+(config.GUIWidth-this._size.x)/2+config.GUIMargin+this._adaptX, objy+this._GUIY+config.GUIMargin + this._scroll + this._categHeight);
        }
    }

    leftClick(x, y){
        if (x>(config.GUIWidth-this._size.x)/2 && x<this._size.x+(config.GUIWidth-this._size.x)/2) {
            if (y-this._GUIY < this._categHeight && this._categoriesNames.length > 1) {
                let relativex = Math.floor((x - (config.GUIWidth-this._size.x)/2)/(this._size.x/this._categoriesNames.length));
                if (this._selectedCategory != relativex) {
                    this._selectedCategory = relativex;
                }
                return 0;
            } else {
                let relativex = Math.floor((x - (config.GUIWidth-this._size.x)/2 - this._adaptX - config.GUIMargin)/(config.GUITileSize+config.GUIMargin));
                let relativey = Math.floor((y - this._GUIY - config.GUIMargin - this._scroll - this._categHeight)/(config.GUITileSize+config.GUIMargin));
                if (relativex >= 0 && relativey >= 0 && relativex < this._perX){
                    let i = relativex + relativey*this._perX;
                    if (this._categories[this._categoriesNames[this._selectedCategory]][i] != null){
                        return this._categories[this._categoriesNames[this._selectedCategory]][i];
                    }
                }
                return 0;
            }
        }
    }
}

class Item {
    constructor(name = "Unamed", anchor = {x:0.5, y:0.5}, size = {x:1, y:1}, gridSnap = 1, category = "Default", editNodes = false, editHeight = false, editWidth = false, editAnchors = false, imageName = null) {
        this._name = name;
        this._size = size;
        this._gridSnap = gridSnap;
        this._anchor = anchor;
        this._category = category;
        this._edit = {nodes:editNodes, height:editHeight, width:editWidth, anchors:editAnchors};
        this._image = new Image();
        this._tileSize = config.tileSize;
        this._GUIhover = false;
        this._glowLevel = 1;
        if (imageName == null) {
            this._image.src = "images/"+category.toLowerCase()+"/"+this._name+".png";
        } else {
            this._image.src = "images/"+category.toLowerCase()+"/"+imageName+".png";
        }
    }
  
    GUIUnhover() {
        this._GUIhover = false;
    }

    GUIHover() {
        this._GUIhover = true;
    }

    drawOnUI(ctx, size, x, y) {
        
        ctx.filter = "brightness("+this._glowLevel.toString()+")";
        ctx.drawImage(this._image, x-(config.GUIMargin/2)*(this._glowLevel-1), y-(config.GUIMargin/2)*(this._glowLevel-1), size+(config.GUIMargin)*(this._glowLevel-1), size+(config.GUIMargin)*(this._glowLevel-1));
        ctx.filter = "none";
        if (!this._GUIhover) {
            this._glowLevel -= 0.1;
        } else {
            this._glowLevel += 0.4;
        }
        this._glowLevel = Clamp(this._glowLevel, 1, 2);
    }

    drawOnGrid(ctx, offset, scale, x, y){
        if (this._gridSnap != 0) {
            x = Math.floor(x/(config.tileSize*this._gridSnap))*(config.tileSize*this._gridSnap);
            y = Math.floor(y/(config.tileSize*this._gridSnap))*(config.tileSize*this._gridSnap);
        }
        ctx.drawImage(this._image, x*scale-scale*this._size.x*config.tileSize*this._anchor.x+offset.x*scale, y*scale-scale*this._size.y*config.tileSize*this._anchor.y+offset.y*scale, this._size.x*config.tileSize*scale, this._size.y*config.tileSize*scale);
    }

    exportItem(){
        return this._name;
    }
}

export class Block extends Item {
    constructor(name = "Unamed", anchor = {x:0, y:0}, size = {x:1, y:1}, gridSnap = 1, category = "Blocks", blockLayer=0, editNodes = false, editHeight = false, editWidth = false, editAnchors = false, imageName = null) {
        super(name, anchor, size, gridSnap, category, editNodes, editHeight, editWidth, editAnchors, imageName);
        this._layer = blockLayer;
    } 
}

export class Entity extends Item {
    constructor(name = "Unamed", anchor = {x:0.5, y:0.5}, size = {x:1, y:1}, gridSnap = 0, category = "Objects", editNodes = false, editHeight = false, editWidth = false, editAnchors = false, imageName = null) {
        super(name, anchor, size, gridSnap, category, editNodes, editHeight, editWidth, editAnchors, imageName);
        this._layer = -1;
    } 
}


class Layer {
    constructor(name = "Unamed Layer"){
        this._name = name;
        this._tileSize = config.tileSize;
    }

    exportLayer() {
        return "";
    }

    draw(ctx, offset, scale) {
    }
}

export class BlockLayer extends Layer {
    constructor(name = "Unamed Layer", size = {x:1, y:1}){
        super(name);
        this._size = size;
        this._blocks = new Array(size.y);
        for (var i = 0; i < size.y; i++) {
            this._blocks[i] = new Array(size.x);
        }
        for (var i = 0; i < size.y; i++) {
            for (var k = 0; k < size.x; k++) {
                this._blocks[i][k] = "0";
            }
        }
    }

    draw(ctx, offset, scale) {
        for (var i = 0; i < this._size.y; i++) {
            for (var k = 0; k < this._size.x; k++) {
                if (this._blocks[i][k] != "0"){
                    var x = (k * this._tileSize);
                    var y = (i * this._tileSize);
                    this._blocks[i][k].drawOnGrid(ctx, offset, scale, x, y);
                }
            }
        }      
    }

    input(x,y,key){
        let newX = Math.floor(x/config.tileSize);
        let newY = Math.floor(y/config.tileSize);
        if (key._name == "0" || key._name=="00" || key._name == " " || key._name == "  "){
            this._blocks[newY][newX] = 0;
        } else {
            this._blocks[newY][newX] = key;
        }
    }

    resize(side, value){
        //calculate new geometry
        let newGeometry = {x:0, y:0, offset:{x:0, y:0}};
        if (side == 1){
            newGeometry.x = value;
            newGeometry.y = this._size.y;
        } else if (side == 2) {
            newGeometry.x = this._size.x;
            newGeometry.y = value;
            newGeometry.offset.y = (value - this._size.y);
        } else if (side == 3) {
            newGeometry.x = value;
            newGeometry.y = this._size.y;
            newGeometry.offset.x = (value - this._size.x);
        } else if (side == 4) {
            newGeometry.x = this._size.x;
            newGeometry.y = value;
        }
        //create new layer
        let tmpBlock = new Array(newGeometry.y);
        for (var i = 0; i < newGeometry.y; i++) {
            tmpBlock[i] = new Array(newGeometry.x);
        }
        for (var i = 0; i < newGeometry.y; i++) {
            for (var k = 0; k < newGeometry.x; k++) {
                tmpBlock[i][k] = "0";
            }
        }
        //copy layer
        let minX = Math.min(newGeometry.x, this._blocks[0].length);
        let minY = Math.min(newGeometry.y, this._blocks.length);
        for (var i = 0; i < minY; i++) {
            for (var k = 0; k < minX; k++) {
                if (newGeometry.offset.y + newGeometry.offset.x >= 0){
                    tmpBlock[i+newGeometry.offset.y][k+newGeometry.offset.x] = this._blocks[i][k];
                } else {
                    tmpBlock[i][k] = this._blocks[i-newGeometry.offset.y][k-newGeometry.offset.x];
                }
            }
        }        
        //apply layer
        this._size = {x:newGeometry.x, y:newGeometry.y};
        this._blocks = tmpBlock;
    }
}

export class EntityLayer extends Layer {
    constructor(name = "Unamed Layer"){
        super(name);
        this._entities = [];
    }    

    input(x,y,key){
        if (key._gridSnap != 0) {
            x = Math.floor(x/(config.tileSize*key._gridSnap))*(config.tileSize*key._gridSnap);
            y = Math.floor(y/(config.tileSize*key._gridSnap))*(config.tileSize*key._gridSnap);
        }
        this._entities.push({key:key, x:x, y:y});
    }

    draw(ctx, offset, scale) {
        for (var i = 0; i < this._entities.length; i++) {
            this._entities[i].key.drawOnGrid(ctx, offset, scale, this._entities[i].x, this._entities[i].y);
        }
    }

    resize(side, value){
        value = value * config.tileSize;
        if (side == 1) {
            for (var i = 0; i < this._entities.length; i++) {
                if (this._entities[i].x > value){
                    this._entities.splice(i, 1);
                }
            }            
        } else if (side == 2) {
            for (var i = 0; i < this._entities.length; i++) {
                this._entities.y += value;
            }
        }
    }
}

export class Map {
    constructor(size = {x:1, y:1}, blockLayersCount = 1){
        this._size = size;
        this._blockLayersCount = blockLayersCount;
        this._blockLayers = [];
        for (let i = 0; i < blockLayersCount; i++) {
            this._blockLayers.push(new BlockLayer("Block Layer "+(i+1).toString(), size));  
        }
        this._entitiesLayer = new EntityLayer("Entity Layer 1");
    }

    draw(ctx, offset, scale) {
        for (let i = 0; i < this._blockLayersCount; i++) {
            this._blockLayers[i].draw(ctx, offset, scale);
        }
        this._entitiesLayer.draw(ctx, offset, scale);
    }

    input(x,y,key){
        if (key._layer < 0){
            this._entitiesLayer.input(x, y, key)
        } else {
            this._blockLayers[key._layer].input(x, y, key)
        }
    }

    resize(side, x, y){
        if (side == 1){
            let tmpRs = Math.floor(x/config.tileSize);
            if (tmpRs > 0){
                this._size.x = tmpRs;
                for (let i = 0; i < this._blockLayersCount; i++) {
                    this._blockLayers[i].resize(side, this._size.x);
                }
                this._entitiesLayer.resize(side, x);
            }
        } else if (side == 2){
            let tmpRs = this._size.y - Math.floor(y/config.tileSize);
            if (tmpRs > 0){
                this._size.y = tmpRs;
                for (let i = 0; i < this._blockLayersCount; i++) {
                    this._blockLayers[i].resize(side, this._size.y);
                }
                this._entitiesLayer.resize(side, y);
            }
        } else if (side == 3){
            let tmpRs = this._size.x - Math.floor(x/config.tileSize);
            if (tmpRs > 0){
                this._size.x = tmpRs;
                for (let i = 0; i < this._blockLayersCount; i++) {
                    this._blockLayers[i].resize(side, this._size.x);
                }
                this._entitiesLayer.resize(side, x);
            }
        } else if (side == 4){
            let tmpRs = Math.floor(y/config.tileSize);
            if (tmpRs > 0){
                this._size.y = tmpRs;
                for (let i = 0; i < this._blockLayersCount; i++) {
                    this._blockLayers[i].resize(side, this._size.y);
                }
                this._entitiesLayer.resize(side, y);       
            }
        }
    }
}

export class History {
    constructor(size = {x:1, y:1}, blockLayersCount = 1){
        this._maps = [];
        this._maps.push(new Map(size, blockLayersCount));
        this._maps.push(new Map(size, blockLayersCount));
        this._maps[1]._blockLayers[0]._blocks[1][5] = instances["wall"];
        this._index = 0;
    }

    draw(ctx, offset, scale) {
        this.top().draw(ctx, offset, scale);
    }
    
    newMap(){
        //WRITE OVER HISTORY
        if (this._index + 1 != this._maps.length) {
            console.log(this._maps.length-(this._index + 1));
            let dist = this._maps.length-(this._index + 1);
            for (let i = 0; i < dist; i++){
                this._maps.pop();
            }
        }
    
        //CLONE
        var clone = new Map({x:this.top()._size.x, y:this.top()._size.y}, this.top()._blockLayersCount);
        //CLONE BLOCKS
        for (let i = 0; i < this.top()._blockLayersCount; i++){
            for (let y = 0; y < this.top()._size.y; y++){
                for (let x = 0; x < this.top()._size.x; x++){
                    clone._blockLayers[i]._blocks[y][x] = this.top()._blockLayers[i]._blocks[y][x];
                }
            }
        }
        //CLONE ENTITIES
        for (let i = 0; i < this.top()._entitiesLayer._entities.length; i++){
            clone._entitiesLayer._entities.push(this.top()._entitiesLayer._entities[i]);
        }
        //PUSH CLONE    
        this._maps.push(clone);

        //HISTORY LIMIT
        if (this._maps.length > config.historySize-1){
            this._maps.shift();
        } else {
            this._index += 1;
        }
    }

    top(){

        return this._maps[this._index];
    }

    ctrlz(){
        this._index -= 1;
        this._index = Clamp(this._index, 0, this._maps.length-1);
    }

    ctrly(){
        this._index += 1;
        this._index = Clamp(this._index, 0, this._maps.length-1);      
    }

    input(x,y,key){
        this.top().input(x,y,key);
    }
}