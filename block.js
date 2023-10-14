import {setSettingValue} from "./settings.js";
import {updateBlocksArray} from "./main.js";

let BLOCK_WIDTH = 40;
let BLOCK_HEIGHT = 20;
let BLOCK_ROW_AMOUNT = 8;
let localCtx;

const BLOCK_START_OFFSET_X = 10;
const BLOCK_START_OFFSET_Y = 20;
const TOTAL_AMOUNT_OF_BLOCK_TAKING_PLACE_X = () => BLOCK_WIDTH + BLOCK_WIDTH / 4;

const TOTAL_AMOUNT_OF_BLOCK_TAKING_PLACE_Y = () => BLOCK_HEIGHT + 10;

export const setBlockWidth = (value) => {
    BLOCK_WIDTH = parseFloat(value);
    updateBlocksArray();
}
export const setBlockHeight = (value) => {
    BLOCK_HEIGHT = parseFloat(value);
    updateBlocksArray();
}
export const setBlockRowAmount = (value) => {
    BLOCK_ROW_AMOUNT = parseFloat(value);
    updateBlocksArray();
}

export class Block {
    constructor(x, y, width, height, color, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.ctx = ctx;
        this.isDeleted = false;
        setSettingValue('blockWidth', BLOCK_WIDTH);
        setSettingValue('blockHeight', BLOCK_HEIGHT);
        setSettingValue('blockRowAmount', BLOCK_ROW_AMOUNT);
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    delete() {
        this.color = 'transparent';
        this.isDeleted = true;
    }
}

function screeCanFitBlockAmount() {
    return parseInt( ( ( window.innerWidth - BLOCK_START_OFFSET_X * 2 ) / TOTAL_AMOUNT_OF_BLOCK_TAKING_PLACE_X() ).toFixed() );
}

export default function createBlocks(ctx, rows = BLOCK_ROW_AMOUNT) {
    localCtx = ctx
    let totalBlockAmount = screeCanFitBlockAmount() * rows;

    let blocksArray = [];
    let rowIndex = 0;
    let x = 0;

    for ( let i = 0; i < totalBlockAmount; i++ ) {
        let blockX = BLOCK_START_OFFSET_X + ( x * TOTAL_AMOUNT_OF_BLOCK_TAKING_PLACE_X() ) ;
        let blockY = BLOCK_START_OFFSET_Y + ( rowIndex * TOTAL_AMOUNT_OF_BLOCK_TAKING_PLACE_Y());

        if (blockX + ( BLOCK_WIDTH * 2 ) + 8 > window.innerWidth) {
            x = 0;
            rowIndex++;
        } else {
            x++;
        }

        const randomColor = '#' + Math.floor( Math.random() * 16777215 ).toString( 16 );

        blocksArray.push(new Block(blockX, blockY, BLOCK_WIDTH, BLOCK_HEIGHT, randomColor, ctx));
    }
    return blocksArray;
}