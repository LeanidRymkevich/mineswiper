function renderMineField(size, where) {
  const newMineField = getMineField(size);
  const prevMineField = where.querySelector('.mine-field');
  if(prevMineField) {
    prevMineField.remove();
  }
  where.append(newMineField);
  return newMineField;
}

function getMineField(size){
  const cellWidth = getCellWidth(size);
  const mineField = document.createElement('div');
  mineField.className = 'mine-field';

  let mineRow;
  let mineCell;
  for(let i = 0; i < size; i++){
    mineRow = document.createElement('div');
    mineRow.className = 'mine-field__row';
    for(let j = 0; j < size; j++) {
      mineCell = document.createElement('div');
      mineCell.className = 'mine-field__cell mine-field__cell_unopened';
      mineCell.dataset.row = i;
      mineCell.dataset.col = j;
      mineCell.style.width = `${cellWidth}px`;
      mineCell.style.height = `${cellWidth}px`;
      mineRow.append(mineCell);
    }
    mineField.append(mineRow);
  }
  return mineField;
}

// to get cell width according to the current window size
function getCellWidth(size) {
  const minScreenWidth = 500;
  const containerWidth = document.querySelector('.container').clientWidth;

  let startCoeff;
  let endCoeff;
  let coeff;

  if(size === 25){
    startCoeff = 1;
    endCoeff = 1.5;
  } else if (size === 15) {
    startCoeff = 1.1;
    endCoeff = 2.5;
  } else {
    startCoeff = 1.5;
    endCoeff = 4;
  }

  coeff = startCoeff + (endCoeff - startCoeff) * (window.innerWidth - minScreenWidth) / 1000;

  return containerWidth / size / coeff;
}

// to resize cells when the window width is changing
function resizeCells(size){
  const cellWidth = getCellWidth(size);
  document.querySelectorAll('.mine-field__cell').forEach(item => {
    item.style.width = `${cellWidth}px`
    item.style.height = `${cellWidth}px`
  })
}

export {renderMineField, getMineField, getCellWidth, resizeCells}