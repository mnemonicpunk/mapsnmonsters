let TTUser = require('./ttuser.js');
let TTRoom = require('./ttroom.js');
let TTPlayer = require('./ttplayer.js');

class TTServer {
    constructor() {
        this.users = [];
        this.room = new TTRoom(this);
        this.players = [];

        let _Instance = this;
        let _tick = function() {
            _Instance.tick();
            setTimeout(_tick, 1000);
        }
    }
    tick() {
        this.pruneUsers();
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
        for (let i=0; i<this.users.length; i++) {
            this.users[i].sendMap(map);
        }
    }
    sendPieceDataToUsers(piece_data) {
        for (let i=0; i<this.users.length; i++) {
            this.users[i].sendPieceData(piece_data);
        }
    }
    sendPieceClassesToUsers(piece_classes) {
        for (let i=0; i<this.users.length; i++) {
            this.users[i].sendPieceClasses(piece_classes);
        }
    }   
    sendLogToUsers(log) {
        for (let i=0; i<this.users.length; i++) {
            this.users[i].sendLog(log);
        }
    }      
    pruneUsers() {
        let is_clean = false;
        while(!is_clean) {
            is_clean = true;
            for (let i=0; i<this.users.length; i++) {
                if (this.users[i].connected == false) {
                    this.users.splice(i, 1);
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
            this.sendPieceDataToUsers(this.room.getPieceData());
            this.room.pieces_dirty = false;
        }    
        if (this.room.piece_classes_dirty) {
            this.sendPieceClassesToUsers(this.room.getPieceClassData());
            this.room.piece_classes_dirty = false;
        }
        if (this.room.log_dirty) {
            this.sendLogToUsers(this.room.getLog());
            this.room.log_dirty = false;
        }
    }
}

module.exports = TTServer;