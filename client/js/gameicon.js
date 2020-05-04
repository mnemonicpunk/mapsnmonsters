class GameIcon {
    constructor(type, num) {
        this.data = {};
        this.update(type, num);
    }
    update(type, num) {
        this.type = type;
        this.num = num;

        if (this.type == "hero") {
            this.data.sheet = document.getElementById('icon_hero');
            this.data.source_size = 48;
        }
        if (this.type == "enemy") {
            this.data.sheet = document.getElementById('icon_enemy');
            this.data.source_size = 70;
        }        

    }
    draw(ctx, x, y, width, height) {
        let num = this.num;
        let source_size = this.data.source_size;
        let num_x = Math.ceil(this.data.sheet.width/(source_size*2));
        let num_y = Math.ceil(this.data.sheet.height/(source_size*2));

        let ix = num%num_x;
        let iy = Math.floor(num/num_x);

        ctx.drawImage(this.data.sheet, ix*(source_size*2), iy*(source_size*2), source_size, source_size, x, y, width, height);
    }
}