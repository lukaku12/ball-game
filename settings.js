import {updateValuesForBall} from "./main.js";
import {setBlockHeight, setBlockRowAmount, setBlockWidth} from "./block.js";

const settingsButton = document.getElementById('settings');
const settingsTab = document.getElementById('settingTab');

settingsButton.addEventListener('click', () => {
    settingsTab.classList.toggle('open');
    settingsButton.classList.toggle('active');
});

const ballSpeed = document.getElementById('ballSpeed');
const ballMaxSpeed = document.getElementById('ballMaxSpeed');

const blockWidth = document.getElementById('blockWidth');
const blockHeight = document.getElementById('blockHeight');
const blockRowAmount = document.getElementById('blockRowAmount');

const settings = [{ballSpeed, ballMaxSpeed, blockWidth, blockHeight, blockRowAmount}]


ballSpeed.addEventListener('change', (e) => {
    updateValuesForBall('speed', parseFloat(e.target.value));
});
ballMaxSpeed.addEventListener('change', (e) => {
    updateValuesForBall( 'maxSpeed', parseFloat( e.target.value ) );
});

blockWidth.addEventListener('change', (e) => {
    setBlockWidth( e.target.value );
});
blockHeight.addEventListener('change', (e) => {
    setBlockHeight( e.target.value );
});
blockRowAmount.addEventListener('change', (e) => {
    setBlockRowAmount( e.target.value );
});


export function setSettingValue(setting, value) {
    settings[0][setting].value = value
}


