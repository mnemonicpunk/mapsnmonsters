class TTPiece {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;

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
}

module.exports = TTPiece;