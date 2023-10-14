import {setSettingValue} from "./settings.js";
import {resetGame} from "./main.js";

const DIRECTION_X_POSSIBILITIES = ['left', 'right'];
const DIRECTION_Y_POSSIBILITIES = ['top', 'bottom'];

export default class Ball {
    constructor ( x, y, radius, ctx ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.directionX = 'linear';
        this.directionY = 'bottom';
        this.ctx = ctx;
        this.directionXModifier = 1;
        this.speed = 2;
        this.maxSpeed = 8;
        this.startTime = performance.now();
        this.hitPlayer = new Audio('./assets/sounds/ball-player-hit.mp3');
        this.hitBlock = new Audio('./assets/sounds/ball-block-hit.mp3');
        setSettingValue('ballSpeed', this.speed);
        setSettingValue('ballMaxSpeed', this.maxSpeed);
    }

    draw () {
        this.ctx.beginPath();
        this.ctx.arc( this.x, this.y, this.radius, 0, 2 * Math.PI );
        this.ctx.fillStyle = "white";
        this.ctx.stroke();
        this.ctx.fill();
    }

    move () {
        if ( this.directionX === 'linear' && this.directionY === 'bottom' ) {
            this.y += this.speed;
        }else if ( this.directionX === 'linear' && this.directionY === 'top' ) {
            this.y -= this.speed;
        }
        if ( this.directionX === 'right' && this.directionY === 'bottom' ) {
            this.x += this.directionXModifier * this.speed;
            this.y += this.speed;
        } else if ( this.directionX === 'right' && this.directionY === 'top' ) {
            this.x += this.directionXModifier * this.speed;
            this.y -= this.speed;
        } else if ( this.directionX === 'left' && this.directionY === 'top' ) {
            this.x += this.directionXModifier * this.speed;
            this.y -= this.speed;
        } else if ( this.directionX === 'left' && this.directionY === 'bottom' ) {
            this.x += this.directionXModifier * this.speed;
            this.y += this.speed;
        }
        this.x = parseFloat( ( this.x ).toFixed( 1 ) )
        this.collisionDetectWithBorders();
    }

    collisionDetectWithBorders () {
        if (this.y + this.radius >= window.innerHeight) {
            resetGame();
        }
        if ( this.x - this.radius <= 0 || this.x + this.radius >= window.innerWidth) {
            this.directionXModifier = -this.directionXModifier;
            this.directionX = DIRECTION_X_POSSIBILITIES.filter(directionX => directionX !== this.directionX)[0];
        }

        else if ( this.y - this.radius <= 0 || this.y + this.radius >= window.innerHeight ) {
            this.directionY = DIRECTION_Y_POSSIBILITIES.filter(directionY => directionY !== this.directionY)[0];
        }


    }

    collisionDetectWithPlayer ( player ) {
        // Collision from the bottom
        if (this.y + this.radius >= player.y &&
            this.y + this.radius <= player.y + player.height &&
            this.x >= player.x &&
            this.x <= player.x + player.width
        ) {
            this.hitPlayer.play().then(r => {});

            const playerStartX = player.x;
            const playerEndX = player.x + player.width;
            const playerMiddleX = ( playerStartX + playerEndX ) / 2
            const ballX = this.x;


            if ( ballX > playerStartX && ballX < playerMiddleX ) {
                this.directionXModifier = parseFloat( ( -( playerMiddleX - ballX ) / 100 ).toFixed( 1 ) );
                this.directionX = 'left';
            } else if ( ballX > playerMiddleX && ballX < playerEndX ) {
                this.directionXModifier = parseFloat( ( ( ballX - playerMiddleX ) / 100).toFixed( 1 ) );
                this.directionX = 'right';
            } else if (this.directionX === 'linear') {
                this.directionXModifier = 0;
            }

            this.directionY = 'top';
        }
    }

    collisionDetectWithBlock(block) {
        if (block.isDeleted) return;
        // Calculate the distance between the ball's center and the block's center
        const dx = this.x - (block.x + block.width / 2);
        const dy = this.y - (block.y + block.height / 2);

        // Calculate the combined half-widths and half-heights of the ball and block
        const combinedHalfWidths = this.radius + block.width / 2;
        const combinedHalfHeights = this.radius + block.height / 2;

        // Check for a collision by comparing the distance to the combined half-widths and half-heights
        if (Math.abs(dx) <= combinedHalfWidths && Math.abs(dy) <= combinedHalfHeights) {
            // Collision detected

            // Calculate the overlap on each axis
            const overlapX = combinedHalfWidths - Math.abs(dx);
            const overlapY = combinedHalfHeights - Math.abs(dy);

            // Determine the collision side
            if (overlapX >= overlapY) {
                if (dy > 0) {
                    // Collision from the bottom
                    this.directionY = 'bottom';
                } else {
                    // Collision from the top
                    this.directionY = 'top';
                }
                this.hitBlock.play().then(r => {});
                this.move();
                block.delete();
            } else {
                if (dx > 0) {
                    // Collision from the left
                    this.directionXModifier = -this.directionXModifier;
                } else {
                    // Collision from the right
                    this.directionXModifier = -this.directionXModifier;
                }
                this.hitBlock.play().then(r => {});
                this.move();
                block.delete();
            }
        }
    }

    increaseSpeed() {
        if (this.speed >= this.maxSpeed) {
            this.speed = this.maxSpeed;
            return
        }
        let endTime = performance.now();
        let timeElapsed = endTime - this.startTime;
        if (timeElapsed / 3000 > 1) {
            this.startTime = performance.now();
            this.speed += 0.1;
            this.speed = parseFloat( this.speed.toFixed( 1 ) );
            setSettingValue('ballSpeed', this.speed);
        }

    }
}
