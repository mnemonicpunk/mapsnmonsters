class GameBoard {
    constructor(tabletop) {
        this.cache = document.createElement('canvas');

        this.tabletop = tabletop;
        this.tiles = [];
        this.pieces = [];

        // 0 = pointer
        // 1 = reveal/hide map
        // 2 = manipulate pieces
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

        if (this.user_mode == 1) {
            // draw tile target rect
            let ht = this.getHoveredTile();
            ctx.strokeStyle = "#888";
            ctx.strokeRect(ht.x*SUBTILE_WIDTH*4 + x, ht.y*SUBTILE_HEIGHT*4 + y, SUBTILE_WIDTH*4, SUBTILE_HEIGHT*4);
        }

        if (this.user_mode == 2) {
            // draw small target rect
            let hp = this.getHoveredPosition();
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(hp.x*SUBTILE_WIDTH + x, hp.y*SUBTILE_HEIGHT + y, SUBTILE_WIDTH, SUBTILE_HEIGHT);

            // draw the piece name if are above a piece
            let p = this.getPieceAtPosition(hp.x, hp.y);
            if (p != null) {
                ctx.fillStyle = "#fff";
                let size = ctx.measureText(p.name);
                ctx.fillText(p.name, x + ((hp.x + 0.5) * SUBTILE_WIDTH) - size.width/2, y + hp.y*SUBTILE_HEIGHT - 5);
            }
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
    setPieceMeta(piece_data) {
        for (let i=0; i<piece_data.length; i++) {
            if (this.pieces.length <= i) {
                let p = new GamePiece(piece_data[i].name, piece_data[i].icon, piece_data[i].type);
                this.pieces.push(p);
            } else {
                this.pieces[i].updateMeta(piece_data[i].name, piece_data[i].icon, piece_data[i].type);
            }
        }
    }    
    mouseMove(x, y) {
        this.hovered_position = {
            x: Math.floor(x/SUBTILE_WIDTH),
            y: Math.floor(y/SUBTILE_HEIGHT)
        }
        if (this.hovered_position.x < 0) {
            this.hovered_position.x = 0;
        }
        if (this.hovered_position.y < 0) {
            this.hovered_position.y = 0;
        }
        if (this.hovered_position.x >= (MAP_WIDTH*4)) {
            this.hovered_position.x = (MAP_WIDTH*4)-1;
        }         
        if (this.hovered_position.y >= (MAP_HEIGHT*4)) {
            this.hovered_position.y = (MAP_HEIGHT*4)-1;
        }                 
    }
    mouseClick(button, x, y) {
        this.mouseMove(x, y);
        if (this.user_mode == 1) {
            let ht = this.getHoveredTile();
            let t = this.getTile(ht.x, ht.y);
            //t.visible = !t.visible;

            if (button == 0) {
                //t.visible = true;
                this.tabletop.network.sendReveal(ht.x, ht.y, true);
            }
            if (button == 2) {
                //t.visible = false;
                this.tabletop.network.sendReveal(ht.x, ht.y, false);
            }

            this.drawMap();
        }
        if (this.user_mode == 2) {
            let hp = this.getHoveredPosition();
            let p = this.pieces[this.selected_piece];
            
            if (button == 0) {
                //p.place(ht.x, ht.y);
                this.tabletop.network.sendPlacePiece(hp.x, hp.y, this.selected_piece);
            }
            if (button == 2) {
                //p.remove();
                this.tabletop.network.sendRemovePiece(this.selected_piece);
            }            
        }
    }
    getHoveredTile() {
        let ht = {
            x: Math.floor(this.hovered_position.x/4),
            y: Math.floor(this.hovered_position.y/4)
        };

        if (ht.x < 0) { 
            ht.x = 0;
        }
        if (ht.y < 0) { 
            ht.y = 0;
        }
        if (ht.x >= MAP_WIDTH) { 
            ht.x = MAP_WIDTH-1;
        }
        if (ht.y >= MAP_HEIGHT) { 
            ht.y = MAP_HEIGHT-1;
        }

        return ht;
    }
    getHoveredPosition() {
        return this.hovered_position;
    }
    getTile(x, y) {
        return this.tiles[x + y*MAP_WIDTH];
    }
    selectPieceByType(type, num) {
        let count = 0;
        for(let i=0; i<this.pieces.length; i++) {
            if (this.pieces[i].type == type) {
                if (count == num) {
                    this.selected_piece = i;
                    return;
                }
                count++;
            }
        }
    }
    getPieceByType(type, num) {
        let count = 0;
        for(let i=0; i<this.pieces.length; i++) {
            if (this.pieces[i].type == type) {
                if (count == num) {
                    return this.pieces[i];
                }
                count++;
            }
        }
    }    
    getPieceAtPosition(x, y) {
        for (let i=0; i<this.pieces.length; i++) {
            if ((this.pieces[i].x == x) && (this.pieces[i].y == y)) {
                return this.pieces[i];
            }
        }
        return null;
    }
    getPieceNumber(piece) {
        for (let i=0; i<this.pieces.length; i++) {
            if (this.pieces[i] == piece) {
                return i;
            }
        }
        return -1;
    }
}