console.log('hoy');
const cellObjs = [];
let playerTurn = 'O';
let winner = 'none';
let gameOver = false;

let layers = 2;
let treeTop;
let activeBranch = '0';
let nextBranch = '0';
let clickedBranch;
let twigArray = [];

let $layerSelect;
let $newBoardButton;
let $litCells = [];
let hue = 0;

const makeBoard = function(layers){
  treeTop = new Cell('none', '0', '00', layers);
  activeBranch = '0';
  gameOver = false;
  winner = 'none';
  playerTurn = 'O';
  makeCellsFor(treeTop, '0', layers);
  let $container = $('#gameContainer');
  $container.append(treeTop.$div);
  treeTop.$div.attr('class', 'topBoard');
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
  });

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
      clickedBranch = this.branch;
      twigArray = [];
      this.claimThis({ playerTurn: `${playerTurn}` });
      buildBranch();
      for (let i = 0; i < $litCells.length; i ++){
        $litCells[i].css('background-color', '');
      }
      if(layers > 1){
        highlightCell(treeTop, this.branch.substring(1), 'rgba(255,0,0,.5)');
        highlightCell(treeTop, activeBranch.substring(1), 'rgba(0,255,0,.5)');
      }
      playerTurn = (playerTurn === 'X') ? 'O' : 'X';
      $('#turnTeller').html(`${playerTurn}'s turn`);
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
    console.log(`${claimer} WINS!`);
    winner = claimer;
    gameOver = true;
  }
  this.updateImage();
};

Cell.prototype.claimCascade = function () {
  if(this.layer !== 0){
    for (let key in this.cells){
      this.cells[key].claimer = this.claimer;
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
    this.claimThis({O:'O', X:'X'});
  }
};

Cell.prototype.trackClaims = function(coOrds, claimer){
  this.numberOfClaims ++;
  const x = parseInt(coOrds[0]);
  const y = parseInt(coOrds[1]);
  for( let key in claimer){
    let claims = this.playerClaims[`claimed${claimer[key]}`];
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

Cell.prototype.addToTwig = function(){
  if( this.layer < layers - 1){
    twigArray.push( this.branch[this.branch.length-1] );
  }
};

Cell.prototype.updateImage = function(){
  for (let key in this.claimer){
    $image = $(`<img src="images/${this.claimer[key]}.png" />`);
    this.$div.append($image);
  }
};

const buildBranch = function(){
  // console.log(`clickedBranch: ${clickedBranch}`);
  // console.log(`Current Twig: ${twigArray.join('')}`);
  const clickedArr = clickedBranch.split('');
  const twigBase = clickedBranch.length - twigArray.length - 1;
  nextBranch = clickedBranch.substring(0,twigBase) + twigArray.join('');
  // console.log(`nextBranch: ${nextBranch}`);
  activeBranch = trimBranch(treeTop, nextBranch.substring(1));
};

const trimBranch = function(obj, branch){
  // console.log(obj.layer);
  // console.log(`Obj Branch: ${obj.branch}`);
  // console.log(`Branch: ${branch}`);
  // console.log(`Claimer: ${obj.claimer}`);
  if (obj.claimer) {
    return obj.branch.substring(0, obj.branch.length-1);
  } else if (branch.length < 1){
    return nextBranch;
  } else {
    return trimBranch(obj.cells[branch[0]], branch.substring(1));
  }
};

const gameLoop = function(clickedCellid){
  if(!gameOver){
    cellObj = cellObjs[clickedCellid];
    cellObj.wasClicked();
    if(gameOver){
      for (let i = 0; i < $litCells.length; i ++){
        $litCells[i].css('background-color', '');
      }
      let celebrate = setInterval(function(){
        const colour = `hsl(${hue}, 100%, 50%)`;
        hue ++;
        treeTop.$div.css('background-color' , `${colour}`);
      }, 5);
    }
  }else {
    //Suggest Reset. Or just alert an obnoxious message.
  }
};

//Use: give treeTop as obj, and the branch without initial 0.
const claimBranch = function(obj, branchTop){
  if ( branchTop.length === 0 ){
    obj.claimThis({O: 'O'});
  } else {
    claimBranch(obj.cells[branchTop[0]], branchTop.substring(1));
  }
};

const highlightCell = function(obj, branch, color){
  if (branch.length === 0){
    obj.$div.css('background-color' , `${color}`);
    $litCells.push(obj.$div);
  }else{
    highlightCell(obj.cells[branch[0]], branch.substring(1), color);
  }
};

const

tree = {
  cells: {},
  $grid: $('<div class="grid"></div>'),
};

$(document).ready(function(){
  makeBoard(layers);
  $layerSelect = $('#layers')
  $newBoardButton = $('#makeNewBoard')
  $newBoardButton.on('click', function(){
    layers = parseInt($layerSelect.val());
    $('.topBoard').remove();
    makeBoard(layers);
    clearInterval(celebrate);
  });
});
