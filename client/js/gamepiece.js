class GamePiece {
    constructor(name, icon, type) {
        this.img = document.createElement('img');
        this.updateMeta(name, icon, type);

        this.x = 50;
        this.y = 16;
        
        this.tween_x = 0;
        this.tween_y = 0;

        this.on_board = false;
    }
    place(x, y) {
        this.x = x;
        this.y = y;

        if (!this.on_board) {
            this.tween_x = 1920;
            this.tween_y = 540;
        }

        this.on_board = true;
    }
    updateMeta(name, icon, type) {
        this.name = name;
        this.icon = icon;
        this.type = type;
        
        this.img.src = "./graphics/piece/" + icon + ".png";
    }
    remove() {
        this.on_board = false;
    }
    draw(ctx, x, y) {
        if (!this.on_board) {
            return;
        }

        let dx = this.tween_x - (this.x*SUBTILE_WIDTH);
        let dy = this.tween_y - (this.y*SUBTILE_WIDTH);

        this.tween_x -= dx * 0.2;
        this.tween_y -= dy * 0.2;

        ctx.drawImage(this.img, x + (this.tween_x), y + (this.tween_y));
    }
}