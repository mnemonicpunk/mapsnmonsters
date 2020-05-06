class GameLog {
    constructor() {
        this.lines = [];
    }
    setLog(log) {
        this.lines = log;
    }
    drawLine(ctx, text, x, y) {
        ctx.font = "bold 18px sans serif";
        ctx.fillStyle = "#000";
        ctx.fillText(text, x-1, y);
        ctx.fillText(text, x+1, y);
        ctx.fillText(text, x, y-1);
        ctx.fillText(text, x, y+1);

        ctx.fillStyle = "#e2b007";
        ctx.fillText(text, x, y);
    }
    draw(ctx, x, y) {
        ctx.save();
        
        for (let i=0; i<this.lines.length; i++) {
            this.drawLine(ctx, this.lines[i], x, y - 220 + (i*22));
        }

        ctx.restore();
    }
}