let scores = getScoresFromStorage();
const scoresSavedNum = 10;

function renderEmptyScorePopup(where) {
  const score = document.createElement('div');
  score.className = 'score';
  score.innerHTML = `
    <div class="score__underlay"></div>
      <div class="score__content">
        <h2 class="score__title">Scores</h2>
        <button class="score__button">X</button>
        <ul class="score__list">
          <li class="score__header">
            <span class="score__number">№</span>
            <span class="score__moves">Moves</span>
            <span class="score__time">Time</span>
          </li>
          </ul>
      </div>
    </div>
  `;
  score.addEventListener('click', (event) => scorePopupClickHandler(score, event));
  where.append(score);
  return score;
}

function showScore(scoreElem) {
  fillWithScores(scoreElem, scores);
  scoreElem.classList.add('score_opened');
  document.body.classList.add('_no-scroll');
}

function closeScore(scoreElem) {
  scoreElem.classList.remove('score_opened');
  document.body.classList.remove('_no-scroll');
}

function scorePopupClickHandler(scoreElem, event){
  if(event.target.closest('.score__button') || !event.target.closest('.score__content')){
    closeScore(scoreElem);
  }
}

function scoreUpdate(){
  const movesDisplay = document.querySelector('.results__moves');
  const timeDisplay = document.querySelector('.results__time');
  const moves = movesDisplay.textContent;
  const time = timeDisplay.textContent;
  const score = {
    moves,
    time,
  }
  if(scores.length === scoresSavedNum) {
    scores.shift();
  }
  scores.push(score);
}

function updateScoresOnGameOver(event){
  if(event.detail.result !== 'win') return;
  scoreUpdate();
}

function getScoreHTML(score, number){
  const scoreLi = document.createElement('li');
  scoreLi.className = 'score__item';
  scoreLi.innerHTML = `
  <span class="score__number">${number}</span>
  <span class="score__moves">${score.moves}</span>
  <span class="score__time">${score.time}</span>
  `;
  return scoreLi;
}

function fillWithScores(scoreElem, scores) {
  const scoreList = scoreElem.querySelector('.score__list');
  const scoreItems = scoreList.querySelectorAll('.score__item');

  scoreItems.forEach(item => item.remove());
  scores.forEach((item, index) => scoreList.append(getScoreHTML(item, index + 1)));
}

function beforeUnloadHandler(){
  const note = JSON.stringify(scores);
  localStorage.setItem('scores', note);
}

function getScoresFromStorage() {
  const note = localStorage.getItem('scores');
  if(!note || note === '[]' || !JSON.parse(note)) {
    return [];
  } else {
    return JSON.parse(note);
  }
}

// listeners
document.body.addEventListener('gameOver', updateScoresOnGameOver);
window.addEventListener('beforeunload', beforeUnloadHandler);

export {renderEmptyScorePopup, showScore};