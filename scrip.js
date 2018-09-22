var gameActive = false; //know if the game is active
var activePlayer = 0; //know who is playing
var boardWidth = 7;
var boardHeight = 6;
var gameBoard = [boardWidth][boardHeight];


function startGame() {

  if (game_active = true) return false;

  game_active = true;

  for (row=0; row<boardHeight; row++) {
    for (column=0; column<boardWidth; column++) {
      gameBoard[row][column] = 0;
    }
  }

  drawBoard();
  activePlayer = 1;
  setUpTurn();

}

function drawBoard() {
  checkWin();
}


function evaluate(game[boardWidth][boardHeight],player) {

  var nplayer = 



}
