console.log('Working!');
let test;

$(document).ready(function(){
  test = new Board(gridSize);
});

// Global Variables:
  const gridSize = 3;
  let playerTurn = 'X';

  claims = {
    claimedO: {
      x0: 0,
      x1: 0,
      x2: 0,
      y0: 0,
      y1: 0,
      y2: 0,
      d1: 0,
      d2: 0,
    },
    claimedX: {
      x0: 0,
      x1: 0,
      x2: 0,
      y0: 0,
      y1: 0,
      y2: 0,
      d1: 0,
      d2: 0,
    },
  }
// Global Variables end.




// Array of arrays of objects for the board.
  // On

const Board = function(size){
  this.cells = []; // An array of arrays.   (for the dummies...   (for me, I'm the dummy.))
  this.div = $('<div class="board">');
  this.size = size;
  this.div.css({
    width: 600,
    height: 600,
    position: 'relative',
    top: '50px',
    left: '100px',
  });
  $('#gameContainer').append(this.div)
  for (let i = 0; i < size; i ++){
    let column = [];
    for (let j = 0; j < size; j ++){
      column.push(new Cell(i,j,this.div));
    }
    this.cells.push(column);
  }
}


const Cell = function(x,y,parent){
  this.coOrdX = x;
  this.coOrdY = y;
  this.winner = null;
  this.offsetX = x*200;
  this.offsetY = y*200;
  this.div = $(`<div class="cell" id='${x}${y}'>`);
  this.div.on('click', function(){
    gameLogic(this);
  })
  parent.append(this.div);
  this.div.css({
    position: 'absolute',
    margin: '0px',
    border: '0px',
    width: '33.33%',
    height: '33.33%',
    top: `${this.offsetX}px`,
    left: `${this.offsetY}px`,
    'background-color': '#FF0000',
  });
}

Cell.prototype.clicked = function(){

}

const trackClaims = function(player, x, y){
  const playersClaims = claims[`claimed${player}`];
  playersClaims[`x${x}`] ++;
  playersClaims[`y${y}`] ++;
  if( x+y%2 ===0 ){
    if( x===y ){
      playersClaims['d1'];
    }
    if(x+y === 2)
    {
      playersClaims['d2'];
    }
  }
}

const checkForWin = function(player){
  for (let key in claims[`claimed${player}`]){
    console.log("checking");
    if (claims[`claimed${player}`][key] === 3){
      alert(`${player} WINS!`);
    }
  }
}

const gameLogic = function(clickedCell){
  $(clickedCell).html(playerTurn);
  $(clickedCell).off('click');
  cellId = $(clickedCell).attr('id');
  test.cells[cellId[0]][cellId[1]].winner = playerTurn;
  trackClaims(playerTurn, cellId[0], cellId[1]);
  checkForWin(playerTurn);

  if (playerTurn === 'X'){
    playerTurn = 'O';
  }else if (playerTurn === 'O'){
    playerTurn = 'X';
  }
}
