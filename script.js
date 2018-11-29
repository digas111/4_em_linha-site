
var gameActive = false; //know if the game is active
var activePlayer = 1; //know who is playing
var gameBoard = []; //will be a multi-demensional array later on

var boardWidth = 7;
var boardHeight = 6;

var difficulty = 6;


function startGame() {

  var button = document.getElementById("playButton");
  button.innerHTML = "Reiniciar";
  
  var depthId = document.getElementById("tamanhoTabuleiro");
  var size = depthId.options[depthId.selectedIndex].value;

  if (size == 1) {
    boardWidth = 6;
    boardHeight = 5;
  }
  else if (size == 2) {
    boardWidth = 7;
    boardHeight = 6;
  }
  else if (size == 3) {
    boardWidth = 8;
    boardHeight = 7;
  }

  if (gameActive == true) {
    gameActive = false;
    deleteBoard();
    startGame();
    return;
  }

  gameActive = true;

  console.log("Game started");

  for (var i = 0; i < boardWidth; i++) {
    gameBoard[i] = [];
    for (var j = 0; j < boardHeight; j++) {
      gameBoard[i][j] = 0;
    }
  }

  drawBoard(); //cal the function to draw the board
  //valta ferificador para ver quem joga primeiro

  if (document.getElementById("first").checked == false) {
    bot_play();
  }
  else {
    printPlayer(1);
  }
  

}

function drawBoard() {
  console.log("started printing game");

  deleteBoard();

  for (var i = 0; i < boardWidth; i++) {
    var col = document.createElement("div");
    col.classList.add("column");
    col.id = i;
    col.onclick = function () {
      play(this.id, 1);
    };
    var game = document.getElementById("game");
    game.appendChild(col);

    for (var j = 0; j < boardHeight; j++) {
      var piece = document.createElement("div");
      piece.classList.add("player_" + gameBoard[i][j]);
      piece.id = i + "_" + j;
      col.appendChild(piece);
    }
  }

  console.log("game was printed");

}

function giveUp() {
  deleteBoard();
  deletePlayer();
  var button = document.getElementById("playButton");
  button.innerHTML = "Jogar!";
}

function deleteBoard() {
  console.log("started deleting board");

  for (var i = 0; i < boardWidth; i++) {
    for (var j = 0; j < boardHeight; j++) {

      var board = document.getElementById("game");

      while (board.firstChild) {
        board.removeChild(board.firstChild);
      }
    }
  }

  console.log("finished deleting board");

}

function winner(tempBoard) {

  //check vertical

  var counter = 0;

  for (var i = 0; i < boardWidth; i++) {
    for (var j = 0; j < boardHeight; j++) {
      if (tempBoard[i][j] == activePlayer) {
        counter++;
      }
      else {
        counter = 0;
      }
      if (counter == 4) {
        return true;
      }
    }
    counter = 0;
  }

  counter = 0;
  //check horizontal

  for (var j = 0; j < boardHeight; j++) {
    for (var i = 0; i < boardWidth; i++) {
      if (tempBoard[i][j] == activePlayer) {
        counter++;
      }
      else {
        counter = 0;
      }
      if (counter == 4) {
        return true;
      }
    }
    counter = 0;
  }

  counter = 0;
  //check diagonal left-to-right

  for (var i = 0; i < boardHeight - 3; i++) {
    for (var j = 0; j < boardWidth - 3; j++) {
      for (var t = 0; t < 4; t++) {
        if (tempBoard[i + t][j + t] == activePlayer) {
          counter++;
        }
        else {
          counter = 0;
        }
        if (counter == 4) {
          return true;
        }
      }
      counter = 0;
    }
  }

  counter = 0;


  //check diagonal right-to-left

  for (var i = boardWidth - 1; i > 2; i--) {
    for (var j = 0; j < boardWidth - 3; j++) {
      for (var t = 0; t < 4; t++) {
        if (tempBoard[i - t][j + t] == activePlayer) {
          counter++;
        }
        else {
          counter = 0;
        }
        if (counter == 4) {
          return true;
        }
      }
      counter = 0;
    }
  }

}

function full(tempBoard) {
  for (var i = 0; i < boardWidth; i++) {
    if (tempBoard[i][0] == 0) {
      return false;
    }
  }
  return true;
}

function find_row(currentBoard, column) {
  for (var j = 0; j < boardHeight; j++) {
    if (currentBoard[column][j] != 0) {
      return j - 1;
    }
  }
  return -1;
}



function close_input() {
  for (var i = 0; i < boardWidth; i++) {
    var delcol = document.getElementById(i);
    delcol.onclick = 0;
    delcol.classList.remove("column");
    delcol.classList.add("column_no_hover");
  }
}

function bot_play() {

  printPlayer(2);
  activePlayer = 2;

  var col = Math.floor((Math.random() * (boardWidth)) + 0);

  console.log("alphabeta escolheu :" + col);

  if (gameBoard[col][0] != 0) return false; //acrescentar erro
  for (var j = 0; j < boardHeight - 1; j++) {
    if (gameBoard[col][j + 1] != 0) {
      gameBoard[col][j] = activePlayer;
      print_board_to_console();
      drawBoard();
      if (winner(gameBoard)) {
        win_bot();
        return;
      }
      printPlayer(1);
      return;
    }
  }

  gameBoard[col][boardHeight - 1] = activePlayer;
  print_board_to_console();
  drawBoard();
  if (winner(gameBoard)) {
    win_bot();
    return;
  }
  printPlayer(1);

}

function play(col, _player) {

  
  activePlayer = 1;
  

  if (gameBoard[col][0] != 0) {






    return false;
  }

  for (var j = 0; j < boardHeight - 1; j++) {
    if (gameBoard[col][j + 1] != 0) {
      gameBoard[col][j] = _player;
      print_board_to_console();
      drawBoard();
      if (winner(gameBoard)) {
        win_player();
        return;
      }
      console.log("bot play");
      printPlayer(2);
      close_input();
      setTimeout(bot_play,2000);
      //bot_play();
      return;
    }
  }

  gameBoard[col][boardHeight - 1] = _player;
  print_board_to_console();
  drawBoard();
  if (winner(gameBoard)) {
    win_player();
    return;
  }
  console.log("bot play");
  printPlayer(2);
  close_input();
  setTimeout(bot_play,2000);
  //bot_play();
}

// function messageFull() {

//   for (var i = 0; i < boardWidth; i++) {
//     var col = document.getElementById(i);
//     col.onclick = 0;
//     col.classList.remove("column");
//     col.classList.add("column_no_hover");
//   }

//   var splash = document.createElement("div");
//   splash.classList.add("finish");
//   splash.innerHTML = "<h3>Coluna Cheia</h3>";
//   var game = document.getElementById("game");
//   game.appendChild(splash);

// }

function win_player() {

  for (var i = 0; i < boardWidth; i++) {
    var col = document.getElementById(i);
    col.onclick = 0;
    col.classList.remove("column");
    col.classList.add("column_no_hover");
  }

  var splash = document.createElement("div");
  splash.classList.add("finish");
  splash.innerHTML = "<h3>Ganhaste!</h3>";
  var game = document.getElementById("game");
  game.appendChild(splash);
}

function win_bot() {

  for (var i = 0; i < boardWidth; i++) {
    var col = document.getElementById(i);
    col.onclick = 0;
    col.classList.remove("column");
    col.classList.add("column_no_hover");
  }

  var splash = document.createElement("div");
  splash.classList.add("finish");
  splash.innerHTML = "<h3>Perdeste!</h3>";
  var game = document.getElementById("game");
  game.appendChild(splash);
}

function print_board_to_console() {
  for (var i = 0; i < boardWidth; i++) {
    for (var j = 0; j < boardHeight; j++) {
      console.log("gameboard[" + i + "][" + j + "]=" + gameBoard[i][j] + " ");
    }
    console.log("\n");
  }
}

function avalia(tempBoard, player) {

  var other_player;
  var result = 0;
  var player_counter = 0;
  var other_player_counter = 0;

  if (player == 1) {
    other_player = 2;
  }

  //check horizontal

  for (var j = 0; j < boardHeight; j++) {
    for (var i = 0; i < boardWidth - 3; i++) {
      for (var t = 0; t < 4; t++) {
        if (tempBoard[i][j + t] == player) {
          player_counter++;
        }
        else if (tempBoard[i][j + t] == other_player) {
          other_player_counter++;
        }
      }
      result += score(player_counter, other_player_counter);
      player_counter = 0;
      other_player_counter = 0;
    }
  }

  //check vertical

  for (var i = 0; i < boardWidth; i++) {
    for (var j = 0; j < boardHeight - 3; j++) {
      for (var t = 0; t < 4; t++) {
        if (tempBoard[i][j + t] == player) {
          player_counter++;
        }
        else if (tempBoard[i][j + t] == other_player) {
          other_player_counter++;
        }
      }
      result += score(player_counter, other_player_counter);
      player_counter = 0;
      other_player_counter = 0;
    }
  }

  //check diagonal left-to-right

  for (var i = 0; i < boardWidth - 3; i++) {
    for (var j = 0; j < boardHeight - 3; j++) {
      for (var t = 0; t < 4; t++) {
        if (tempBoard[i + t][j + t] == player) {
          player_counter++;
        }
        else if (tempBoard[i + t][j + t] == other_player) {
          other_player_counter++;
        }
      }
      result += score(player_counter, other_player_counter);
      player_counter = 0;
      other_player_counter = 0;
    }
  }

  //check diagonal right-to-left

  for (var i = boardWidth - 1; i > 2; i--) {
    for (var j = 0; j < boardWidth - 3; j++) {
      for (var t = 0; t < 4; t++) {
        if (tempBoard[i - t][j + t] == player) {
          player_counter++;
        }
        else if (tempBoard[i - t][j + t] == other_player) {
          other_player_counter++;
        }
      }
      result += score(player_counter, other_player_counter);
      player_counter = 0;
      other_player_counter = 0;
    }
  }

  return result;

}

function score(player_counter, other_player_counter) {

  if (player_counter == 1 && other_player_counter == 0) {
    return 1;
  }

  if (player_counter == 2 && other_player_counter == 0) {
    return 10;
  }

  if (player_counter == 3 && other_player_counter == 0) {
    return 50;
  }

  if (player_counter == 4 && other_player_counter == 0) {
    return 512;
  }

  if (player_counter == 0 && other_player_counter == 1) {
    return -1;
  }

  if (player_counter == 0 && other_player_counter == 2) {
    return -10;
  }

  if (player_counter == 0 && other_player_counter == 3) {
    return -50;
  }

  if (player_counter == 0 && other_player_counter == 4) {
    return -512;
  }

}

function compare(a, b, control) {
  if (control == 1) {
    if (a > b) return a;
    return b;
  }
  if (control == 2) {
    if (a < b) return a;
    return b;
  }
  return 0;
}

function MAX(a, b) {
  if (a > b) return a;
  return b;
}

function MIN(a, b) {
  if (a < b) return a;
  return b;
}

var column_to_play;

function AlphaBeta(currentBoard) {
  var v = max_value(currentBoard, -1000, 1000, 0);
  return column_to_play;
}

function max_value(currentBoard, alfa, beta, diff) {
  if (full(currentBoard)) {
    return avalia(currentBoard, activePlayer);
  }

  if (diff == difficulty) {
    return avalia(currentBoard, activePlayer);
  }

  var v = -1000;

  for (var i = 0; i < boardWidth; i++) {
    var row = find_row(currentBoard, i);
    currentBoard[i][row] = activePlayer;
    v = MAX(v, min_value(currentBoard, alfa, beta, diff + 1));
    column_to_play = i;
    if (v >= beta) {
      return v;
    }
    alfa = MAX(alfa, v);
  }
  return v;
}

function min_value(currentBoard, alfa, beta, diff) {

  if (full(currentBoard)) {
    return avalia(currentBoard, activePlayer);
  }

  if (diff == difficulty) {
    return avalia(currentBoard, activePlayer);
  }

  var v = 1000;

  for (var i = 0; i < boardWidth; i++) {
    var row = find_row(currentBoard, i);
    currentBoard[i][row] = activePlayer;
    v = MIN(v, max_value(currentBoard, alfa, beta, diff + 1));
    column_to_play = i;
    if (v <= alfa) {
      return v;
    }
    beta = MIN(beta, v);
  }

  return v;
}

function deletePlayer() {
  var outside_div = document.getElementById("player");

  if (outside_div.firstChild != outside_div.lastChild) {
    outside_div.removeChild(outside_div.lastChild);
  }
}


function printPlayer(player) {

  console.log("error 1");

  if (player == 1) {

    console.log("error 2");

    deletePlayer();

    var outside_div = document.getElementById("player");

    var color_div = document.createElement("div");
    color_div.classList.add("rightTextOFFON");
    color_div.id = "colorPlayer1";
    var ptext = document.createElement("p");
    var text = document.createTextNode("Player 1");
    ptext.id = "activePlayer";
    
    outside_div.appendChild(color_div);
    color_div.appendChild(ptext);
    ptext.appendChild(text);
  }


  else {

    console.log("error 2");
    
    deletePlayer();

    var outside_div = document.getElementById("player");

    var color_div = document.createElement("div");
    color_div.classList.add("rightTextOFFON");
    color_div.id = "colorPlayer2";
    var ptext = document.createElement("p");
    var text = document.createTextNode("Player 2");
    ptext.id = "activePlayer";

    outside_div.appendChild(color_div);
    color_div.appendChild(ptext);
    ptext.appendChild(text);
   
  }



}

///////////////////////////////////////////////////////////////////////////////////////////

function classificacoes() {
  var x = document.getElementById("container2");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

window.onload = function () {
  var input = document.querySelector('input[type=checkbox]');

  function check() {

  }
}