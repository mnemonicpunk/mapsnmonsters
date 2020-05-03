class TableTop {
    constructor() {
        let _Instance = this;

        // gamemodes
        // -1 = spectator
        // 0 = DM
        // 1 = player
        this.gamemode = -1;

        // data used to auth with the server
        this.player_name = "";
        this.player_token = "";

        this.network = new Network(this);
        this.canvas = document.getElementById('game_canvas');
        this.ctx = this.canvas.getContext('2d');
        this.board = new GameBoard(this);
        this.sideboard = new SideBoard();
        this.cam = {
            x: (MAP_WIDTH*SUBTILE_WIDTH*4)/2,
            y: (MAP_HEIGHT*SUBTILE_HEIGHT*4)/2
        }
        this.mouse = {
            x: 0,
            y: 0
        }

        let _draw = function() {
            _Instance.draw();
            window.requestAnimationFrame(_draw);
        }
        _draw();

        this.resize();
        window.addEventListener('resize', function() {
            _Instance.resize();
        });

        window.addEventListener('keypress', function(e) {
            _Instance.handleKey(e.keyCode);
        });

        window.addEventListener('mousemove', function(e) {
            _Instance.mouseMove(e.clientX, e.clientY);
        });
        window.addEventListener('mousedown', function(e) {
            _Instance.mouseClick(e.clientX, e.clientY, e.button);
            
        });
        window.addEventListener('mousewheel', function(e) {
            _Instance.mouseWheel(e.deltaY);
        });
        window.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        this.board.setupMap(EMPTY_MAP);
        for (let i=0; i<SAMPLE_PIECES.length; i++) {
            this.board.addPiece(new GamePiece(SAMPLE_PIECES[i].name, SAMPLE_PIECES[i].icon));
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        //let c = this.screenToBoardCoords(0, 0);
        this.board.draw(this.ctx, -this.cam.x + this.width/2, -this.cam.y + this.height/2);
        this.sideboard.draw(this.ctx, this.width - 220, 20);
    }
    resize() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    handleKey(code) {
        let keycodes_wasd = {
            left: 97,
            right: 100,
            up: 119,
            down: 115
        };
        let scrollspeed = 12;

        if (code  == keycodes_wasd.up) {
            this.scrollView(0, -scrollspeed);
        }
        if (code  == keycodes_wasd.down) {
            this.scrollView(0, +scrollspeed);
        }
        if (code  == keycodes_wasd.left) {
            this.scrollView(-scrollspeed, 0);
        }
        if (code  == keycodes_wasd.right) {
            this.scrollView(scrollspeed, 0);
        }        
    }
    mouseMove(x, y) {
        this.mouse.x = x;
        this.mouse.y = y;

        this.board.mouseMove(x + this.cam.x - this.width/2, y + this.cam.y - this.height/2);
    }
    mouseClick(x, y, button) {
        this.board.mouseClick(button, x + this.cam.x - this.width/2, y + this.cam.y - this.height/2);
    }
    mouseWheel(amount) {
        if (amount < 0) {
            this.sideboard.scroll(-1);
        }
        if (amount > 0) {
            this.sideboard.scroll(1);
        }
        if (this.sideboard.selected_slot == 0) {
            this.board.user_mode = 0;
        } else {
            this.board.user_mode = 1;
            this.board.selected_piece = this.sideboard.selected_slot - 1;
        }
    }
    scrollView(x, y) {
        this.cam.x += x;
        this.cam.y += y;
    }
    setCredentials(cred) {
        localStorage.player_name = cred.name;
        localStorage.player_token = cred.id;

        this.player_name = cred.name;
        this.player_token = cred.id;

        console.dir(cred);
    }
    sendReveal(x, y, state) {
        this.network.sendReveal(x, y, state);
    }
    sendPlacePiece(x, y, num) {
        this.network.sendPlacePiece(x, y, num);
    }
    sendRemovePiece(num) {
        this.network.sendRemovePiece(num);
    }    
}