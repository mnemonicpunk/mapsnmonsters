class GamePiece {
    constructor(board, data) {
        this.board = board;
        this.game_icon = new GameIcon(data.type, 0);
        this.update(data);
        
        this.tween_x = this.x*SUBTILE_WIDTH;
        this.tween_y = this.y*SUBTILE_HEIGHT;
    }
    update(data) {
        this.name = data.name;
        this.class_name = data.class_name;
        this.x = data.x;
        this.y = data.y;
        this.id = data.id;
        this.updateIcon();
    }
    updateIcon() {
        let c = this.board.getPieceClass(this.class_name);
        this.game_icon.update(c.type, c.icon);
    }
    place(x, y) {
        this.x = x;
        this.y = y;
    }
    draw(ctx, x, y) {
        let dx = this.tween_x - (this.x*SUBTILE_WIDTH);
        let dy = this.tween_y - (this.y*SUBTILE_WIDTH);

        this.tween_x -= dx * 0.2;
        this.tween_y -= dy * 0.2;

        //ctx.drawImage(this.img, x + (this.tween_x), y + (this.tween_y));
        this.game_icon.draw(ctx, x + this.tween_x, y + this.tween_y, 48, 48);
    }
}