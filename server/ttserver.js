let TTUser = require('./ttuser.js');
let TTRoom = require('./ttroom.js');
let TTPlayer = require('./ttplayer.js');

class TTServer {
    constructor() {
        this.users = [];
        this.room = new TTRoom(this);
        this.players = [];
    }
    connectUser(ws) {
        let u = new TTUser(this, ws);
        this.users.push(u);
    }
    makeID(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    getPlayerByID(id) {
        for (let i=0; i<this.players.length; i++) {
            if (this.players[i].id == id) {
                return this.players[i];
            }
        }
        return null;
    }
    createPlayer() {
        let id = "";
        let available = false;
        while((id == "") || (available == false)) {
            available = true;
            id = this.makeID(8);
            for (let i=0; i<this.players.length; i++) {
                if (this.players[i].id == id) {
                    available = false;
                }
            }
        }

        // id is definitely available at this point
        let p = new TTPlayer("", id);
        this.players.push(p);
        return p;
    }
    sendMessageToUsers(type, data) {
        for (let i=0; i<this.users.length; i++) {
            this.users[i].sendMessage(type, data);
        }
    }
    sendMapToUsers(map) {
        let json = map.getJSON();
        this.sendMessageToUsers('map_data', json);
    }
    sendPieceDataToUsers(pieces) {
        let json = [];
        for (let i=0; i<pieces.length; i++) {
            json.push({
                x: pieces[i].x,
                y: pieces[i].y,
                on_board: pieces[i].on_board
            });
        }
        this.sendMessageToUsers('piece_data', json);
    }
    sendPieceMetaToUsers() {
        this.sendMessageToUsers('piece_meta', this.room.getPiecesMeta());
    }
    pruneUsers() {
        let is_clean = false;
        while(!is_clean) {
            is_clean = true;
            for (let i=0; i<this.users.length; i++) {
                if (this.users[i].connected == false) {
                    this.users.splice(i);
                    is_clean = false;
                    break;
                }
            }
        }
    }
    updateDirty() {
        this.pruneUsers();
        if (this.room.map.is_dirty) {
            this.sendMapToUsers(this.room.map);
            this.room.map.is_dirty = false;
        }
        if (this.room.pieces_dirty) {
            this.sendPieceDataToUsers(this.room.pieces);
            this.room.pieces_dirty = false;
        }    
        if (this.room.pieces_meta_dirty) {
            this.sendPieceMetaToUsers(this.room.pieces);
            this.room.pieces_meta_dirty = false;
        }    
    }
}

module.exports = TTServer;