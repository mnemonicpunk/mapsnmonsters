class GameTile {
    constructor(type) {
        this.type = type;
        this.visible = false;
    }
    draw(ctx, x, y) {
        if ((this.type == -1) || (this.visible == false)) { 
            let tile_img = document.getElementById('tile_03');

            ctx.fillStyle = '#fff';
            let td = TILE_COMPONENTS[this.type];
            for (let i=0; i<16; i++) {                
                let tx = x + (SUBTILE_WIDTH * (i%4));
                let ty = y + (SUBTILE_HEIGHT * Math.floor(i/4));
                ctx.drawImage(tile_img, tx, ty);
                
            }
        } else {
            let tile_img = document.getElementById('tile_02');

            ctx.fillStyle = '#fff';
            let td = TILE_COMPONENTS[this.type];
            for (let i=0; i<td.length; i++) {
                if (td[i] == false) {
                    let tx = x + (SUBTILE_WIDTH * (i%4));
                    let ty = y + (SUBTILE_HEIGHT * Math.floor(i/4));
                    ctx.drawImage(tile_img, tx, ty);
                }
            }
        }
    }
}