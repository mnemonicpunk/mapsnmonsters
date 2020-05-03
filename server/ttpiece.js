class TTPiece {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;

        this.x = 50;
        this.y = 16;
        
        this.on_board = false;        
    }
}

module.exports = TTPiece;