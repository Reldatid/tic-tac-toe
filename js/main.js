console.log('hoy');
const layers = 1;
const cellObjs = [];
let playerTurn = 'O';
let winner = 'none';
let gameOver = false;

let treeTop;
let activeBranch = '0';
let nextBranch = '0';
let clickedBranch;
let twigArray = [];

const makeBoard = function(){
  treeTop = new Cell('none', '0', '00', layers);
  makeCellsFor(treeTop, '0', layers);
  let $container = $('#gameContainer');
  $container.append(treeTop.$div);
  tree.$grid.append($('<img src="images/tictactoeBoard.png" />'));
}

//Inititalise branch as 0, and layers as the number of times to nest. layers > 1.
const makeCellsFor = function(obj, branch, layers){
  if(layers > 0){
    let nextBranch = 0;
    for (let i = 0; i < 3; i ++){
      for (let j = 0; j < 3; j ++){
        thisBranch = `${branch}${nextBranch}`;
        const newCell = new Cell(obj, thisBranch, `${j}${i}`, layers-1);
        makeCellsFor(newCell, thisBranch, layers-1);
        obj.cells[`${nextBranch}`] = newCell;
        nextBranch ++;
      }
    }
  }
}

const Cell = function(parent, branch, coOrdinates, layer){
  this.parent = parent;
  this.branch = branch;
  this.coOrds = coOrdinates;
  this.layer = layer;
  this.$div = $(`<div class='cell'/>`);
  this.$div.css({
    left: `${33.33*coOrdinates[0]}%`,
    top: `${33.33*coOrdinates[1]}%`,
  })

  if (layer > 0){
    this.$grid = $("<div class='grid'>");
    let $image = $('<img src="images/tictactoeBoard.png" />');
    this.$grid.append($image);
    this.$div.append(this.$grid);
    this.cells = {};
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

  }else{
    this.$div.attr('id', `${cellObjs.length}`);
    this.$div.on('click', function(){
      let id = $(this).attr('id');
      gameLoop(id);
    })
    cellObjs.push(this);
  }
  if(this.parent !== 'none'){
    this.parent.$grid.append(this.$div);
  }
}

Cell.prototype.wasClicked = function(){
  if (this.claimer){
    console.log("This cell has already been claimed.");
  }else{
    if (this.branch.substring(0, activeBranch.length) === activeBranch){
      console.log('');
      clickedBranch = this.branch;
      twigArray = [];
      this.claimThis(playerTurn);
      buildBranch();
      playerTurn = (playerTurn === 'X') ? 'O' : 'X';
    }
  }
}

Cell.prototype.claimThis = function(claimer){
  this.claimer = claimer;
  if(this.parent !== 'none'){
    this.parent.trackClaims(this.coOrds, claimer);
    this.parent.checkForWin(this.coOrds);
    this.claimCascade();
    this.addToTwig();
  } else {
    winner = claimer;
    gameOver = true;
  }
  this.updateImage();
  console.log(`${this.branch}: ${this.claimer}`);
};

Cell.prototype.claimCascade = function () {
  if(this.layer !== 0){
    for (let key in this.cells){
      this.cells[key].claimer = 'O';
      this.cells[key].claimCascade();
    }
  }
};

Cell.prototype.checkForWin = function(coOrds){
  const x = parseInt(coOrds[0]);
  const y = parseInt(coOrds[1]);
  const claims = this.playerClaims[`claimed${playerTurn}`];
  if (this.numberOfClaims < 9){
    if ( (claims[`x${x}`] === 3) || (claims[`y${y}`] === 3) || (claims.d1 === 3) || (claims.d2 === 3) ){
      this.claimThis(playerTurn);
      return;
    }
  }else{
    this.claimThis('O');
    this.claimThis('X');
    this.claimer = 'both';
  }
};

Cell.prototype.trackClaims = function(coOrds, claimer){
  claims = this.playerClaims[`claimed${claimer}`];
  const x = parseInt(coOrds[0]);
  const y = parseInt(coOrds[1]);
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

Cell.prototype.addToTwig = function(){
  if( this.layer < layers - 1){
    twigArray.push( this.branch[this.branch.length-1] );
  }
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

const buildBranch = function(){
  // console.log(`clickedBranch: ${clickedBranch}`);
  // console.log(`Current Twig: ${twigArray.join('')}`);
  const clickedArr = clickedBranch.split('');
  const twigBase = clickedBranch.length - twigArray.length - 1;
  nextBranch = clickedBranch.substring(0,twigBase) + twigArray.join('');
  // console.log(`nextBranch: ${nextBranch}`);
  activeBranch = trimBranch(treeTop, nextBranch.substring(1));
  console.log(`Next Active: ${activeBranch}`);
}

const trimBranch = function(obj, branch){
  console.log(obj.layer);
  console.log(`Obj Branch: ${obj.branch}`);
  console.log(`Branch: ${branch}`);
  console.log(`Claimer: ${obj.claimer}`);
  if (obj.claimer) {
    return obj.branch.substring(0, obj.branch.length-1);
  } else if (branch.length < 1){
    return nextBranch;
  } else {
    return trimBranch(obj.cells[branch[0]], branch.substring(1));
  }
}

const gameLoop = function(clickedCellid){
  if(!gameOver){
    cellObj = cellObjs[clickedCellid];
    cellObj.wasClicked();
  }else {
    //Suggest Reset. Or just alert an obnoxious message.
  }
}

tree = {
  cells: {},
  $grid: $('<div class="grid"></div>'),
};

$(document).ready(function(){
  makeBoard();
});
