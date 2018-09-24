console.log('Working!');


let gridSize = 3;
$(document).ready(function(){
  let test = new Board(gridSize);
});

// Global Variables:

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
    top: '100px',
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
  this.offsetX = x*200;
  this.offsetY = y*200;
  this.div = $('<div class="cell">');
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
