export default class Player {
    constructor ( x, y, width, height, ctx ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
    }

    draw () {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect( this.x, this.y, this.width, this.height );
    }

    move (x) {
        this.x = x - ( this.width / 2 );
    }
}