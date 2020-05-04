var TTMap = require('./ttmap.js');
var TTPiece = require('./ttpiece.js');

const SAMPLE_PIECES = [
    {
        name: "Nibbi",
        icon: "Icon_01",
        type: "hero"
    },
    {
        name: "Fussel",
        icon: "Icon_02",
        type: "hero"
    },
    {
        name: "Robin",
        icon: "Icon_03",
        type: "hero"
    },
    {
        name: "Rolf",
        icon: "Icon_04",
        type: "hero"
    },
    {
        name: "Johnny",
        icon: "Icon_05",
        type: "hero"
    },
    {
        name: "Spieler6",
        icon: "Icon_06",
        type: "hero"
    },           
    {
        name: "Gegner1",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner2",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner3",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner4",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner5",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner6",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner7",
        icon: "Icon_09",
        type: "enemy"
    },
    {
        name: "Gegner8",
        icon: "Icon_09",
        type: "enemy"
    }    
];

class TTRoom {
    constructor() {
        this.map = new TTMap();
        this.pieces = [];
        this.pieces_dirty = false;

        this.map.loadMapFile([0,0,0,13,13,0,0,0,0,0,13,12,12,13,0,0,0,14,12,12,12,12,16,0,22,12,12,1,1,16,0,0,0,15,2,0,0,0,0,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        for (let i=0; i<SAMPLE_PIECES.length; i++) {
            let p = new TTPiece(SAMPLE_PIECES[i].name, SAMPLE_PIECES[i].icon, SAMPLE_PIECES[i].type);
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
            json.push({
                name: pieces[i].name,
                icon: pieces[i].icon,
                type: pieces[i].type,
            });
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
}

module.exports = TTRoom;