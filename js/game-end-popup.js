import { getTimeObj } from "./gameLogic.js";

function renderGameEndPopup(where) {
  const popUp = document.createElement('div');
  popUp.className = 'game-end';
  popUp.innerHTML = `
  <div class="game-end__underlay"></div>
  <div class="game-end__content">
    <h2 class="game-end__title">
      <span class="game-end__exclamation"></span>
      <span class="game-end__message"></span>
    </h2>
    <button class="button">Back to restart the game</button>
  </div>
  `;
  popUp.addEventListener('click', (event) => gameEndPopupClickHandler(popUp, event));
  where.append(popUp);
  return popUp;
}

function showGameEndPopup(popUp, gameResults){
  const popupText = getEndPopupText(gameResults);
  const exclamation = popUp.querySelector('.game-end__exclamation');
  const message = popUp.querySelector('.game-end__message');

  exclamation.textContent = popupText.exclamation;
  message.textContent = popupText.message;
  popUp.classList.add('game-end_opened');
  document.body.classList.add('_no-scroll');
}

function getEndPopupText(gameResults){
  if(gameResults.result === 'win'){
    return {
      exclamation: 'Hooray!',
      message: `You found all mines in ${getTimeText(gameResults.time)} and ${gameResults.moves} moves!`
    }
  } else {
    return {
      exclamation: 'Game over!',
      message: `Try again!`
    }
  }
}

function closeGameEndPopup(popUp){
  popUp.classList.remove('game-end_opened');
  document.body.classList.remove('_no-scroll');
}

function getTimeText(seconds) {
  const time = getTimeObj(seconds);
  const hoursStr = getPluralOrSingular('hour', time.hours);
  const minutesStr = getPluralOrSingular('minute', time.minutes);
  const secondsStr = getPluralOrSingular('second', time.seconds);
  const result = (hoursStr + ' ' + minutesStr).trim() + ' ' + secondsStr;
  
  return result.trim();
}

function getPluralOrSingular(item, itemNum){
  return itemNum === 0 ? '' : (itemNum === 1 ? `1 ${item}` : `${itemNum} ${item}s`);
}

function gameEndPopupClickHandler(popUp, event){
  if(event.target.closest('.game-end button') || !event.target.closest('.game-end__content')){
    closeGameEndPopup(popUp);
  }
}

export {renderGameEndPopup, showGameEndPopup,closeGameEndPopup}