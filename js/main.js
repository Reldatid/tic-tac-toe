console.log('hoy');
const layers = 2;
const activeBranch = '';
const clickables = [];
let tree = {};

const makeBoard = function(){
  makeCellsFor(tree, '0', layers);
  let $container = $('#gameContainer');
  $container.append(tree.$grid);
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
    this.$div.attr('id', `${clickables.length}`);
    this.$div.on('click', function(){

    })
    clickables.push(this);
  }
  this.parent.$grid.append(this.$div);
}


tree = {
  cells: {},
  $grid: $('<div class="grid"></div>'),
};

$(document).ready(function(){
  makeBoard();
});
