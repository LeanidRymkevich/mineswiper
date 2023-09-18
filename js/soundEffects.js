import {soundOnBtnInnerHTML, soundOffBtnInnerHTML} from "./page-rendering.js";

let isMuted = false;
let audio = new Audio();

function play(kindOfSound){
  audio = new Audio();
  const soundSRC = `assets/sounds/${kindOfSound}.wav`;
  audio.src = soundSRC;
  audio.volume = isMuted ? 0 : 0.2;
  audio.play();
}

function muteBtnHandler(button){
  if(!isMuted){
    audio.volume = 0;
    isMuted = true;
    button.innerHTML = soundOffBtnInnerHTML;
  } else {
    audio.volume = 0.2;
    isMuted = false;
    button.innerHTML = soundOnBtnInnerHTML;
  }
}

export {play, muteBtnHandler};
