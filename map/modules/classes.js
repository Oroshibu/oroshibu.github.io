import { default as config } from "./config.js";
import { default as instances } from "./instances.js";

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
        for (let i in instances){
            if (this._categories[instances[i]._category] == null) {
                this._categories[instances[i]._category] = [];
                this._categoriesNames.push(instances[i]._category);
            }
            this._categories[instances[i]._category].push(instances[i]);
        }
    }

    hover(x, y) {
        let relativex = Math.floor((x - (config.GUIWidth-this._size.x)/2 - this._adaptX - config.GUIMargin)/(config.GUITileSize+config.GUIMargin));
        let relativey = Math.floor((y - this._GUIY - config.GUIMargin - this._scroll)/(config.GUITileSize+config.GUIMargin));
        if (relativex >= 0 && relativey >= 0 && relativex < this._perX){
            let i = relativex + relativey*this._perX;
            if (this._categories[this._categoriesNames[this._selectedCategory]][i] != null){
                this._categories[this._categoriesNames[this._selectedCategory]][i].GUIHover();
            }
        }
    }

    drawGUI(ctx){
		ctx.fillStyle = config.masterBgColor;
		ctx.roundRect((config.GUIWidth-this._size.x)/2, this._GUIY, this._size.x, this._size.y, config.GUIMargin);
		ctx.fill();
        for (let i in this._categories[this._categoriesNames[this._selectedCategory]]){
            let obj = this._categories[this._categoriesNames[this._selectedCategory]][i];
            let objx = (i%this._perX)*(config.GUITileSize+config.GUIMargin);
            let objy = Math.floor(i/this._perX)*(config.GUITileSize+config.GUIMargin);
            obj.drawOnUI(ctx, config.GUITileSize, objx+(config.GUIWidth-this._size.x)/2+config.GUIMargin+this._adaptX, objy+this._GUIY+config.GUIMargin + this._scroll);
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
        this._GlowLevel = 2;
        if (imageName == null) {
            this._image.src = "images/"+this._name+".png";
        } else {
            this._image.src = "images/"+imageName+".png";
        }
    }
    
    GUIHover() {
        this._GUIhover = true;
        //this._GlowLevel = 2;
    }

    drawOnUI(ctx, size, x, y) {
        if (this._GUIhover) {
            ctx.filter = "brightness("+this._GlowLevel.toString()+")";
            ctx.drawImage(this._image, x, y, size, size);
            ctx.filter = "none";
        } else {
            ctx.drawImage(this._image, x, y, size, size);
        }
        this._GUIhover = false;
        /*
        ctx.filter = "brightness("+this._GlowLevel.toString()+")";
        ctx.drawImage(this._image, x, y, size, size);
        ctx.filter = "none";
        this._GlowLevel -= 0.1;
        if (this._GlowLevel < 1) {this._GlowLevel = 1};
        this._GUIhover = false;*/
    }

    drawOnGrid(ctx, scale, x, y){
        ctx.drawImage(this._image, x-scale*this._size.x*config.tileSize*this._anchor.x, y-scale*this._size.y*config.tileSize*this._anchor.y, this._size.x*config.tileSize*scale, this._size.y*config.tileSize*scale);
    }

    exportItem(){
        return this._name;
    }
}

export class Block extends Item {
    constructor(name = "Unamed", anchor = {x:0, y:0}, size = {x:1, y:1}, gridSnap = 1, category = "Blocks", blockLayer=0, editNodes = false, editHeight = false, editWidth = false, editAnchors = false, imageName = null) {
        super(name, anchor, size, gridSnap, category, editNodes, editHeight, editWidth, editAnchors, imageName);
        this._blockLayer = blockLayer;
    } 
}

export class Entity extends Item {
    constructor(name = "Unamed", anchor = {x:0.5, y:0.5}, size = {x:1, y:1}, gridSnap = 0, category = "Objects", editNodes = false, editHeight = false, editWidth = false, editAnchors = false, imageName = null) {
        super(name, anchor, size, gridSnap, category, editNodes, editHeight, editWidth, editAnchors, imageName);
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
                    var x = (offset.x + k * this._tileSize) * scale;
                    var y = (offset.y + i * this._tileSize) * scale;
                    this._blocks[i][k].drawOnGrid(ctx, scale, x, y);
                }
            }
        }        
    }
}

export class EntityLayer extends Layer {
    constructor(name = "Unamed Layer"){
        super(name);
        this._entities = [];
    }    


}

export class Map {
    constructor(size = {x:1, y:1}, blockLayersCount = 1){
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
}