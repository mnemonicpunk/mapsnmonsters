class TableTop {
    constructor() {
        let _Instance = this;

        this.ui_mode = 0;

        // data used to auth with the server
        this.player_name = this.getPlayerName();
        this.player_token = "";

        this.network = new Network(this);
        this.canvas = document.getElementById('game_canvas');
        this.ctx = this.canvas.getContext('2d');
        this.board = new GameBoard(this);
        this.cam = {
            x: (MAP_WIDTH*SUBTILE_WIDTH*4)/2,
            y: (MAP_HEIGHT*SUBTILE_HEIGHT*4)/2
        }
        this.cam_tween = {
            x: (MAP_WIDTH*SUBTILE_WIDTH*4)/2,
            y: (MAP_HEIGHT*SUBTILE_HEIGHT*4)/2
        }
        this.mouse = {
            x: 0,
            y: 0
        }

        this.toolbar = new wToolbar(10, 10, this.width-20, 40);
        this.toolbar.addItem("Zeiger", function() {
            _Instance.setUIMode(0);
        });
        this.toolbar.addItem("Karte", function() {
            _Instance.setUIMode(1);
        });
        this.toolbar.addItem("Helden", function() {
            _Instance.setUIMode(2);
        });
        this.toolbar.addItem("Gegner", function() {
            _Instance.setUIMode(3);
        });
        this.toolbar.addItem("Tokens", function() {
            _Instance.setUIMode(4);
        });
        this.toolbar.select(0);

        this.panel_hero = new wTokenPanel(this.width - 420, 40, 400, 400);
        this.panel_hero.active = false;
        this.panel_hero.select_callback = function(num) {
            _Instance.board.selectPieceByType("hero", num);
            _Instance.panel_enemy.select(-1);
            _Instance.panel_token.select(-1);
        }
        this.panel_hero.context_callback = function(num) {
            _Instance.edit_piece_window.beginEdit(_Instance.board.getPieceByType("hero", num));
        }

        this.panel_enemy = new wTokenPanel(this.width - 420, 40, 400, 400);
        this.panel_enemy.active = false;
        this.panel_enemy.select_callback = function(num) {
            _Instance.board.selectPieceByType("enemy", num);
            _Instance.panel_hero.select(-1);
            _Instance.panel_token.select(-1);
        }
        this.panel_enemy.context_callback = function(num) {
            _Instance.edit_piece_window.beginEdit(_Instance.board.getPieceByType("enemy", num));
        }

        this.panel_token = new wTokenPanel(this.width - 420, 40, 400, 400);
        this.panel_token.active = false;
        this.panel_token.select_callback = function(num) {
            _Instance.board.selectPieceByType("token", num);
            _Instance.panel_hero.select(-1);
            _Instance.panel_enemy.select(-1);
        }

        this.edit_piece_window = new wEditPiece(0, 0, 400, 400);
        this.edit_piece_window.active = false;

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

        this.canvas.addEventListener('dragover', function(e) {
            e.preventDefault();
            
        });
        this.canvas.addEventListener('drop', function(ev) {
            ev.preventDefault();
            
            // Use DataTransfer interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.files.length; i++) {
                _Instance.readMapFromFile(ev.dataTransfer.files[i]);
            }       
        });

        this.board.setupMap(EMPTY_MAP);

        
    }
    draw() {
        // tween the camera to the target position
        let dx = this.cam_tween.x - this.cam.x;
        let dy = this.cam_tween.y - this.cam.y;

        this.cam.x += dx *0.2;
        this.cam.y += dy *0.2;


        this.ctx.clearRect(0, 0, this.width, this.height);
        //let c = this.screenToBoardCoords(0, 0);
        this.board.draw(this.ctx, -this.cam.x + this.width/2, -this.cam.y + this.height/2);

        this.toolbar._draw(this.ctx, 0, 0);
        this.panel_hero._draw(this.ctx, 0, 0);
        this.panel_enemy._draw(this.ctx, 0, 0);
        this.panel_token._draw(this.ctx, 0, 0);

        this.edit_piece_window._draw(this.ctx, 0, 0);
    }
    setUIMode(num) {
        this.ui_mode = num;
        this.toolbar.select(num);
        this.panel_hero.active = false;
        this.panel_enemy.active = false;
        this.panel_token.active = false;

        if (this.ui_mode == 0) {
            this.board.user_mode = 0;
        }
        if (this.ui_mode == 1) {
            this.board.user_mode = 1;
        }
        if (this.ui_mode == 2) {
            this.panel_hero.active = true;
            this.board.user_mode = 2;
        }
        if (this.ui_mode == 3) {
            this.panel_enemy.active = true;
            this.board.user_mode = 2;
        }        
        if (this.ui_mode == 4) {
            this.panel_token.active = true;
            this.board.user_mode = 2;
        }        
    }
    resize() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.toolbar.resize(this.width - 420, 20, 400, 40);
        this.panel_hero.resize(this.width - 420, 65, 400, this.panel_hero.children.length*68);
        this.panel_enemy.resize(this.width - 420, 65, 400, this.panel_enemy.children.length*68);
        this.panel_token.resize(this.width - 420, 65, 400, this.panel_token.children.length*68);

        this.edit_piece_window.resize((this.width/2) - 200, (this.height/2)-200, 400, 400);
    }
    handleKey(code) {
        let keycodes_wasd = {
            left: 97,
            right: 100,
            up: 119,
            down: 115
        };
        let scrollspeed = 32;

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

        let evt_consumed = false;
        evt_consumed |= this.edit_piece_window._mouseMove(x, y);
        evt_consumed |= this.toolbar._mouseMove(x, y);
        evt_consumed |= this.panel_hero._mouseMove(x, y);
        evt_consumed |= this.panel_enemy._mouseMove(x, y);
        evt_consumed |= this.panel_token._mouseMove(x, y);

        if (!evt_consumed) {
            this.board.mouseMove(x + this.cam.x - this.width/2, y + this.cam.y - this.height/2);
        }
        
    }
    mouseClick(x, y, button) {
        let evt_consumed = false;
        evt_consumed |= this.edit_piece_window._onClick(x, y, button);
        evt_consumed |= this.toolbar._onClick(x, y, button);
        evt_consumed |= this.panel_hero._onClick(x, y, button);
        evt_consumed |= this.panel_enemy._onClick(x, y, button);
        evt_consumed |= this.panel_token._onClick(x, y, button);

        if (!evt_consumed) {
            this.board.mouseClick(button, x + this.cam.x - this.width/2, y + this.cam.y - this.height/2);
        }
    }
    mouseWheel(amount) {
        if (amount < 0) {
            
        }
        if (amount > 0) {
            
        }
    }
    scrollView(x, y) {
        this.cam_tween.x += x;
        this.cam_tween.y += y;
    }
    setCredentials(cred) {
        localStorage.player_name = cred.name;
        localStorage.player_token = cred.id;

        this.player_name = cred.name;
        this.player_token = cred.id;
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
    populateTokenMenus(piece_data) {
        this.panel_hero.clearTokens();
        this.panel_enemy.clearTokens();
        this.panel_token.clearTokens();

        for (let i=0; i<piece_data.length; i++) {
            let p = piece_data[i];
            if (p.type == "hero") {
                this.panel_hero.addToken(p.name, p.icon);
            }
            if (p.type == "enemy") {
                this.panel_enemy.addToken(p.name, p.icon);
            }            
            if (p.type == "token") {
                this.panel_token.addToken(p.name, p.icon);
            }            
        }
    }
    readMapFromFile(file) {
        var _Instance = this;
        //console.dir(file);
        let fr = new FileReader();
        fr.readAsText(file);
        fr.addEventListener('load', function(e) {
            _Instance.network.sendMap(fr.result);
        });
    }
    getPlayerName() {
        let n = localStorage.player_name;
        if (n == "Anon" || n == undefined) {
            n = window.prompt("Wie sollen wir dich nennen?");
        }
        localStorage.player_name = n;
        return n;
    }
}