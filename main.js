import Ball from "./ball.js";
import Player from "./player.js";
import createBlocks, {setBlockWidth} from "./block.js";
import './settings.js';
import {setSettingValue} from "./settings.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => window.location.reload());
window.addEventListener('mousemove', (e) => player.move(e.clientX));

const Ball_RADIUS = 10;

const PLAYER_WIDTH = 300;
const PLAYER_HEIGHT = 15;

const ball = new Ball( canvas.width / 2, canvas.height / 2, Ball_RADIUS, ctx );
const player = new Player( canvas.width / 2 - ( PLAYER_WIDTH / 2 ), canvas.height - ( PLAYER_HEIGHT + 10 ), PLAYER_WIDTH, PLAYER_HEIGHT, ctx )
let blocksArray = createBlocks(ctx);

export function updateValuesForBall(key, value) {
    ball[key] = value;

    if (key === 'speed' && ball.speed >= ball.maxSpeed) {
        ball.maxSpeed = ball.speed;
        setSettingValue('ballMaxSpeed', ball.maxSpeed);
    }

    if (key === 'maxSpeed' && ball.maxSpeed <= ball.speed) {
        ball.speed = ball.maxSpeed;
        setSettingValue('ballSpeed', ball.speed);
    }
}

export function updateBlocksArray () {
    blocksArray = createBlocks(ctx)
}

export function resetGame () {
    blocksArray = createBlocks(ctx);
    ball.speed = 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    player.x = canvas.width / 2 - ( PLAYER_WIDTH / 2 );
    player.y = canvas.height - ( PLAYER_HEIGHT + 10 );
}

function animate() {
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    blocksArray.forEach(block => block.draw());
    ball.draw();
    ball.move();
    player.draw();
    ball.collisionDetectWithPlayer(player);
    ball.increaseSpeed();
    blocksArray.forEach(block => ball.collisionDetectWithBlock(block));
    requestAnimationFrame(animate);
}

animate();
