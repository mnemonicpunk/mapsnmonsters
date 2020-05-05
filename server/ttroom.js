var TTMap = require('./ttmap.js');
var TTPiece = require('./ttpiece.js');

const FIELD_COMPONENTS_NUM = 24;

const GAME_PIECES = require('./data/GAME_PIECES.js');
const GAME_MAP = require('./data/GAME_MAP.js');

class TTRoom {
    constructor(server) {
        this.map = new TTMap();
        this.pieces = [];
        this.pieces_dirty = false;
        this.pieces_meta_dirty = false;
        this.server = server;

        this.map.loadMapFile(GAME_MAP);
        for (let i=0; i<GAME_PIECES.length; i++) {
            let p = new TTPiece(GAME_PIECES[i].name, GAME_PIECES[i].icon, GAME_PIECES[i].type);
            this.pieces.push(p);
        }
    }
    reveal(x, y, state) {
        let t = this.map.getTile(x, y);
        if (state != t.visible) {
            this.map.dirty();
        }
        t.visible = state;
    }
    getPiecesMeta() {
        let pieces = this.pieces;

        let json = [];
        for (let i=0; i<pieces.length; i++) {
            json.push(this.pieces[i].getMeta());
        }

        return json;
    }
    placePiece(x, y, num) {
        this.pieces[num].place(x, y);
        this.piecesDirty();
    }
    removePiece(num) {
        console.log("Removing piece " + num);
        this.pieces[num].remove();
        this.piecesDirty();
    }
    piecesDirty() {
        this.pieces_dirty = true;
    }
    piecesMetaDirty() {
        this.pieces_meta_dirty = true;
    }    
    clearBoard() {
        for (let i=0; i<this.pieces.length; i++) {
            this.pieces[i].on_board = false;
        }
        this.piecesDirty();
    }
    loadUserMap(data) {
        let map_data = data.split(',');

        // since this can easily crash the server we sanitize the shit out of it
        let rejected = false;
        for (let i=0; i < map_data.length; i++) {
            if (map_data[i] < 0) { rejected = true; }
            if (map_data[i] > FIELD_COMPONENTS_NUM+1) { rejected = true; }
        }

        if (rejected) { 
            console.log("Malformed map rejected.");
            return; 
        }

        this.map.loadMapFile(map_data);
        this.clearBoard();
        this.server.updateDirty();
    }
    unclaimPieces(player) {
        for (let i=0; i < this.pieces.length; i++) {
            this.pieces[i].unclaim(player);
        }
        this.piecesMetaDirty();
    }
    claimPiece(num, player) {
        this.unclaimPieces(player);
        this.pieces[num].claim(player);
        this.piecesMetaDirty();
    }    
}

module.exports = TTRoom;