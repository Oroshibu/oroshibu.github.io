class Item {
    constructor(name = "Unamed", anchor = {x:0.5, y:0.5}, size = {x:16, y:16}, gridSnap = 1, category = "Default", editNodes = false, editHeight = false, editWidth = false, editAnchors = false, imageName = null) {
        this._name = name;
        this._size = size;
        this._gridSnap = gridSnap;
        this._anchor = anchor;
        this._category = category;
        this._edit = {nodes:editNodes, height:editHeight, width:editWidth, anchors:editAnchors};
        this._image = new Image();
        if (imageName == null) {
            this._image.src = "images/"+this._name+".png";
        } else {
            this._image.src = "images/"+imageName+".png";
        }
    }
    
    drawOnUI(ctx, size, x, y) {
        ctx.drawImage(this._image, x, y, size, size);
    }

    drawOnGrid(ctx, scale, x, y){
        ctx.drawImage(this._image, x-scale*this._size.x*this._anchor.x, y-scale*this._size.y*this._anchor.y, this._size.x*scale, this._size.y*scale);
    }

    exportItem(){
        return this._name;
    }
}

export class Block extends Item {
    constructor(name = "Unamed", anchor = {x:0, y:0}, size = {x:16, y:16}, gridSnap = 1, category = "Block", editNodes = false, editHeight = false, editWidth = false, editAnchors = false, imageName = null) {
        super(name, anchor, size, gridSnap, category, editNodes, editHeight, editWidth, editAnchors, imageName);
    } 
}

export class Entity extends Item {
    constructor(name = "Unamed", anchor = {x:0.5, y:0.5}, size = {x:16, y:16}, gridSnap = 0, category = "Objects", editNodes = false, editHeight = false, editWidth = false, editAnchors = false, imageName = null) {
        super(name, anchor, size, gridSnap, category, editNodes, editHeight, editWidth, editAnchors, imageName);
    } 
}


class Layer {
    constructor(name = "Unamed Layer", tileSize = 16){
        this._name = name;
        this._tileSize = tileSize;
    }

    exportLayer() {
        return "";
    }

    draw(ctx, offset, scale) {
    }
}

export class BlockLayer extends Layer {
    constructor(name = "Unamed Layer", size = {x:1, y:1}, tileSize = 16){
        super(name, tileSize);
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
    constructor(name = "Unamed Layer", tileSize = 16){
        super(name);
        this._entities = [];
    }    


}

export class Map {
    constructor(size = {x:1, y:1}, blockLayersCount = 1, tileSize = 16){
        this._blockLayersCount = blockLayersCount;
        this._blockLayers = [];
        for (let i = 0; i < blockLayersCount; i++) {
            this._blockLayers.push(new BlockLayer("Block Layer "+(i+1).toString(), size), tileSize);  
        }
        this._entitiesLayer = new EntityLayer("Entity Layer 1", tileSize);
    }

    draw(ctx, offset, scale) {
        for (let i = 0; i < this._blockLayersCount; i++) {
            this._blockLayers[i].draw(ctx, offset, scale);
        }
        this._entitiesLayer.draw(ctx, offset, scale);
    }
}