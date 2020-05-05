class TTPiece {
    constructor(name, icon, type) {
        this.name = name;
        this.icon = icon;
        this.type = type;
        this.claimed_by = null;
        //this.class = class;

        this.x = 0;
        this.y = 0;
        
        this.on_board = false;        
    }
    place(x, y) {
        this.x = x;
        this.y = y;
        this.on_board = true;
    }
    remove() {
        this.on_board = false;
    }
    getMeta() {
        let meta = {
            name: this.name,
            icon: this.icon,
            type: this.type,
        };

        if (this.claimed_by != null) {
            meta.name = this.claimed_by.name;
        }

        return meta;
    }
    claim(player) {
        this.claimed_by = player;
    }
    unclaim(player) {
        if (this.claimed_by == player) {
            this.claimed_by = null;
        }
    }
}

module.exports = TTPiece;