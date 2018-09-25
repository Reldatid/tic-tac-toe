console.log('Working!');

let cells = [];

$(document).ready(function(){
  //3+ layers has problems with formatting. Could be solved with an intermediary div to position it at 33.33% then the 'Cell' can be centered in it at ~90% size.
  makeGame(3);
})

const makeGame = function(layers){
  const gameBoard = {
    $div: $('<div class="topBoard"></div>'),
    $grid: $('<img src="images/tictactoeBoard.png" />'),
  }
  gameBoard.$div.css({
    width: '100%',
    height: '100%',
    position: 'absolute',
    'z-index': -layers,
  });
  nextLayer = layers-1;
  for(let i = 0; i < 3; i ++){
    for (let j = 0; j < 3; j ++){
      const newCell = new Cell(nextLayer, gameBoard, `${j}${i}`);
    }
  }
  gameBoard.$div.append(gameBoard.$grid);
  $('#gameContainer').append(gameBoard.$div);
};

const Cell = function(layer, parent, coOrdinates){
  this.layer = layer;
  this.parent = parent;
  this.coOrdinates = coOrdinates;
  this.$div = $(`<div class="cell">`)

  if (layer === 0 ){
    this.index = cells.length;
    cells.push(this);
    this.$div.attr('id', `${this.index}`);
    this.$div.css({
      left: `${33.33*coOrdinates[0]}%`,
      top: `${33.33*coOrdinates[1]}%`,
      'z-index': layer,
    });
    this.$div.on('click', function(){
      let id = $(this).attr('id');
      gameLoop(id);
    })
  } else {
    this.$div.css({
      left: `${33.33*coOrdinates[0]}%`,
      top: `${33.33*coOrdinates[1]}%`,
      'z-index': -layer,
    });
    const $grid =  $('<img src="images/tictactoeBoard.png" />');
    this.$div.append($grid);
    this.newLayer = layer-1;
    for(let i = 0; i < 3; i ++){
      for (let j = 0; j < 3; j ++){
        const newCell = new Cell(this.newLayer, this, `${j}${i}`);
      }
    }
  }
  parent.$div.append(this.$div);
};


const gameLoop = function(clickedId){

}
