const UICOL = {
    panel: "#222",
    hovered_panel: "#333",
    active_item: "#555",
    text: "#aaa",
    button: "#333",
    hovered_button: "#444",
};

class wToolbar extends mnWidget {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.items = []
        this.selected_item = 0;
    }
    draw(ctx, x, y) {
        ctx.fillStyle = "#444";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    addItem(name, callback) {
        let item = new wToolbarItem(this.items.length * 80, 0, 80, 40);
        this.items.push(item);
        this.children.push(item);
        item.name = name;
        item.click_callback = callback;
    }
    select(num) {
        this.selected_item = num;
        for (let i=0; i<this.items.length; i++) {
            if (this.selected_item == i) {
                this.items[i].selected = true;
            } else {
                this.items[i].selected = false;
            }
        }
    }
}

class wToolbarItem extends mnWidget {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.name = "";
        this.click_callback = null;
        this.selected = false;
    }
    mouseMove(x, y) {
        this.hovered = false;
    }
    onHover(x, y) {
        this.hovered = true;
    }
    onClick(button) {
        if ((this.click_callback != null) && (button == 0)) {
            this.click_callback();
        }
    }
    draw(ctx, x, y) {
        ctx.fillStyle = this.hovered?UICOL.hovered_panel:UICOL.panel;
        if (this.selected) {
            ctx.fillStyle = UICOL.active_item;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = UICOL.text;
        let dim = ctx.measureText(this.name);
        ctx.fillText(this.name, this.x + this.width/2 - dim.width/2 , this.y+(this.height*0.6));
    }
}

class wTokenPanel extends mnWidget {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.title = "Helden Tokens";
        this.tokens = [];

        this.selected = 0;
        this.select_callback = null;
        this.context_callback = null;
    }
    addToken(name, icon_type, icon_num) {
        var _Instance = this;
        var index = this.children.length;

        let t = new wTokenItem(0, this.children.length*68, this.width, 68, name, new GameIcon(icon_type, icon_num));
        t.click_callback = function(button) {
            if (button == 0) {
                _Instance.select(index);
            }
            if (button == 2) {
                if (_Instance.context_callback != null) {
                    _Instance.context_callback(index);
                }
            }
            
        }
        this.children.push(t);
        this.height = this.children.length*68;
    }
    clearTokens() {
        this.children = [];
    }
    draw(ctx) {
        ctx.fillStyle = this.hovered?UICOL.hovered_panel:UICOL.panel;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    select(num) {
        this.selected = num;
        for (let i=0; i<this.children.length; i++) {
            this.children[i].selected = (i == num);
        }
        if ((this.selected != -1) && (this.select_callback!= null)) {
            this.select_callback(this.selected);
        }
    }
}

class wButton extends mnWidget {
    constructor(x, y, width, height, name) {
        super(x, y, width, height);
        this.name = name;
        this.click_callback = null;

        this.hovered = false;
        this.selected = false;
    }
    mouseMove() {
        this.hovered = false;
    }
    onHover(x, y) {
        this.hovered = true;
        super.onHover(x, y);
    }
    onClick(button) {
        if (this.click_callback != null) {
            this.click_callback(button);
        }
    }
    draw(ctx) {
        ctx.fillStyle = UICOL.button;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.hovered) {
            ctx.fillStyle = UICOL.hovered_button;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }      

        ctx.fillStyle = UICOL.text;
        let size = ctx.measureText(this.name);
        ctx.fillText(this.name, this.x + this.width/2 - size.width/2, this.y + this.height*0.55);
    }    
}

class wTokenItem extends wButton {
    constructor(x, y, width, height, name, icon) {
        super(x, y, width, height, name);
        this.icon = icon;    

        console.dir(icon);
    }
    draw(ctx) {
        if (this.hovered) {
            ctx.fillStyle = UICOL.hovered_panel;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.selected) {
            ctx.fillStyle = UICOL.active_item;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }        

        ctx.fillStyle = UICOL.text;
        ctx.fillText(this.name, this.x + 68, this.y + this.height*0.55);
        this.icon.draw(ctx, this.x + 10, this.y + 10, 48, 48);
    }
}

class wEditPiece extends mnWidget {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.icon_selector = new wIconSelector(10, 10, this.width - 20, 40);
        this.children.push(this.icon_selector);
        this.piece = null;
        this.confirm_callback = null;
        this.claim_callback = null;

        this.claim_button = new wButton(20, this.height-60, 170, 40, "Das bin ich!");
        this.children.push(this.claim_button);
        this.claim_button.active = false;

        var _Instance = this;

        this.confirm_button = new wButton(this.width-190, this.height-60, 170, 40, "Okay");
        this.confirm_button.click_callback = function() {
            _Instance.confirmEdit();
        }

        this.children.push(this.confirm_button);
    }
    beginEdit(piece) {
        this.active = true;
        this.piece = piece;
        this.icon_selector.populate(piece.type);
        this.icon_selector.select(this.piece.icon);

        this.claim_button.active = false;
        if (piece.type == "hero") {
            let _Instance = this;

            this.claim_button.active = true;
            this.claim_button.click_callback = function() {
                if (_Instance.claim_callback != null) {
                    _Instance.claim_callback(piece);
                }
            }
        }
    }
    confirmEdit() {
        this.piece.icon = this.icon_selector.selected_icon;
        this.active = false;
        if (this.confirm_callback != null) {
            this.confirm_callback(this.piece);
        }
    }
    draw(ctx) {
        ctx.fillStyle = UICOL.panel;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class wIconSelector extends mnWidget {
    constructor(x, y, width, height, sheet) {
        super(x, y, width, height);
        this.selected_icon = -1;
        
    }
    populate(type) {
        this.children = [];
        if (type == "hero") {
            this.sheet = document.getElementById('icon_hero');        
            for (let i=0; i<27; i++) {
                let icon = new wIcon((i%8)*48, Math.floor(i/8)*48, 48, 48, this.sheet, i, 48);
                this.children.push(icon);
    
                var _Instance = this;
                icon.click_callback = function(num) {
                    _Instance.select(num);
                }
            }    
        }
        if (type == "enemy") {
            this.sheet = document.getElementById('icon_enemy');        
            for (let i=0; i<25; i++) {
                let icon = new wIcon((i%8)*48, Math.floor(i/8)*48, 48, 48, this.sheet, i, 70);
                this.children.push(icon);
    
                var _Instance = this;
                icon.click_callback = function(num) {
                    _Instance.select(num);
                }
            }    
        }        
    }
    draw(ctx) {
        /*ctx.fillStyle = "#fff";
        ctx.fillRect(this.x, this.y, this.width, this.height);*/
    }
    select(num) {
        console.log(num);
        this.selected_icon = num;
        for (let i=0; i<this.children.length; i++) {
            this.children[i].selected = (i==num);
        }
    }
}

class wIcon extends mnWidget {
    constructor(x, y, width, height, sheet, num, source_size) {
        super(x, y, width, height);
        this.sheet = sheet;
        this.num = num;
        this.selected = false;
        this.click_callback = null;
        this.size = source_size;
    }
    draw(ctx) {
        let num = this.num;
        let source_size = this.size;
        let num_x = Math.ceil(this.sheet.width/(source_size*2));
        let num_y = Math.ceil(this.sheet.height/(source_size*2));

        let ix = num%num_x;
        let iy = Math.floor(num/num_x);

        ctx.drawImage(this.sheet, ix*(source_size*2), iy*(source_size*2), source_size, source_size, this.x, this.y, this.width, this.height);
        if (this.selected) {
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(this.x, this.y, this.width-2, this.height-2);
        }
    }
    onClick() {
        if (this.click_callback != null) {
            this.click_callback(this.num);
        }
    }
}

class GameUI extends mnUI {
    constructor(x, y, width, height, tabletop) {
        super(x, y, width, height);

        this.tabletop = tabletop;
        let _Instance = this;

        this.toolbar = new wToolbar(10, 10, this.width-20, 40);
        this.toolbar.addItem("Zeiger", function() {
            _Instance.tabletop.setUIMode(0);
        });
        this.toolbar.addItem("Karte", function() {
            _Instance.tabletop.setUIMode(1);
        });
        this.toolbar.addItem("Helden", function() {
            _Instance.tabletop.setUIMode(2);
        });
        this.toolbar.addItem("Gegner", function() {
            _Instance.tabletop.setUIMode(3);
        });
        this.toolbar.addItem("Tokens", function() {
            _Instance.tabletop.setUIMode(4);
        });
        this.toolbar.select(0);
        
        this.panel_hero = new wTokenPanel(this.width - 420, 40, 400, 400);
        this.panel_hero.active = false;
        this.panel_hero.select_callback = function(num) {
            _Instance.tabletop.board.selectPieceByType("hero", num);
            _Instance.panel_enemy.select(-1);
            _Instance.panel_token.select(-1);
        }
        this.panel_hero.context_callback = function(num) {
            _Instance.edit_piece_window.beginEdit(_Instance.tabletop.board.getPieceByType("hero", num));
        }

        this.panel_enemy = new wTokenPanel(this.width - 420, 40, 400, 400);
        this.panel_enemy.active = false;
        this.panel_enemy.select_callback = function(num) {
            _Instance.tabletop.board.selectPieceByType("enemy", num);
            _Instance.panel_hero.select(-1);
            _Instance.panel_token.select(-1);
        }
        this.panel_enemy.context_callback = function(num) {
            _Instance.edit_piece_window.beginEdit(_Instance.tabletop.board.getPieceByType("enemy", num));
        }

        this.panel_token = new wTokenPanel(this.width - 420, 40, 400, 400);
        this.panel_token.active = false;
        this.panel_token.select_callback = function(num) {
            _Instance.tabletop.board.selectPieceByType("token", num);
            _Instance.panel_hero.select(-1);
            _Instance.panel_enemy.select(-1);
        }

        this.edit_piece_window = new wEditPiece(0, 0, 400, 400);
        this.edit_piece_window.active = false;
        this.edit_piece_window.confirm_callback = function(piece) {
            _Instance.tabletop.sendPieceEdit(piece);
        }
        this.edit_piece_window.claim_callback = function(piece) {
            _Instance.tabletop.sendPieceClaim(piece);
        }

        this.children.push(this.toolbar);
        this.children.push(this.panel_hero);
        this.children.push(this.panel_enemy);
        this.children.push(this.panel_token);
        this.children.push(this.edit_piece_window);
    }
    resize(x, y, width, height) {
        super.resize(x, y, width, height);

        this.toolbar.resize(this.width - 420, 20, 400, 40);
        this.panel_hero.resize(this.width - 420, 65, 400, this.panel_hero.children.length*68);
        this.panel_enemy.resize(this.width - 420, 65, 400, this.panel_enemy.children.length*68);
        this.panel_token.resize(this.width - 420, 65, 400, this.panel_token.children.length*68);

        this.edit_piece_window.resize((this.width/2) - 200, (this.height/2)-200, 400, 400);
    }
    populateTokenMenus(piece_data) {
        this.panel_hero.clearTokens();
        this.panel_enemy.clearTokens();
        this.panel_token.clearTokens();
        

        for (let i=0; i<piece_data.length; i++) {
            let p = piece_data[i];
            if (p.type == "hero") {
                this.panel_hero.addToken(p.name, p.type, p.icon);
            }
            if (p.type == "enemy") {
                this.panel_enemy.addToken(p.name, p.type, p.icon);
            }            
            if (p.type == "token") {
                this.panel_token.addToken(p.name, p.type, p.icon);
            }            
        }
    }
}