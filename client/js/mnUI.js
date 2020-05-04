const UICOL = {
    panel: "#222",
    hovered_panel: "#333",
    active_item: "#555",
    text: "#aaa",
    button: "#333",
    hovered_button: "#444",
};

class mnWidget {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.children = [];
        this.active = true;

        this.hovered = false;
    }
    _draw(ctx) {
        if (!this.active) { return; }
        this.draw(ctx);
        ctx.save();
        ctx.translate(this.x, this.y);
        this.withChildren(function(parent, self) {
            self._draw(ctx);
        });
        ctx.restore();
    }
    draw(ctx) {

    }
    withChildren(callback) {
        for (let i=0; i < this.children.length; i++) {
            callback(this, this.children[i]);
        }
    }
    isUnderMouse(x, y) {
        if ((x >= this.x) && (x <= this.x+this.width) && (y >= this.y) && (y <= this.y+this.height)) {
            return true;
        }
        return false;
    }
    _mouseMove(x, y) {
        if (!this.active) { return; }
        this.mouseMove(x, y);
        this.withChildren(function(parent, self) {
            return self._mouseMove(x - parent.x, y - parent.y);
        });        
        if (this.isUnderMouse(x, y)) {
            this.onHover(x, y);
            return true;
        }
        return false;
    }
    _onClick(x, y, button) {
        if (!this.active) { return; }
        this.withChildren(function(parent, self) {
            self._onClick(x - parent.x, y - parent.y, button);
        });                    
        if (this.isUnderMouse(x, y)) {
            this.onClick(button);
            return true;
        }
        

        return false;
    }
    mouseMove(x, y) {

    }
    onHover(x, y) {

    }
    onClick(button) {

    }
    resize(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;        
    }
}

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
    addToken(name, icon) {
        var _Instance = this;
        var index = this.children.length;

        let t = new wTokenItem(0, this.children.length*68, this.width, 68, name, icon);
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
        this.img = document.createElement('img');
        this.img.src = "./graphics/piece/" + icon + ".png";
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
        ctx.drawImage(this.img, this.x + 10, this.y + 10);
    }
}

class wEditPiece extends mnWidget {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.icon_selector = new wIconSelector(10, 10, this.width - 20, 40);
        this.children.push(this.icon_selector);
        this.piece = null;

        /*
        this.claim_button = new wButton(20, this.height-60, 170, 40, "Beanspruchen");
        this.children.push(this.claim_button);
        */

        this.confirm_button = new wButton(this.width-190, this.height-60, 170, 40, "Okay");
        this.children.push(this.confirm_button);
    }
    beginEdit(piece) {
        this.active = true;
        this.piece = piece;
        console.dir(piece);
        this.icon_selector.populate(piece.type);
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
            ctx.strokeRect(this.x, this.y, source_size-2, source_size-2);
        }
    }
    onClick() {
        if (this.click_callback != null) {
            this.click_callback(this.num);
        }
    }
}

