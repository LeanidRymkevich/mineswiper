// 9 - if bomb in the cell
// 0 - if around the cell there is no bombs
// number - number of bombs around the cell
function getFieldLayout(size, bombNum, exeptionCell){
  const bombLayout = getBombLayout(size, bombNum, exeptionCell);
  const result = [];
  let row;
  let bombsAround;

  for(let i = 0; i < size; i++){
    row = [];
    for(let j = 0; j < size; j++){
      if(bombLayout[i][j]){ // bomb case
        row.push(9);
      } else { // empty cell case
        bombsAround = getBombNumAround(i, j, bombLayout);
        row.push(bombsAround);
      }
    }
    result.push(row);
  }
  return result;  
}

// exeptionCell = {i, j} - coordinates of cell which is clicked first
// true - bomb is in this cell
// false - bomb is not here
function getBombLayout(size, bombNum, exeptionCell) {
  const bombPlaces = getRandomPairs(bombNum, 0, size - 1, exeptionCell);
  const result = [];
  let row;

  for(let i = 0; i < size; i++){
    row = [];
    for(let j = 0; j < size; j++){
      if(bombPlaces.filter(item => item.i === i && item.j === j).length){
        row.push(true);
      } else {
        row.push(false);
      }
    }
    result.push(row);
  }
  return result;
}

function getRandomPairs(pairsNum, min, max, exeption) {
  const result = [];

  let i;
  let j;
  while(result.length < pairsNum) {
    i = min + Math.floor(Math.random() * (max - min + 1));
    j = min + Math.floor(Math.random() * (max - min + 1));
    if(!(+exeption.i === i && +exeption.j === j) && // to avoid exeption cell
        (result.length === 0 || !result.filter(item => +item.i === i && +item.j === j).length) // to avoid duplicates
      ){
      result.push({i, j});
    }
  }
  return result;
}

// cell = {i,j}
function getBombNumAround(i, j, matrix) {
  let sum = 0;

  // left side
  if(j - 1 >= 0 && i - 1 >= 0 && matrix[i - 1][j - 1]) sum += 1;
  if(j - 1 >= 0 && matrix[i][j - 1]) sum += 1;
  if(j - 1 >= 0 && i + 1 < matrix.length && matrix[i + 1][j - 1]) sum += 1
  // right side
  if(j + 1 < matrix[i].length && i - 1 >= 0 && matrix[i - 1][j + 1]) sum += 1;
  if(j + 1 < matrix[i].length && matrix[i][j + 1]) sum += 1;
  if(j + 1 < matrix[i].length && i + 1 < matrix.length && matrix[i + 1][j + 1]) sum += 1
  // up and down
  if(i - 1 >= 0 && matrix[i - 1][j]) sum += 1;
  if(i + 1 < matrix.length && matrix[i + 1][j]) sum += 1;

  return sum;
}

export default getFieldLayout;