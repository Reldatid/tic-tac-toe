console.log('Working!');

const cells = [];
let playerTurn = 'O';
let nextTurn = '';
let lastTurn = '';
const layers = 2;
let gameBoard;

$(document).ready(function(){
  //3+ layers has problems with formatting. Could be solved with an intermediary div to position it at 33.33% then the 'Cell' can be centered in it at ~90% size.
  //on second thought, any nesting is badly formatted.
  makeGame(layers);
})

const makeGame = function(layers){
  gameBoard = {
    $div: $('<div class="topBoard"></div>'),
    $grid: $('<img src="images/tictactoeBoard.png" />'),
    cells: {},
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
    checkForWin: function(coOrdinates){
      const x = parseInt(coOrdinates[0]);
      const y = parseInt(coOrdinates[1]);
      const claims = this.playerClaims[`claimed${playerTurn}`];
      if ( (claims[`x${x}`] === 3) || (claims[`y${y}`] === 3) || (claims.d1 === 3) || (claims.d2 === 3) ){
        alert(`${playerTurn} wins`);
        this.$div.append($(`<img src="images/${playerTurn}.png" />`));
        this.claimer = playerTurn;
      }
    },
  }
  for (let i = 0; i < this.layers; i ++){
    this.layers[`i`] = {};
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
    // 'z-index': -layer,
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
    this.$div.attr('id', `${this.coOrdinates}`)
    this.$div.append($grid);
    this.cells = {};
    this.newLayer = layer-1;
    this.numberOfClaims = 0;
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
  parent.cells[coOrdinates] = this;
};

Cell.prototype.updateImage = function(){
  if (this.claimer === 'both'){
    $image = $(`<img src="images/O.png" />`);
    this.$div.append($image);
    $image = $(`<img src="images/X.png" />`);
    this.$div.append($image);
    return;
  }
  $image = $(`<img src="images/${this.claimer}.png" />`);
  this.$div.append($image);
};

Cell.prototype.checkForWin = function(coOrdinates){
  const x = parseInt(coOrdinates[0]);
  const y = parseInt(coOrdinates[1]);
  const claims = this.playerClaims[`claimed${playerTurn}`];
  if (this.numberOfClaims < 9){
    if ( (claims[`x${x}`] === 3) || (claims[`y${y}`] === 3) || (claims.d1 === 3) || (claims.d2 === 3) ){
      this.claimer = playerTurn;
      this.$div.css('z-index', 5);
      this.updateImage();
      trackClaims(this);
      this.parent.checkForWin(this.coOrdinates);
      return;
    }
  }else{
    this.claimer = 'both';
    this.updateImage();
    trackClaims(this);
    this.parent.checkForWin(this.coOrdinates);
  }
}

const gameLoop = function(clickedId){
  thisCell = cells[clickedId];
  coOrds = thisCell.coOrdinates;
  if ( thisCell.claimer || thisCell.parent.claimer){
    alert('OI! \nThat square is already taken, get your own.')
    return;
  } else if (thisCell.parent.coOrdinates === nextTurn || nextTurn === ''){
    thisCell.claimer = playerTurn;
    thisCell.updateImage(clickedId);
    trackClaims(thisCell);
    thisCell.parent.checkForWin(thisCell.coOrdinates);
    if (layers > 1){
      console.log(coOrds);
      console.log(thisCell.parent.parent.cells[coOrds].claimer);
      nextTurn = (thisCell.parent.parent.cells[coOrds].claimer) ? '' : coOrds;
      console.log(nextTurn);
    }
    // Toggle the playerTurn.
    playerTurn = (playerTurn === 'X') ? 'O' : 'X';
  } else {
    console.log("invalid square");
  }
};

const trackClaims = function(cell){
  currentCell = cell;
  coOrdinates = currentCell.coOrdinates;
  x = parseInt(coOrdinates[0]);
  y = parseInt(coOrdinates[1]);
  currentCell.parent.numberOfClaims ++;
  if (cell.claimer === 'both'){
    for (let key in currentCell.parent.playerClaims){
      claims = currentCell.parent.playerClaims[key];
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
    }
  } else {
    claims = currentCell.parent.playerClaims[`claimed${playerTurn}`];
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
  }
};
