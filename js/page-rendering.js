import ThemeChanger from "./ThemeChanger.js";

const scoreBtnText = 'Best scores';
const titleText = 'Minesweeper';

const soundOnBtnInnerHTML = `
<svg fill="none" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
  <path class="path" d="M8.74641 1.06494C8.90313 1.1537 9 1.31989 9 1.5V13.5C9 13.6801 8.9031 13.8463 8.74635
           13.9351C8.58959 14.0239 8.39722 14.0214 8.24275 13.9287L3.36151 11H1.5C0.672066 11 0 
           10.329 0 9.5V5.49739C0 4.66798 0.672491 3.99804 1.5 3.99804H3.36159L8.24288 1.07118C8.39735 
           0.978558 8.58969 0.976173 8.74641 1.06494Z"/>
  <path class="path" d="M13.8535 4.14438L13.4998 3.79094L12.793 4.49827L13.1444 4.84953L13.1466 4.85184C13.1502 
           4.85561 13.1571 4.86308 13.1669 4.87426C13.1864 4.89663 13.2175 4.93374 13.2564 4.98555C13.3342
           5.08924 13.4428 5.2512 13.5529 5.47128C13.7723 5.90979 14.0001 6.58318 14.0001 7.49609C14.0001 
           8.409 13.7723 9.08238 13.5529 9.5209C13.4428 9.74097 13.3342 9.90294 13.2564 10.0066C13.2175 
           10.0584 13.1864 10.0955 13.1669 10.1179C13.1571 10.1291 13.1502 10.1366 13.1466 10.1403L13.1445 
           10.1426L12.793 10.4939L13.4998 11.2012L13.8535 10.8478L13.5001 10.4941C13.8535 10.8478 13.8533 
           10.848 13.8535 10.8478L13.8543 10.8471L13.8551 10.8462L13.857 10.8443L13.862 10.8392L13.876 
           10.8245C13.8871 10.8127 13.9017 10.7967 13.9192 10.7767C13.9543 10.7366 14.0014 10.68 14.0562 
           10.6069C14.1659 10.4607 14.3073 10.2479 14.4472 9.96835C14.7278 9.40751 15.0001 8.58188 15.0001 
           7.49609C15.0001 6.4103 14.7278 5.58467 14.4472 5.02383C14.3073 4.74423 14.1659 4.53144 14.0562 
           4.3853C14.0014 4.31219 13.9543 4.25561 13.9192 4.21551C13.9017 4.19546 13.8871 4.17951 13.876 
           4.16767L13.862 4.15296L13.857 4.1479L13.8551 4.14595L13.8543 4.14511C13.8541 4.14493 13.8535 
           4.14438 13.5001 4.49804L13.8535 4.14438Z"/>
</svg>
`;

const soundOffBtnInnerHTML = `
  <svg fill="none" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
    <path class="path" d="M9 1.5C9 1.31989 8.90313 1.1537 8.74641 1.06494C8.58969 0.976173 8.39734 0.978558 
    8.24288 1.07118L3.36159 3.99805H1.5C0.671218 3.99805 0 4.66817 0 5.49731V9.5C0 10.3287 0.67074 
    11 1.5 11H3.36151L8.24275 13.9287C8.39722 14.0214 8.58959 14.0239 8.74635 13.9351C8.9031 13.8463 
    9 13.6801 9 13.5V1.5Z"/>
  <path class="path" d="M13.2075 7.49622L14.6211 8.90895L13.9142 9.61629L12.5001 8.20309L11.086 9.61629L10.3792
    8.90895L11.7928 7.49622L10.3789 6.08324L11.0858 5.3759L12.5001 6.78934L13.9145 5.3759L14.6214 
    6.08324L13.2075 7.49622Z"/>
  </svg>
`;

function renderPage(theme) {
  const layout = getPageLayout(theme);
  document.body.append(layout);
}

function getPageLayout(theme) {
  const container = document.createElement('div');
  const pageTitle = document.createElement('h1');
  const menu = getMenu(theme);
  const results = getResults();
  const mineFieldContainer = document.createElement('div');

  container.className = 'container';
  pageTitle.className = 'title';
  mineFieldContainer.className = 'mine-field-container';
  pageTitle.textContent = titleText;

  container.append(pageTitle);
  container.append(menu);
  container.append(results);
  container.append(mineFieldContainer);

  return container;
}

function getMenu(theme){
  const themeChanger = new ThemeChanger(theme);
  const menu = document.createElement('div');
  const themeBtn = themeChanger.getTrigger();
  const scoreBtn = document.createElement('button');
  const muteBtn = document.createElement('button');
  const gameOptions = getGameOptions();

  menu.className = 'menu';
  themeBtn.className = 'button';
  scoreBtn.className = 'button';
  muteBtn.className = 'mute-button';
  themeBtn.dataset.btnFunc = 'theme change';
  scoreBtn.dataset.btnFunc = 'show scores';
  scoreBtn.textContent = scoreBtnText;
  muteBtn.innerHTML = soundOnBtnInnerHTML;

  menu.append(themeBtn);
  menu.append(scoreBtn);
  menu.append(muteBtn);
  menu.append(gameOptions);

  return menu;
}

function getGameOptions(){
  const gameOptions = document.createElement('div');
  const complexity = getComplexity();
  const minesNumber = getMinesNumber();

  gameOptions.className = 'game-options';

  gameOptions.append(complexity);
  gameOptions.append(minesNumber);

  return gameOptions;
}

function getComplexity() {
  const complexity = document.createElement('div');
  complexity.className = 'complexity';
  complexity.innerHTML = `
    <label class="complexity__label" for="level">Complexity</label>
    <select class="complexity__select" id="level">
      <option class="complexity__option" value="easy">Easy</option>
      <option class="complexity__option" value="medium">Medium</option>
      <option class="complexity__option" value="hard">Hard</option>
    </select>
  `;
  return complexity;
}

function getMinesNumber() {
  const minesNumber = document.createElement('div');
  minesNumber.className = 'mines-number';
  minesNumber.innerHTML = `
    <label class="mines-number__label" for="mines-number__input">Mines number</label>
    <input type="number" id="mines-number__input" class="mines-number__input" min="10" max="99" value="10" placeholder="10-99 bombs">
  `;
  return minesNumber;
}

function getResults() {
  const results = document.createElement('div');
  results.className = 'results';
  results.innerHTML = `
    <div class="results__cell">
      <h3 class="results__header">Remain bomb</h3>
      <div class="results__bomb">0000</div>
    </div>
    <div class="results__cell">
      <h3 class="results__header">Flags</h3>
      <div class="results__flags">0000</div>
    </div>
    <div class="results__cell">
      <button data-btn-func="restart game" class="button grid-item">Restart game</button>
    </div>
    <div class="results__cell">
      <h3 class="results__header">Moves</h3>
      <div class="results__moves">0000</div>
    </div>
    <div class="results__cell">
      <h3 class="results__header">Time</h3>
      <div class="results__time">00:00:00</div>
    </div>
  `;
  return results;
}

export {renderPage, soundOnBtnInnerHTML, soundOffBtnInnerHTML};