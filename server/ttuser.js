let TTSheet = require('./ttplayer.js');

class TTUser  {
    constructor(server, ws) {
        var _Instance = this;

        console.log("User connected.");
        this.server = server;
        this.sock = ws;
        this.connected = true;
        
        // mode -1 = spectator
        // mode 0 = DM
        // mode 1 = player
        this.mode = -1;
        this.player = null;

        this.sock.on('message', function(msg) {
            _Instance.handleMessage(msg);
        });
        this.sock.on('error', function(msg) {
            _Instance.connected = false;
        });
        this.sock.on('close', function(msg) {
            _Instance.connected = false;
        });        
    }
    sendMessage(type, data) {
        try {
            let json = JSON.stringify({
                type: type,
                data: data
            });
            this.sock.send(json);    
        } catch(e) {
            this.connected = false;
        }
    }
    handleMessage(json) {
        let msg = JSON.parse(json);
        switch (msg.type) {
            case "change_mode": 
                this.setMode(msg.data);
                break;
            case "auth":
                this.auth(msg.data);
                break;
            case "reveal":
                this.getRoom().reveal(msg.data.x, msg.data.y, msg.data.state);
                this.server.updateDirty();
                break;
            case "place_piece":
                this.getRoom().placePiece(msg.data.x, msg.data.y, msg.data.num);
                this.server.updateDirty();
                break;
            case "remove_piece":
                this.getRoom().removePiece(msg.data.num);
                this.server.updateDirty();
                break;
            case "load_map":
                this.getRoom().loadUserMap(msg.data);
                this.server.updateDirty();
                break;                              
            case "edit_piece":
                let p = this.getRoom().pieces[msg.data.num];
                //p.name = msg.data.name;
                p.type = msg.data.type;
                p.icon = msg.data.icon;
                this.getRoom().piecesMetaDirty();
                this.server.updateDirty();
                break;  
            case "claim_piece":
                this.getRoom().claimPiece(msg.data.num, this.player);
                this.server.updateDirty();
                break;                                
            default:
                console.log("User sent unknown message type: " + msg.type);
                break;
        }
    }
    setMode(mode) {
        switch (mode) {
            case 0:
                this.mode = 0;
                break;
            case 1:
                this.mode = 1;
                break;
            default:
                console.log("Invalid mode: " + mode);
                break;
        }
        console.log("User " + this.getName() + " set their mode to " + mode);
    }
    getName() {
        return "Anonymous";
    }
    getRoom() {
        return this.server.room;
    }    
    auth(data) {
        let player = this.server.getPlayerByID(data.token);
        if (player == null) {
            player = this.server.createPlayer();
            player.name = data.name;
        }
        this.player = player;
        this.sendMessage('auth_success', {
            name: player.name,
            id: player.id
        });

        this.mode = 0;

        let m = this.getRoom().getPiecesMeta();

        // TO-DO: Make neat!
        this.server.sendMapToUsers(this.getRoom().map);
        this.sendMessage('piece_meta', this.getRoom().getPiecesMeta());
        this.server.sendPieceDataToUsers(this.getRoom().pieces);
    }
}

module.exports = TTUser;