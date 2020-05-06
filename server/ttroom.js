var TTMap = require('./ttmap.js');
var TTPiece = require('./ttpiece.js');
var TTPieceClass = require('./ttpiece_class.js');

const FIELD_COMPONENTS_NUM = 24;

const GAME_PIECES = require('./data/GAME_PIECES.js');
const GAME_MAP = require('./data/GAME_MAP.js');

class TTRoom {
    constructor(server) {
        this.map = new TTMap();
        this.pieces = [];
        this.pieces_dirty = false;
        this.piece_classes_dirty = false;
        this.server = server;
        this.piece_classes = [];
        for (let i=0; i<GAME_PIECES.length; i++) {
            let c = new TTPieceClass(GAME_PIECES[i]);
            this.piece_classes.push(c);
        }

        this.map.loadMapFile(GAME_MAP);
        /*for (let i=0; i<this.piece_classes.length; i++) {
            this.createPiece(this.piece_classes[i].name);
        }*/
    }
    reveal(x, y, state) {
        let t = this.map.getTile(x, y);
        if (state != t.visible) {
            this.map.dirty();
        }
        t.visible = state;
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
    updatePieceNames() {
        for (let i=0; i<this.pieces.length; i++) {
            let p = this.pieces[i];
            let c = this.getPieceClassByName(p.class_name);
            p.name = c.alias;
            let inum = this.getPieceInstanceNumber(p);
            if (inum > 0) {
                p.name += " " + (inum+1);
            }
        }
    }
    getPieceInstanceNumber(piece) {
        let count = 0;
        for (let i=0; i<this.pieces.length; i++) {
            if (this.pieces[i].class_name == piece.class_name) {
                if (this.pieces[i] == piece) {
                    return count;
                }
                count++;
            }
        }
    }
    piecesDirty() {
        this.pieces_dirty = true;
        this.updatePieceNames();
    }  
    pieceClassesDirty() {
        this.piece_classes_dirty = true;
    }     
    clearBoard() {
        this.pieces = [];
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
    unclaimPieceClasses(player) {
        for (let i=0; i < this.piece_classes.length; i++) {
            this.piece_classes[i].unclaim(player);
        }
        this.piecesDirty();
        this.pieceClassesDirty();
    }
    claimPieceClass(name, player) {
        this.unclaimPieceClasses(player);
        let c = this.getPieceClassByName(name);
        c.claim(player);
        this.piecesDirty();
        this.pieceClassesDirty();
    }
    getPieceByID(id) {
        for (let i=0; i<this.pieces.length; i++) {
            if (this.pieces[i].id == id) {
                return this.pieces[i];
            }
        }
        return null;
    }
    getPieceClassByName(name) {
        for (let i=0; i<this.piece_classes.length; i++) {
            if (this.piece_classes[i].name == name) {
                return this.piece_classes[i];
            }
        }
        return null;
    }
    getPieceClassData() {
        let data = [];
        for (let i=0; i<this.piece_classes.length; i++) {
            data.push(this.piece_classes[i].getData());
        }
        return data;
    }
    createPiece(class_name) {
        let class_data = this.getPieceClassByName(class_name);
        let p = new TTPiece(class_data.name, class_name);

        let valid = false;
        while(!valid) {
            valid = true;
            let id = this.server.makeID(8);
            if (this.getPieceByID(id) != null) {
                valid = false;
            } else {
                p.id = id;
            }
        }
        this.pieces.push(p);
        return p;
    }
    createPieceAt(x, y, class_name) {
        let c = this.getPieceClassByName(class_name);

        // hero type pieces can only exist once
        if (c.type == "hero") {
            let idx = -1;
            for (let i=0; i<this.pieces.length; i++) {
                if (this.pieces[i].class_name == class_name) {
                    // it already exists, move it instead of creating a new one
                    this.movePiece(this.pieces[i].id, x, y);
                    return;
                }
            }
        }

        let p = this.createPiece(class_name);
        p.x = x;
        p.y = y;
        this.piecesDirty();
    }
    movePiece(id, x, y) {
        let p = this.getPieceByID(id);
        if (p == null) {
            return;
        }
        p.x = x;
        p.y = y;
        this.piecesDirty();
    }
    removePiece(id) {
        let p = this.getPieceByID(id);
        let idx = -1;
        for (let i=0; i<this.pieces.length; i++) {
            if (p == this.pieces[i]) {
                idx = i;
            }
        }
        this.pieces.splice(idx, 1);
        this.piecesDirty();
    }
}

module.exports = TTRoom;