let TTSheet = require('./ttplayer.js');

class TTUser  {
    constructor(server, ws) {
        var _Instance = this;

        console.log("User connected.");
        this.server = server;
        this.sock = ws;
        
        // mode -1 = spectator
        // mode 0 = DM
        // mode 1 = player
        this.mode = -1;
        this.player = null;

        this.sock.on('message', function(msg) {
            _Instance.handleMessage(msg);
        });
    }
    sendMessage(type, data) {
        let json = JSON.stringify({
            type: type,
            data: data
        });
        this.sock.send(json);
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

        this.server.sendMapToUsers(this.getRoom().map);
    }
    getRoom() {
        return this.server.room;
    }
}

module.exports = TTUser;