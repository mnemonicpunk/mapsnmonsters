let TTSheet = require('./ttplayer.js');

class TTUser  {
    constructor(server, ws) {
        var _Instance = this;

        this.server = server;
        this.sock = ws;
        this.connected = true;
        
        // mode -1 = spectator
        // mode 0 = DM
        // mode 1 = player
        this.mode = 0;
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
                break;
            case "load_map":
                this.getRoom().loadUserMap(msg.data);
                this.getRoom().addLog(this.player.name + " hat eine neue Karte geladen, das Spielbrett wird neu aufgebaut.");
                break;                              
            case "edit_piece_class":
                let c = this.getRoom().getPieceClassByName(msg.data.name);
                //p.name = msg.data.name;
                c.icon = msg.data.icon;
                this.getRoom().pieceClassesDirty();
                break;  
            case "claim_piece_class":
                this.getRoom().claimPieceClass(msg.data.name, this.player);
                this.getRoom().addLog(this.player.name + " spielt nun als " + msg.data.name);
                break;     
            case "create_piece":
                this.getRoom().createPieceAt(msg.data.x, msg.data.y, msg.data.class_name);
                break;                                            
            case "move_piece":
                this.getRoom().movePiece(msg.data.id, msg.data.x, msg.data.y);
                break;  
            case "remove_piece":
                this.getRoom().removePiece(msg.data.id);
                break; 
            case "roll_dice":
                this.getRoom().rollDice(this.player, msg.data.num, msg.data.sides);
                break;
            default:
                console.log("User sent unknown message type: " + msg.type);
                break;
        }
        this.server.updateDirty();
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
    sendMap(map) {
        this.sendMessage('map_data', map.getJSON());
    }
    sendPieceData(piece_data) {
        this.sendMessage('piece_data', piece_data);
    }
    sendPieceClasses(class_data) {
        this.sendMessage('piece_classes', class_data);
    }
    sendLog(log) {
        this.sendMessage('log_data', log);
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

        // TO-DO: Make neat!
        this.server.sendMapToUsers(this.getRoom().map);
        this.sendPieceClasses(this.getRoom().getPieceClassData());
        this.sendPieceData(this.getRoom().getPieceData());    
        this.sendLog(this.getRoom().getLog());
    }
}

module.exports = TTUser;