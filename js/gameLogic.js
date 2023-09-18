import getFieldLayout from "./mineFieldLayout.js";
import {play} from "./soundEffects.js";

let time = 0; // in seconds
let timer = null;
let moves = 0;
let flags = 0;
let mines = 0;

//______________________________________________________

function firstClickOnField(size, bombNum, exeptionCell){
  const fieldLayout = getFieldLayout(size, bombNum, exeptionCell);
  const flatFieldLayout = [].concat(...fieldLayout);
  const fieldCells = document.querySelectorAll('.mine-field__cell');
  let cell;
  let cellCode; // number of mines around or bomb code
  for(let i = 0; i < fieldCells.length; i++){
    cell = fieldCells[i];
    cellCode = flatFieldLayout[i];
    cell.dataset.code = cellCode;
    // cell.textContent = cellCode; // to test code
  }
  timeDisplayUpdate();
  mineDisplayUpdate(bombNum);
}

// first click cell initialization => bomb or bomb arround num
function firsMoveHandler(cell, isFirstFieldClick, size, bombNum){
  if(isFirstFieldClick){ 
    const exeptionCell = {i: cell.dataset.row, j: cell.dataset.col};
    firstClickOnField(size, bombNum, exeptionCell);
  }
  return false;
}

function flagedCellHandler(cell, bombNum){
  const isCellFlaged = cell.classList.contains('mine-field__cell_flaged');
  const isOpened = cell.classList.contains('mine-field__cell_opened');
  const isUnopened = cell.classList.contains('mine-field__cell_unopened');
  if(isCellFlaged){
    cell.classList.remove('mine-field__cell_flaged');
    flags--;
    flagDisplayUpdate();
    mineDisplayUpdate(bombNum);
  }else{
    if(isOpened && !isUnopened) {
      return;
    }
    cell.classList.add('mine-field__cell_flaged');
    flags++;
    flagDisplayUpdate();
    mineDisplayUpdate(bombNum);
  }
  play('right-click');
}

function cellClickHanlder(cell, size, bombNum){
  if(cell.classList.contains('mine-field__cell_flaged')) return;
  if(cell.classList.contains('mine-field__cell_opened')) {
    if(!cell.classList.contains('mine-field__cell_unopened')){
      return;
    }
  }

  const cellCode = cell.dataset.code;
  let gameResult;

  if(+cellCode === 9){
    gameResult = bombCellClick();
  } else if(+cellCode === 0){
    gameResult = emptyCellClick(cell, size, bombNum);
  } else {
    gameResult = numberedCellClick(cell, size, bombNum);
  }
  play('left-click');

  if(gameResult !== 'continue'){
    gameOver(cell, gameResult);
  }

  if(gameResult === 'win') {
    showAllMines();
  }
}

// return lose - i.e. a game is lost
function bombCellClick(){
  showAllMines();
  return 'lose';
}

function emptyCellClick(cell, size, bombNum) {
  const mineFieldMap = getMineFieldMap();
  cell.className = '';
  cell.className = 'mine-field__cell mine-field__cell_opened';
  openAdjacentCells(cell, mineFieldMap);
  moves++;
  movesDisplayUpdate(moves);
  return gameStatusCheck(size, bombNum);
}

function numberedCellClick(cell, size, bombNum) {
  const cellCode = cell.dataset.code;
  cell.className = '';
  cell.className = 'mine-field__cell mine-field__cell_opened';
  cell.textContent = cellCode;
  moves++;
  movesDisplayUpdate(moves);

  return gameStatusCheck(size, bombNum);
}

function getGameOverEvent(time, moves, gameResult){
  const eventOption = {
    bubbles: true,
    detail: {
      time: time,
      moves: moves,
      result: gameResult
    }
  }
  
  return new CustomEvent('gameOver', eventOption);
}

function gameOver(cell, gameResult){
  const event = getGameOverEvent(time, moves, gameResult);
  cell.dispatchEvent(event);
  play(gameResult);
  resetProcesses();
}

function resetProcesses(){
  clearTimeout(timer);
  time = ''
  moves = 0;
  flags = 0;
  mines = 0;
}

function movesDisplayUpdate(moves){
  const movesDisplay = document.querySelector('.results__moves');
  movesDisplay.textContent = zeroBeforeNum(4, moves);
}

function flagDisplayUpdate(){
  const flagDisplay = document.querySelector('.results__flags');
  flagDisplay.textContent = zeroBeforeNum(4, flags);
}

function mineDisplayUpdate(bombNum){
  const mineDisplay = document.querySelector('.results__bomb');
  mines = flags <= bombNum ? (bombNum - flags) : 0;
  mineDisplay.textContent = zeroBeforeNum(4, mines);
}

function zeroBeforeNum(length, number) {
  const digits = ('' + number).length;
  const zerosNum = length - digits;
  return '0'.repeat(zerosNum) + number;
}

function timeDisplayUpdate(){
  const timeDisplay = document.querySelector('.results__time');
  timer = setTimeout(function tick() {
    time++;
    const timeString = getTimeString(time);
    timeDisplay.textContent = timeString;
    timer = setTimeout(tick, 1000);
  }, 1000);
}

function getTimeObj(seconds){
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const sec = seconds - hours * 3600 - minutes * 60;
  return {
    hours: hours.toString(),
    minutes: minutes.toString(),
    seconds: sec.toString(),
  }
}

function getTimeString(seconds) {
  const time = getTimeObj(seconds);
  const strHours = time.hours.length === 2 ? time.hours : ('0' + time.hours);
  const strMinutes = time.minutes.length === 2 ? time.minutes : ('0' + time.minutes);
  const strSecunds = time.seconds.length === 2 ? time.seconds : ('0' + time.seconds);
  const result = `${strHours}:${strMinutes}:${strSecunds}`;
  return result;
}

// win - if a game is over with success
// continue - if a game is not over
function gameStatusCheck(size, bombNum) {
  const openedCellsNum = document.querySelectorAll('.mine-field__cell_opened').length;
  // const flagedCellsNum = document.querySelectorAll('.mine-field__cell_flaged').length;
  if(openedCellsNum === size * size - bombNum){
    return 'win';
  }
  return 'continue';
}

function showAllMines(){
  const mineCells = document.querySelectorAll('[data-code="9"]');
  mineCells.forEach(item => {
    item.classList.remove('mine-field__cell_unopened');
    item.classList.add('mine-field__cell_bombed');
    // if(item.classList.contains('mine-field__cell_flaged')){ // remove flags on mines when game is over
    //   item.classList.remove('mine-field__cell_flaged');
    // }
  })
}

function openAdjacentCells(cell, mineFieldMap){
  const i = +cell.dataset.row;
  const j = +cell.dataset.col;
  
  const upCell = i - 1 < 0 ? null : mineFieldMap[i - 1][j];
  const downCell = i + 1 > mineFieldMap.length - 1 ? null : mineFieldMap[i + 1][j];
  const leftCell = j - 1 < 0 ? null :  mineFieldMap[i][j - 1];
  const rightCell = j + 1 > mineFieldMap.length - 1 ? null :  mineFieldMap[i][j + 1];
  
  if(upCell && !upCell.classList.contains('mine-field__cell_opened')){
    openNearCell(upCell, mineFieldMap);
  }

  if(downCell && !downCell.classList.contains('mine-field__cell_opened')){
    openNearCell(downCell, mineFieldMap);
  }
  
  if(leftCell && !leftCell.classList.contains('mine-field__cell_opened')){
    openNearCell(leftCell, mineFieldMap);
  }
  
  if(rightCell && !rightCell.classList.contains('mine-field__cell_opened')){
    openNearCell(rightCell, mineFieldMap);
  }
}

function openNearCell(cell, mineFieldMap) {
  if(!cell) return;

  if(cell.classList.contains('mine-field__cell_flaged')){
    cell.className = '';
    cell.classList.add('mine-field__cell');
    cell.classList.add('mine-field__cell_unopened');
    cell.classList.add('mine-field__cell_flaged');
    cell.classList.add('mine-field__cell_opened');

    openAdjacentCells(cell, mineFieldMap);
  }
  
  if(+cell.dataset.code === 0 && !cell.classList.contains('mine-field__cell_flaged')){
    cell.classList.remove('mine-field__cell_unopened');
    cell.classList.add('mine-field__cell_opened');
    openAdjacentCells(cell, mineFieldMap);
  }
  
  if(+cell.dataset.code > 0 && cell.dataset.code < 9 && !cell.classList.contains('mine-field__cell_flaged')){
    const cellCode = cell.dataset.code;
    cell.classList.remove('mine-field__cell_unopened');
    cell.classList.add('mine-field__cell_opened');
    cell.textContent = cellCode;
  }
}

function getMineFieldMap(){
  const result = [];
  const rows = document.querySelectorAll('.mine-field__row');
  rows.forEach(item => result.push(item.querySelectorAll('.mine-field__cell')));
  return result;
}

export {firsMoveHandler, flagedCellHandler, cellClickHanlder, resetProcesses, getTimeObj};