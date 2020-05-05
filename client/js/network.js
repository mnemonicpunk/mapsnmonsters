//const SERVER_URL = "ws:localhost:8000/data";
const SERVER_URL = "wss://mapsandmonsters.herokuapp.com/data";

class Network {
    constructor(tabletop) {
        var _Instance = this;

        this.tabletop = tabletop;
        this.connected = false;

        this.sock = new WebSocket(SERVER_URL);
        this.sock.addEventListener('open', function() {
            console.log("Connected!");
            _Instance.connected = true;
            _Instance.beginAuth();
        });
        this.sock.addEventListener('message', function(msg) {
            _Instance.handleMessage(msg.data);
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
            case "auth_success": 
                this.tabletop.setCredentials(msg.data);
                break;
            case "map_data":
                this.tabletop.board.setMapState(msg.data);
                break;
            case "piece_data":
                this.tabletop.board.setPieceState(msg.data);
                break;   
            case "piece_meta":
                console.log("meta update!");
                this.tabletop.board.setPieceMeta(msg.data);
                this.tabletop.gameUI.populatePieceMenus(msg.data);
                break;                  
            default:
                console.log("Unknown message type " + msg.type);
                break;
        }
    }
    beginAuth() {
        let pname = localStorage.player_name || "Anon";
        let ptoken = localStorage.player_token || "";

        this.sendMessage('auth', {
            name: pname,
            token: ptoken
        });
    }
    sendReveal(x, y, state) {
        this.sendMessage('reveal', {
            x: x,
            y: y,
            state: state
        });
    }
    sendPlacePiece(x, y, num) {
        this.sendMessage('place_piece', {
            x: x,
            y: y,
            num: num
        });
    }    
    sendRemovePiece(num) {
        this.sendMessage('remove_piece', {
            num: num
        });
    }
    sendMap(map_data) {
        this.sendMessage('load_map', map_data);
    }
    sendPieceEdit(piece) {
        let num = this.tabletop.board.getPieceNumber(piece)
        this.sendMessage('edit_piece', {
            num: num,
            type: piece.type,
            icon: piece.icon,
            name: piece.name
        });
    }
    sendPieceClaim(piece) {
        let num = this.tabletop.board.getPieceNumber(piece);
        this.sendMessage('claim_piece', {
            num: num
        });
    }
}