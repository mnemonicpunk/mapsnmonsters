class GameBoard {
    constructor(tabletop) {
        this.cache = document.createElement('canvas');

        this.tabletop = tabletop;
        this.tiles = [];
        this.pieces = [];

        // 0 = reveal/hide map
        // 1 = manipulate pieces
        this.user_mode = 0;

        this.selected_piece = 0;

        this.hovered_position = {
            x: 0,
            y: 0
        }

        for (let i=0; i<MAP_WIDTH*MAP_HEIGHT; i++) {
            this.tiles.push(new GameTile(-1));
        }
    }
    addPiece(piece) {
        this.pieces.push(piece);
    }
    draw(ctx, x, y) {
        ctx.drawImage(this.cache, x, y);

        for (let i=0; i<this.pieces.length; i++) {
            this.pieces[i].draw(ctx, x, y);
        }

        if (this.user_mode == 0) {
            // draw tile target rect
            let ht = this.getHoveredTile();
            ctx.strokeStyle = "#888";
            ctx.strokeRect(ht.x*SUBTILE_WIDTH*4 + x, ht.y*SUBTILE_HEIGHT*4 + y, SUBTILE_WIDTH*4, SUBTILE_HEIGHT*4);
        }

        if (this.user_mode == 1) {
            // draw small target rect
            let hp = this.getHoveredPosition();
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(hp.x*SUBTILE_WIDTH + x, hp.y*SUBTILE_HEIGHT + y, SUBTILE_WIDTH, SUBTILE_HEIGHT);
        }

        //ctx.fillText(hp.x + "/" + hp.y + " Type: " + this.getTile(ht.x, ht.y).type, 10, 10);
    }
    drawMap() {
        let ctx = this.cache.getContext('2d');
        ctx.clearRect(0, 0, this.cache.width, this.cache.height);
        for (let i=0; i<this.tiles.length; i++) {
            let tx = i%MAP_WIDTH;
            let ty = Math.floor(i/MAP_WIDTH);
            this.tiles[i].draw(ctx, tx*SUBTILE_WIDTH*4, ty*SUBTILE_HEIGHT*4);
        }        
    }
    setupMap(map_data) {
        for (var i=0; i<map_data.length; i++) {
            this.tiles[i].type = map_data[i]-1;
        }
        this.cache.width = MAP_WIDTH * 4 * SUBTILE_WIDTH;
        this.cache.height = MAP_HEIGHT * 4 * SUBTILE_HEIGHT;

        this.getTile(3, 3).visible = true;
        this.getTile(4, 3).visible = true;

        this.drawMap();
    }
    setMapState(map_data) {
        for (let i=0; i<map_data.length; i++) {
            this.tiles[i].type = map_data[i].type-1;
            this.tiles[i].visible = map_data[i].visible;
        }
        this.drawMap();
    }
    setPieceState(piece_data) {
        for (let i=0; i<this.pieces.length; i++) {
            if (piece_data[i].on_board == true) {
                this.pieces[i].place(piece_data[i].x, piece_data[i].y);
            } else {
                this.pieces[i].remove();
            }
        }
    }
    mouseMove(x, y) {
        this.hovered_position = {
            x: Math.floor(x/SUBTILE_WIDTH),
            y: Math.floor(y/SUBTILE_HEIGHT)
        }
        //console.dir(this.hovered_position);
    }
    mouseClick(button, x, y) {
        this.mouseMove(x, y);
        if (this.user_mode == 0) {
            let ht = this.getHoveredTile();
            let t = this.getTile(ht.x, ht.y);
            //t.visible = !t.visible;

            if (button == 0) {
                //t.visible = true;
                this.tabletop.sendReveal(ht.x, ht.y, true);
            }
            if (button == 2) {
                //t.visible = false;
                this.tabletop.sendReveal(ht.x, ht.y, false);
            }

            this.drawMap();
        }
        if (this.user_mode == 1) {
            let hp = this.getHoveredPosition();
            let p = this.pieces[this.selected_piece];
            
            if (button == 0) {
                //p.place(ht.x, ht.y);
                this.tabletop.sendPlacePiece(hp.x, hp.y, this.selected_piece);
            }
            if (button == 2) {
                //p.remove();
                this.tabletop.sendRemovePiece(this.selected_piece);
            }            
        }
    }
    getHoveredTile() {
        return {
            x: Math.floor(this.hovered_position.x/4),
            y: Math.floor(this.hovered_position.y/4)
        }
    }
    getHoveredPosition() {
        return this.hovered_position;
    }
    getTile(x, y) {
        return this.tiles[x + y*MAP_WIDTH];
    }
}