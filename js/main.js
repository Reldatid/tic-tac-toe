console.log('hoy');
//Game controlling vairables
let cellObjs = []; //master cell array
let playerTurn = 'O';
let winner = 'none';
let gameOver = false;
let activeBranch = '0'; //The branch that needs to be played in this turn.
let nextBranch = '0';
let clickedBranch; //The branch that was clicked.
let twigArray = []; //The constructor for next activeBranch.

//Board construction.
let layers = 2;
let treeTop;

//Graphics/Dom manipulation.
let $layerSelect;
let $newBoardButton;
let $litCells = [];
let celebrate;
let hue = 0;

//Takes the requested number of layers and recursively generates smaller boards until there are enough.
const makeBoard = function(layers){
  //Reseting these variable from any previous board.
  activeBranch = '0';
  gameOver = false;
  winner = 'none';
  playerTurn = 'O';
  $('#turnTeller img').attr('src', `images/O.png`);
  cellObjs = [];

  //Make the top layer of the tree and then start making the layers.
  treeTop = new Cell('none', '0', '00', layers);
  makeCellsFor(treeTop, '0', layers);

  //Give the treetop div a special class so it can be rendered differently and append the whole tree to the document.
  treeTop.$div.attr('class', 'topBoard');
  let $container = $('#gameContainer');
  $container.append(treeTop.$div);
}

//Recursive Funtion// Input( Object to hold the cells, the branch of the parent element, how many more layers need to be made.) This works like a depth first search.
const makeCellsFor = function(obj, branch, layers){
  if(layers > 0){ //if we're not at the bottom of the tree,
    let nextBranch = 0; // Tracker for which path is being created.
    for (let i = 0; i < 3; i ++){
      for (let j = 0; j < 3; j ++){
        thisBranch = `${branch}${nextBranch}`; //branch for the next recursion.
        const newCell = new Cell(obj, thisBranch, `${j}${i}`, layers-1); //create the next cell.
        makeCellsFor(newCell, thisBranch, layers-1); //make the layer attached to this cell.
        obj.cells[`${nextBranch}`] = newCell; //attach this new cell to its parents 'cell' object.
        nextBranch ++; //increment and maybe repeat
      }
    }
  }
}

const Cell = function(parent, branch, coOrdinates, layer){
  //store the variables.
  this.parent = parent;
  this.branch = branch;
  this.coOrds = coOrdinates;
  this.layer = layer;
  //Create Dom div, and depending on where in the parent grid it is, apply an offset.
  this.$div = $(`<div class='cell'/>`);
  this.$div.css({
    left: `${coOrdinates[0]*33.33}%`,
    top: `${coOrdinates[1]*33.33}%`,
  });

  if (layer > 0){ //If not the bottom layer
    //create the grid div and give it the right image.
    this.$grid = $("<div class='grid'>");
    let $image = $('<img src="images/tictactoeBoard.png" />');
    this.$grid.append($image);
    this.$div.append(this.$grid);
    this.cells = {};  //create the cells object for the next layer.
    // Win/Tie tracking for this grid. Functionality explained in "trackWin" and "checkForWin".
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

  } else { // Else its the bottom, so:
    this.$div.attr('id', `${cellObjs.length}`); //give the div an id which will be the index of this object in the master array.
    this.$div.on('click', function(){
      let id = $(this).attr('id');
      gameLoop(id); //to be refactored to use a 'that' variable. pretty sure it will make it much neater deeper down the rabbit hole.
    });
    cellObjs.push(this); //add this to the master array for easy access to this object.
    }
  if(this.parent !== 'none'){ //'treeTop' is initialised with "none" as its parent so it will ignore this.
    this.parent.$grid.append(this.$div);
  }
}

Cell.prototype.wasClicked = function(){
  if (this.claimer){ //if truthy(i.e its been initialised)
    console.log("This cell has already been claimed.");
  }else{
    //Checks if this object's branch starts with the active branch.
    if (this.branch.substring(0, activeBranch.length) === activeBranch){
      clickedBranch = this.branch;
      twigArray = []; //Empty the twig.
      this.claimThis({ playerTurn: `${playerTurn}` });
      buildBranch();

      //un-light lit cells, then highlight the cliked cell and the active branch.
      for (let i = 0; i < $litCells.length; i ++){
        $litCells[i].css('background-color', '');
      }
      if(layers > 1){
        highlightCell(treeTop, this.branch.substring(1), 'rgba(255,0,0,.5)');
        highlightCell(treeTop, activeBranch.substring(1), 'rgba(0,255,0,.5)');
      }

      //change the player turn.
      playerTurn = (playerTurn === 'O') ? 'X' : 'O';
      console.log($('#turnTeller img'));
      $('#turnTeller img').attr('src', `images/${playerTurn}.png`);
    }
  }
}


Cell.prototype.claimThis = function(claimer){
  this.claimer = claimer;
  if(this.parent !== 'none'){ // If it has a parent, ie. if its not the treeTop.
    this.parent.trackClaims(this.coOrds, claimer);
    this.parent.checkForWin(this.coOrds);
    this.claimCascade(); //claim the entire branch under this object.
    this.addToTwig(); //add this branch-index to the path for the activebranch for next turn.
  } else { //Else we're claiming the top board, and winning the game.
    console.log(`${claimer} WINS!`);
    winner = claimer;
    gameOver = true;
  }
  this.updateImage();
};

//Recursive Function// claim the entire branch under this object.
Cell.prototype.claimCascade = function () {
  if(this.layer !== 0){
    for (let key in this.cells){ //For each cell in this object
      this.cells[key].claimer = this.claimer; //Claim it.
      this.cells[key].claimCascade(); //recurse for its cells.
    }
  }
};

//Checks for a win along the possible lines that the claimed coOrdinates could complete.
Cell.prototype.checkForWin = function(coOrds){
  const x = parseInt(coOrds[0]);
  const y = parseInt(coOrds[1]);
  if (this.numberOfClaims > 2){ //only check for a win if its been played in enough.
    for (let key in this.playerClaims){ //Have to check both teams because a tied board will run this code.
      const claims = this.playerClaims[key];
      if ( (claims[`x${x}`] === 3) || (claims[`y${y}`] === 3) || (claims.d1 === 3) || (claims.d2 === 3) ){
        player = key[key.length-1];
        this.claimThis( {player: player} );
        return;
      }
    }
    if (this.numberOfClaims >= 9){ // if its been played in 9 times(or more somehow) claim for both.
      this.claimThis({O:'O', X:'X'});
    }
  }
};

//Increment the correct row and column claim trackers.
Cell.prototype.trackClaims = function(coOrds, claimer){
  this.numberOfClaims ++;
  //seperate the coOrds string into x,y bits.
  const x = parseInt(coOrds[0]);
  const y = parseInt(coOrds[1]);
  for( let key in claimer){ // In a tie claim for both, so the object will contain both players.
    let claims = this.playerClaims[`claimed${claimer[key]}`]; //select the correct players
    claims[`x${x}`] ++;
    claims[`y${y}`] ++;
    if( (x+y)%2 === 0 ){ //if x+y is even its on a diagonal.
      if( x === y ){ // if they are equal its on the first diagonal.
        claims.d1 ++;
      }              //can be both diagonals, so no else.
      if(x+y === 2){ // if they add to 2 its on the second diagonal.
        claims.d2 ++;
      }
    }
  }
};

//This takes the last digit in the branch-string, and pushes it onto the twig.
Cell.prototype.addToTwig = function(){
  if( this.layer < layers - 1){ //if this isn't too close to the top.
    twigArray.push( this.branch[this.branch.length-1] );
  }
};

//appends the image of the claimer to the cell div. Can be both players.
Cell.prototype.updateImage = function(){
  for (let key in this.claimer){
    $image = $(`<img src="images/${this.claimer[key]}.png" />`);
    this.$div.append($image);
  }
};

//Replaces the end of the activeBranch with the next turns cell branch to control what can be played in.
const buildBranch = function(){
  const branchBase = clickedBranch.length - twigArray.length - 1; //gets the length of branch to keep.
  nextBranch = clickedBranch.substring(0,branchBase) + twigArray.join(''); //keep part of the cliked branch and replace the end with the cell to be played in next.
  activeBranch = trimBranch(treeTop, nextBranch.substring(1)); //Trim the branch.
};

//Recursive Funtion// Trims the bits of the built branch that have been claimed already.
const trimBranch = function(obj, branch){
  if (obj.claimer) { // If the cell we've dived to has been claimed return the branch without this or anything after it.
    return obj.branch.substring(0, obj.branch.length-1);
  } else if (branch.length < 1){ //else if we got to the bottom and its still unclaimed return the whole branch.
    return nextBranch;
  } else { //else dive deeper.
    return trimBranch(obj.cells[branch[0]], branch.substring(1));
  }
};

//Meant to be the main game loop, but because of limitation with 'this' that I didn't know how to avoid a lot of the main game functionality I wanted got put into "wasClicked". Plan to fix using "that = this".
const gameLoop = function(clickedCellid){
  if(!gameOver){
    cellObj = cellObjs[clickedCellid];
    cellObj.wasClicked();
    if(gameOver){ //If, after claiming is over, the game is over, unlight everything.
      for (let i = 0; i < $litCells.length; i ++){
        $litCells[i].css('background-color', '');
      }
      celebrate = setInterval(function(){ //set up an interval to create Nauseam for the winner.
        const colour = `hsl(${hue}, 100%, 50%)`;
        hue ++;
        treeTop.$div.css('background-color' , `${colour}`);
      }, 5);
    }
  }else {
    //Suggest Reset. Or just alert an obnoxious message.
  }
};

//Debugger tools. Claims any level of branch irrespective of any children.
//Use: give treeTop as obj, and the branch without initial 0.
const claimBranch = function(obj, branchTop){
  if ( branchTop.length === 0 ){
    obj.claimThis({O: 'O'});
  } else {
    console.log(obj);
    claimBranch(obj.cells[branchTop[0]], branchTop.substring(1));
  }
};

//Recursive Function// Given the treetop, a branch and a colour, highlight that cell.
const highlightCell = function(obj, branch, color){
  if (branch.length === 0){
    obj.$div.css('background-color' , `${color}`);
    $litCells.push(obj.$div);
  }else{
    highlightCell(obj.cells[branch[0]], branch.substring(1), color);
  }
}

//Once the document is ready, make a board and give the make new board button a handler.
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
