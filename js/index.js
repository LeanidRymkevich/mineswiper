import * as mineField from "./mineField.js";
import { renderPage } from "./page-rendering.js";
import * as gameLogic from "./gameLogic.js";
import * as gameEndPopup from "./game-end-popup.js";
import { muteBtnHandler } from "./soundEffects.js";
import * as scorePopup from "./score-popup.js";

// start page rendering
const theme = localStorage.getItem('theme');
const defaultTheme = theme ? theme : 'light';
renderPage(defaultTheme);

const mineFieldContainer = document.querySelector('.mine-field-container');
let currentMineFieldSize = 10;
let currentMineField = mineField.renderMineField(currentMineFieldSize, mineFieldContainer);

let currentBombNum = 10;
let isFirstFieldClick = true;
//____________________________________________________________________________________

// common constants
const complexitySelect = document.querySelector('.complexity__select');
const minesNumberInput = document.querySelector('.mines-number__input');
const newGameBtn = document.querySelector('[data-btn-func="restart game"]');
const endPopup = gameEndPopup.renderGameEndPopup(document.body);
const movesDisplay = document.querySelector('.results__moves');
const timeDisplay = document.querySelector('.results__time');
const flagDisplay = document.querySelector('.results__flags');
const mineDisplay = document.querySelector('.results__bomb');
const muteBtn = document.querySelector('.mute-button');
const scoreWindow = scorePopup.renderEmptyScorePopup(document.body);
const scoreBtn = document.querySelector('[data-btn-func="show scores"]');

const complexityOptions = [
  {
    option: 'easy',
    size: 10,
    defaultBombNum : 10,
  },
  {
    option: 'medium',
    size: 15,
    defaultBombNum : 45,
  },
  {
    option: 'hard',
    size: 25,
    defaultBombNum : 99,
  },
];
//__________________

// functions 

function complexitySelectHundler() {
  const selectedComplexity = complexitySelect.selectedOptions[0].value;
  const selectedComplexityDescr = complexityOptions.filter(item => item.option === selectedComplexity)[0];
  currentMineFieldSize = selectedComplexityDescr.size;
  currentBombNum = selectedComplexityDescr.defaultBombNum;
  startNewGame();
  minesNumberInput.value = currentBombNum;
  isFirstFieldClick = true;
}

function minesNumberInputHandler(){
  if(minesNumberInput.value >= 10 && minesNumberInput.value <= 99){
    currentBombNum = minesNumberInput.value;
  } else {
    const selectedComplexityDescr = complexityOptions.filter(item => item.size === currentMineFieldSize)[0];
    const defaultBombNum = selectedComplexityDescr.defaultBombNum;
    minesNumberInput.value = defaultBombNum;
    currentBombNum = defaultBombNum;
  }
}

function mineFieldClickHandler(event) {
  const cell = event.target.closest('.mine-field__cell');
  if(!cell) return;

  isFirstFieldClick = gameLogic.firsMoveHandler(cell, isFirstFieldClick, currentMineFieldSize, currentBombNum);
  gameLogic.cellClickHanlder(cell, currentMineFieldSize, currentBombNum);
}

function mineFieldContextMenuHandler(event){
  event.preventDefault();
  const cell = event.target.closest('.mine-field__cell');
  if(!cell) return;

  isFirstFieldClick = gameLogic.firsMoveHandler(cell, isFirstFieldClick, currentMineFieldSize, currentBombNum);
  gameLogic.flagedCellHandler(cell, currentBombNum);
}

function newGameBtnHanlder(){
  startNewGame();
}

function startNewGame(){
  currentMineField = mineField.renderMineField(currentMineFieldSize, mineFieldContainer);
  gameLogic.resetProcesses();
  isFirstFieldClick = true;
  movesDisplay.textContent = '0000';
  flagDisplay.textContent = '0000';
  mineDisplay.textContent = '0000';
  timeDisplay.textContent = '00:00:00';

  mineFieldContainer.addEventListener('click', mineFieldClickHandler);
  mineFieldContainer.addEventListener('contextmenu', mineFieldContextMenuHandler);
}

function gameOverHandler(event){
  const gameResults = {
    moves: event.detail.moves,
    time: event.detail.time,
    result: event.detail.result
  }
  gameEndPopup.showGameEndPopup(endPopup, gameResults);
  mineFieldContainer.removeEventListener('click', mineFieldClickHandler);
  mineFieldContainer.removeEventListener('contextmenu', mineFieldContextMenuHandler);
}

function gameEndPopupBtnHandler() {
  gameEndPopup.closeGameEndPopup(endPopup);
  isFirstFieldClick = true;
  gameLogic.resetProcesses();
}

function savaThemeInStorage() {
  const themeBtn = document.querySelector('[data-btn-func="theme change"]');

  if(themeBtn.textContent.includes('light')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
}

//_____________________

// listeners

complexitySelect.addEventListener('change', complexitySelectHundler);
minesNumberInput.addEventListener('change', minesNumberInputHandler);
mineFieldContainer.addEventListener('click', mineFieldClickHandler);
mineFieldContainer.addEventListener('contextmenu', mineFieldContextMenuHandler);
newGameBtn.addEventListener('click', newGameBtnHanlder);
mineFieldContainer.addEventListener('gameOver', gameOverHandler);
muteBtn.addEventListener('click', () => muteBtnHandler(muteBtn));
scoreBtn.addEventListener('click', () => scorePopup.showScore(scoreWindow));
window.addEventListener('resize', () => mineField.resizeCells(currentMineFieldSize));
window.addEventListener('beforeunload', savaThemeInStorage);