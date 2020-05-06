class GameBoard {
    constructor(tabletop) {
        this.cache = document.createElement('canvas');

        this.tabletop = tabletop;
        this.tiles = [];
        this.pieces = [];
        this.piece_classes = [];

        // 0 = select/move/remove piece
        // 1 = reveal/hide map
        // 2 = place new pieces
        this.interaction_mode = 0;

        this.selected_piece = 0;
        this.selected_class = "";
        this.marked_id = "";

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

        if (this.interaction_mode == 0) {
            this.drawTileCursor(ctx, x, y);
            let p = this.getPieceByID(this.marked_id);
            if (p != null) {
                this.drawPieceSelector(ctx, x, y, p);
            }
        }

        if (this.interaction_mode == 1) {
            // draw tile target rect
            let ht = this.getHoveredTile();
            ctx.strokeStyle = "#888";
            ctx.strokeRect(ht.x*SUBTILE_WIDTH*4 + x, ht.y*SUBTILE_HEIGHT*4 + y, SUBTILE_WIDTH*4, SUBTILE_HEIGHT*4);
        }

        if (this.interaction_mode == 2) {
            this.drawTileCursor(ctx, x, y);
        }
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
    drawPieceSelector(ctx, x, y, piece) {
        ctx.strokeStyle = "#e2b007";
        ctx.strokeRect(piece.tween_x + x, piece.tween_y + y, SUBTILE_WIDTH, SUBTILE_HEIGHT);

        ctx.fillStyle = "#e2b007";
        let size = ctx.measureText(piece.name);
        ctx.fillText(piece.name, x + piece.tween_x + (SUBTILE_WIDTH/2) - size.width/2, y + piece.tween_y - 5);
    }
    drawTileCursor(ctx, x, y) {
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

        // first find and delete all pieces that are not in the update
        let delete_list = [];
        for (let i=0; i<this.pieces.length; i++) {
            let present = false;
            for (let j=0; j<piece_data.length; j++) { 
                if (this.pieces[i].id == piece_data[j].id) {
                    present = true;
                }
            }
            if (!present) {
                delete_list.push(this.pieces[i]);
            }
        }

        for (let i=0; i<delete_list.length; i++) {
            this.pieces.splice(this.getPieceNumber(delete_list[i]));
        }

        // then update or create new pieces
        for (let i=0; i<piece_data.length; i++) {
            let p = this.getPieceByID(piece_data[i].id);
            if (p == null) {
                p = new GamePiece(this, piece_data[i]);
                this.pieces.push(p);
            } else {
                p.update(piece_data[i]);
            }
        }
    }
    setPieceClasses(class_data) {
        this.piece_classes = class_data;
        for (let i=0; i<this.pieces.length; i++) {
            this.pieces[i].updateIcon();
        }
    }
    getPieceClass(class_name) {
        for (let i=0; i<this.piece_classes.length; i++) {
            if (this.piece_classes[i].name == class_name) {
                return this.piece_classes[i];
            }
        }
        return null;
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
        if (this.interaction_mode == 0) {
            let hp = this.getHoveredPosition();
            let p = this.getPieceAtPosition(hp.x, hp.y);

            if (button == 0) {
                if (p != null) {
                    this.marked_id = p.id;
                } else {
                    if (this.getPieceByID(this.marked_id) != null) {
                        this.tabletop.network.sendMovePiece(this.marked_id, hp.x, hp.y);
                    }
                }
            }
            if (button == 2) {
                if (p != null) {
                    this.tabletop.network.sendRemovePiece(p.id);
                }
            }            
        }
        if (this.interaction_mode == 1) {
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
        if (this.interaction_mode == 2) {
            let hp = this.getHoveredPosition();
            //let p = this.pieces[this.selected_piece];
            
            if (button == 0) {
                if (this.getPieceAtPosition(hp.x, hp.y) == null) {
                    if (this.selected_class != "") {
                        this.tabletop.network.sendCreatePiece(hp.x, hp.y, this.selected_class);
                    } else {
                        console.log("Can not create piece without classname");
                    }
                    
                }
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
    selectPieceClass(name) {
        this.selected_class = name;
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
    getPieceByID(id) {
        for(let i=0; i<this.pieces.length; i++) {
            if (this.pieces[i].id == id) {
                return this.pieces[i];
            }
        }
        return null;
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