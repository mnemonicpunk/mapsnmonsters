const MAP_WIDTH = 8;
const MAP_HEIGHT = 8;

class TTMap {
    constructor() {
        this.is_dirty = false;
        this.tiles = [];
        for (let i=0; i<MAP_WIDTH*MAP_HEIGHT; i++) {
            this.tiles.push({
                type: -1,
                visible: false
            });
        }
    }
    getTile(x, y) {
        return this.tiles[x + MAP_WIDTH*y];
    }
    setTile(x, y, tile) {
        this.tiles[x + MAP_WIDTH*y] = tile;
    }
    getJSON() {
        return this.tiles;
    }
    dirty() {
        this.is_dirty = true;
    }
    loadMapFile(data) {
        for (let i=0; i<this.tiles.length; i++) {
            if (data[i]) {
                this.tiles[i] = {
                    type: data[i],
                    visible: false
                };
            }

            this.getTile(3,3).visible = true;
            this.getTile(4,3).visible = true;

            this.dirty();
        }
    }
}

module.exports = TTMap;