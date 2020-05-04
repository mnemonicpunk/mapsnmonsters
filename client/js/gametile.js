class GameTile {
    constructor(type) {
        this.type = type;
        this.visible = false;
    }
    draw(ctx, x, y) {
        if (this.type < -1) {
            this.type = -1;
        }
        if ((this.type == -1) || (this.visible == false)) { 
            //let tile_img = document.getElementById('tile_03');

            let large_tile_img = document.getElementById('large_tile_02');

            ctx.drawImage(large_tile_img, 0, 0, large_tile_img.width, large_tile_img.height, x, y, SUBTILE_WIDTH*4, SUBTILE_HEIGHT*4);
        } else {
            let tile_img = document.getElementById('tile_02');
            let large_tile_img = document.getElementById('large_tile_01');

            ctx.drawImage(large_tile_img, 0, 0, large_tile_img.width, large_tile_img.height, x, y, SUBTILE_WIDTH*4, SUBTILE_HEIGHT*4);

            ctx.fillStyle = '#fff';
            let td = TILE_COMPONENTS[this.type];
            for (let i=0; i<td.length; i++) {
                if (td[i] == true) {
                    let tx = x + (SUBTILE_WIDTH * (i%4));
                    let ty = y + (SUBTILE_HEIGHT * Math.floor(i/4));
                    ctx.fillStyle = "#000";
                    ctx.fillRect(tx, ty, SUBTILE_WIDTH, SUBTILE_HEIGHT);
                }
            }
        }
    }
}