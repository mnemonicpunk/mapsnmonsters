class mnWidget {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.children = [];
        this.active = true;

        this.hovered = false;
    }
    _draw(ctx) {
        if (!this.active) { return; }
        this.draw(ctx);
        ctx.save();
        ctx.translate(this.x, this.y);
        this.withChildren(function(parent, self) {
            self._draw(ctx);
        });
        ctx.restore();
    }
    draw(ctx) {

    }
    withChildren(callback) {
        let ret = false;
        for (let i=0; i < this.children.length; i++) {
            ret = (ret || callback(this, this.children[i]));
        }
        return ret;
    }
    isUnderMouse(x, y) {
        if ((x >= this.x) && (x <= this.x+this.width) && (y >= this.y) && (y <= this.y+this.height)) {
            return true;
        }
        return false;
    }
    _mouseMove(x, y) {
        if (!this.active) { return false; }

        let consumed = this.withChildren(function(parent, self) {
            return self._mouseMove(x - parent.x, y - parent.y);
        });        
        if (!consumed) {
            this.mouseMove(x, y);
            if (this.isUnderMouse(x, y)) {
                this.onHover(x, y);
                consumed = true;
            }    
        }
        return consumed;
    }
    _onClick(x, y, button) {
        if (!this.active) { return false; }

        let consumed = this.withChildren(function(parent, self) {
            return self._onClick(x - parent.x, y - parent.y, button);
        });             
        if (!consumed) {
            if (this.isUnderMouse(x, y)) {
                this.onClick(button);
                consumed = true;
            }    
        }
        return consumed;
    }
    mouseMove(x, y) {

    }
    onHover(x, y) {

    }
    onClick(button) {

    }
    resize(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;        
    }
}

class mnUI extends mnWidget {
    _mouseMove(x, y) {
        if (!this.active) { return false; }

        let consumed = this.withChildren(function(parent, self) {
            return self._mouseMove(x - parent.x, y - parent.y);
        });        
        return consumed;
    }    
    _onClick(x, y, button) {
        if (!this.active) { return false; }

        let consumed = this.withChildren(function(parent, self) {
            return self._onClick(x - parent.x, y - parent.y, button);
        });             
        return consumed;
    }
}