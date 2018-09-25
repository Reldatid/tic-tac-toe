console.log('Working!');

const cells = [];
let playerTurn = 'O';

$(document).ready(function(){
  //3+ layers has problems with formatting. Could be solved with an intermediary div to position it at 33.33% then the 'Cell' can be centered in it at ~90% size.
  //on second thought, any nesting is badly formatted.
  makeGame(2);
})

const makeGame = function(layers){
  const gameBoard = {
    $div: $('<div class="topBoard"></div>'),
    $grid: $('<img src="images/tictactoeBoard.png" />'),
    playerClaims: {
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
    },
    checkForWin: function(id){

      const x = parseInt(id[0]);
      const y = parseInt(id[1]);
      const claims = this.playerClaims[`claimed${playerTurn}`];
      if ( (claims[`x${x}`] === 3) || (claims[`y${y}`] === 3) || (claims.d1 === 3) || (claims.d2 === 3) ){
        alert(`${playerTurn} wins`);
      }
    },
  }
  gameBoard.$div.css({'z-index': -layers,});
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
  this.claimer;
  this.$div = $(`<div class="cell">`);
  this.$div.css({
    left: `${33.33*coOrdinates[0]}%`,
    top: `${33.33*coOrdinates[1]}%`,
    'z-index': -layer,
  });

  if (layer === 0 ){
    this.index = cells.length;
    cells.push(this);
    this.$div.attr('id', `${this.index}`);
    this.$div.on('click', function(){
      let id = $(this).attr('id');
      gameLoop(id);
    })
  } else {
    const $grid =  $('<img src="images/tictactoeBoard.png" />');
    this.$div.append($grid);
    this.newLayer = layer-1;
    this.playerClaims = {
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
    };
    for(let i = 0; i < 3; i ++){
      for (let j = 0; j < 3; j ++){
        const newCell = new Cell(this.newLayer, this, `${j}${i}`);
      }
    }
  }
  parent.$div.append(this.$div);
};

Cell.prototype.updateImage = function(id){
  $image = $(`<img src="images/${this.claimer}.png" />`);
  $(`#${id}`).append($image);
};

Cell.prototype.checkForWin = function(id){
  const x = parseInt(id[0]);
  const y = parseInt(id[1]);
  const claims = this.playerClaims[`claimed${playerTurn}`];
  if ( (claims[`x${x}`] === 3) || (claims[`y${y}`] === 3) || (claims.d1 === 3) || (claims.d2 === 3) ){
    this.claimer = playerTurn;
    this.updateImage(id);
    // this.div.css('z-index': 0);
    parent.checkForWin;
    return;
  }
}

const gameLoop = function(clickedId){
  thisCell = cells[clickedId];
  if ( thisCell.claimer ){
    alert('OI! \nThat square is already taken, get your own.')
  }else{
    thisCell.claimer = playerTurn;
    thisCell.updateImage(clickedId);
    trackClaims(clickedId);
    checkForWin(clickedId);
  }
  // Toggle the playerTurn.
  playerTurn = (playerTurn === 'X') ? 'O' : 'X';
};

const trackClaims = function(claimedId){
  // const board = Math.floor(id/9);
  clickedCell = cells[claimedId];
  coOrdinates = clickedCell.coOrdinates;
  x = parseInt(coOrdinates[0]);
  y = parseInt(coOrdinates[1]);
  claims = clickedCell.parent.playerClaims[`claimed${playerTurn}`];
  claims[`x${x}`] ++;
  claims[`y${y}`] ++;
  if( (x+y)%2 === 0 ){
    if( x === y ){
      claims.d1 ++;
    }
    if(x+y === 2)
    {
      claims.d2 ++;
    }
  }
};

const checkForWin = function(claimedId){
  console.log(claimedId);
  claimedCell = cells[claimedId];
  coOrdinates = claimedCell.coOrdinates;
  claimedCell.parent.checkForWin(coOrdinates);

}
