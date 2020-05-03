class SideBoard {
    constructor() {
        this.slots = [];
        this.selected_slot = 0;

        this.add("Show/Hide Map");
        for (let i=0; i<SAMPLE_PIECES.length; i++) {
            this.add(SAMPLE_PIECES[i].name, SAMPLE_PIECES[i].icon);
        }
    }
    add(name, img) {
        this.slots.push({
            name: name,
            img: img
        });
    }
    scroll(num) {
        this.selected_slot+= num;
        //if (this.selected_slot < 0) { this.selected_slot = 0; }
        this.selected_slot %= this.slots.length;
        if (this.selected_slot < 0) { this.selected_slot = this.slots.length-1; }
    }
    draw(ctx, x, y) {
        for (let i=0; i<this.slots.length; i++) {
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = (i==this.selected_slot?"#444":"#888");
            ctx.fillRect(x, y + 48*i, 200, 32);

            ctx.globalAlpha = 1;
            ctx.strokeStyle = (i==this.selected_slot?"#fff":"#aaa");
            ctx.strokeRect(x, y + 48*i, 200, 32);

            ctx.fillStyle = "#fff";
            ctx.fillText(this.slots[i].name, x + 52, y + 20 +48*i);
        }
    }
}