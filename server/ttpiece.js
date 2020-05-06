class TTPiece {
    constructor(name, class_name) {
        this.name = name;
        this.class_name = class_name;
        this.id = "";

        this.x = 0;
        this.y = 0;
    }
    place(x, y) {
        this.x = x;
        this.y = y;
    }
    getData() {
        return {
            x: this.x,
            y: this.y,
            name: this.name,
            class_name: this.class_name,
            id: this.id
        };
    }
}

module.exports = TTPiece;