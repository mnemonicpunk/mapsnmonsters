// NOTE: currently unused

class DiceAnimation {
    constructor(x, y, result) {
        this.x = x;
        this.y = y;
        this.result = result;

        this.sheet = null;
        this.rolling_frames = [];
        this.result_frames = [];

        // 0 = rolling, 1 = result
        this.anim_state = 0;
        this.anim_frame = 0; // will be kept as 0 if the result has been reached

        this.x_offset = (Math.random() * 200) - 100;
        this.y_offset = (Math.random() * 200) - 100;
    }
    animate() {
        this.x_offset *= 0.9;
        this.y_offset *= 0.9;
        this.anim_frame++;
        if (this.anim_frame > this.rolling_frames.length) {
            this.anim_frame = 0;
        }

        if (Math.abs(this.x_offset <=1)) {
            this.anim_state = 1;
        }
        if (Math.abs(this.y_offset <=1)) {
            this.anim_state = 1;
        }
    }
    draw(ctx) {
        if (this.sheet == null) { return; }
        let frame = [];
        if (this.anim_state == 0) {
            frame = this.rolling_frames[this.anim_frame];
        } else {
            frame = this.result_frames[this.result];
        }

        let dst = [
            this.x - this.x_offset - 24,
            this.y - this.y_offset - 24,
            48,
            48
        ];

        

        ctx.drawImage(this.sheet, frame[0], frame[1], frame[2], frame[3], dst[0], dst[1], dst[2], dst[3]);
    }
}

class D20Animation extends DiceAnimation {
    constructor(x, y, result) {
        super(x, y, result);

        this.sheet = document.getElementById('d20_sheet');
        
        var frameShorthand = function(num) {
            let w = 128;
            let h = 128;
            let num_x = 5;
            let off_x = 20;
            let off_y = 20;

            let x = num%num_x;
            let y = Math.floor(num/num_x);

            return [off_x + x*w, off_y + y*h, w, h];
        }

        for (let i=0; i<20; i++) {
            this.result_frames.push(frameShorthand(i));
        }

        for (let i=0; i<5; i++) {
            this.rolling_frames.push(frameShorthand(i+20));
        }
    }
}