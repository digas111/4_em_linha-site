
/////////////////// IMPROVE ///////////////

//botão de jogar novamente quando o jogo acaba

mypiece = 1;
notmypiece = 2;

///////////////////////////////////////////

var online = true;
var bot = "PC";
var login = false;

var rankingHeight;
var rankingWidth;

var user = new User(null,null,null,61);
var game = new Game(0,0,null,61,null,null);

var gameActive = false; //know if the game is active
var activePlayer = 1; //know who is playing

var server = "http://localhost:8161/";

function User(username,password, board_type, group) {
  this.username = username;
  this.password = password;
  this.board_type = board_type;
  this.group = group;
}

function Game(boardWidth, boardHeight, id,group,activePlayer,turn) {

  this.boardWidth = boardWidth;
  this.boardHeight = boardHeight;
  this.id = id;
  this.group = group;
  this.activePlayer = activePlayer;
  this.turn = turn;

}

/////////////////////////////////////////////////////////////////////////
//////////////// Functions to comunicate with the server ////////////////
/////////////////////////////////////////////////////////////////////////

function register() {

  username = document.getElementById("username").value;
  password = document.getElementById("pw").value;

  if (username == "" || password == "") {
    return false;
  }

  user = {"nick": username, "pass": password};

  fetch(server + "register", {
    method: "POST",
    body: JSON.stringify(user),
  })
  .then(aux_register);

}

function aux_register(response) {

  if (response.ok) {

    user.username = document.getElementById("username").value;
    user.password = document.getElementById("pw").value;

    let loginBox = document.getElementById("topbarText");

    while (loginBox.firstChild) {
      loginBox.removeChild(loginBox.firstChild);
    }

    var usr = document.createTextNode(username);

    loginBox.appendChild(usr);

    login = true;

  }

  else {

    console.log("Deu asneira");

    var splash = document.createElement("div");
    splash.classList.add("finish");
    splash.innerHTML = "<h3>Palavra-passe incorreta!</h3>";
    var window = document.getElementById("game");
    window.appendChild(splash);

    setTimeout(function(){window.removeChild(splash)},2000);


  }

}

function join() {

  boardSize = {"rows": game.boardHeight, "columns": game.boardWidth};

  request = {"group": 61,
    "nick": user.username,
    "pass": user.password,
    "size": boardSize
  };

  fetch(server + "join", {
    method: "POST",
    body: JSON.stringify(request),
  })
  .then(veriResp)
  .then(aux_join);

}

function veriResp(response) {

  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }

}

function aux_join(response) {

  console.log(response);

  game.id = response.game;
  update();

}

function leave() {

request = {"nick": user.username,
"pass": user.password,
"game": game.id
};

fetch(server + "leave", {
  method: "POST",
  body: JSON.stringify(request),
})
.then(aux_leave);

}

function aux_leave(response) {

  if (response.status != 200) {
    //error trying to leave (dela with this later)
  }

}

function notify(col) { //receives a column and sends the move to the sever

  move = {
    "nick": user.username,
    "pass": user.password,
    "game": game.id,
    "column": col
  };

  fetch(server + "notify", {
    method: "POST",
    body: JSON.stringify(move),
  })
    .then(aux_notify);

}

function aux_notify(response) {

  if (response.status != 200) {
    //error trying to notify
  }

}

function update() {

  console.log("update");

  eventSource = new EventSource(server + "update?nick=" + user.username + "&game=" + game.id);

  console.log("update");

  eventSource.onmessage = function (event) {

    var data = JSON.parse(event.data);

    console.log(data);

    if (data.winner != undefined) { //game ended

      console.log("winner");

      if (winner != user.username) {

        if (data.board != undefined) {
          if(data.board.board != null) {
            drawBoard(data.board.board);
          }
          else {
            drawBoard(data.board);
          }
        }

      }

      showWinner(data.winner);

      gameActive = false;
      eventSource.close();

    }

    else if (data.board.board != null) { //if its first play (server bugg?)

      print_board_to_console(data.board.board);

      drawBoard(data.board.board); //draws game board (lets player play)

      if (data.turn != user.username) {
        close_input();
      }

      printPlayer(data.turn);

    }

    else if (data.board != null) { //se for qualquer outra jogadaany other play (server bugg?)

      print_board_to_console(data.board);

      drawBoard(data.board); //draws game board (lets player play)

      if (data.turn != user.username) {
        close_input();
      }

      printPlayer(data.turn);
    }
  }

}

function ranking() {

  size = {"size": {
    "rows": Number(6),
    "columns": Number(7)
    }
  };

  //Number(game.boardHeight)

  fetch(server + "ranking", {
    method: "POST",
    body: JSON.stringify(size)
  })
  .then(error_ranking)
  .then(aux_ranking);

}

function error_ranking(response) {

  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }

}

function aux_ranking(response) {

  console.log(response.ranking);
  //console.log(rankingResult);

  var container2 = document.createElement("div");
  container2.id = "container2";

  var title = document.createElement("h2");
  title.innerHTML = "Classificações";

  var classificacoes = document.createElement("div");
  classificacoes.id = classificacoes;

  var printclass = "<table>" +
    "<tr>" +
    "<th>Jogador</th>" +
    "<th>Vitorias/Jogos</th>" +
    "</tr>";

  for (let i=0; i < response.ranking.length; i++) {

    printclass +=
      "<tr>" +
      "<td>" + response.ranking[i].nick + "</td>" +
      "<td>" + response.ranking[i].victories + " / " + response.ranking[i].games + "</td>" +
      "</tr>";

  }

  closeRanking = "</table>";

  classificacoes.innerHTML = printclass + closeRanking;

  container2.appendChild(title);
  container2.appendChild(classificacoes);

  let maxcontainer = document.getElementById("max_container");

  maxcontainer.appendChild(container2);

}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function showWinner(winner) {

  console.log("show winner");

  for (var i = 0; i < game.boardWidth; i++) {
    var col = document.getElementById(i);
    col.onclick = 0;
    col.classList.remove("column");
    col.classList.add("column_no_hover");
  }

  var splash = document.createElement("div");
  splash.classList.add("finish");

  if (!online) {
    var playergames = Number(localStorage.getItem("playergames"));
    var playerwins = Number(localStorage.getItem("playerwins"));
    var botgames = Number(localStorage.getItem("botgames"));
    var botwins = Number(localStorage.getItem("botwins"));
  }


  if (winner == user.username) {
    splash.innerHTML = "<h3>Ganhaste!</h3>";

    if (!online) {

      localStorage.setItem("playerwins",playerwins+1);
      localStorage.setItem("playergames",playergames+1);
      localStorage.setItem("botgames",botgames+1);

    }
  }

  else if (winner == null) {
    splash.innerHTML = "<h3>Empate!</h3>";

    if (!online) {

      localStorage.setItem("playergames",playergames+1);
      localStorage.setItem("botgames",botgames+1);

    }
  }

  else {
    splash.innerHTML = "<h3>" + winner + " venceu :(</h3>";

    if (!online) {

      localStorage.setItem("botwins",botwins+1);
      localStorage.setItem("botgames",botgames+1);
      localStorage.setItem("playergames",playergames+1);

    }
  }

  var board = document.getElementById("game");
  board.appendChild(splash);

}

function startGame() {

  var button = document.getElementById("playButton");

  if (!login && online) {

    var splash = document.createElement("div");
    splash.classList.add("finish");
    splash.innerHTML = "<h3>Tem de iniciar sessão primeiro!</h3>";
    var window = document.getElementById("game");
    window.appendChild(splash);

    setTimeout(function(){window.removeChild(splash)},2000);

    return;

  }

  if (gameActive) {

    if (online) {
      leave();
    }

    button.innerHTML = "Jogar";
    gameActive = false;
    deletePlayer();
    deleteBoard();
    return;

  }

  button.innerHTML = "Desistir";
  gameActive = true;

  //////////////////////////////////
  ///////// Get board size /////////
  //////////////////////////////////

  var depthId = document.getElementById("tamanhoTabuleiro");
  let size = depthId.options[depthId.selectedIndex].value;

  if (size == 1) {
    game.boardWidth = 6;
    game.boardHeight = 5;
  }
  else if (size == 2) {
    game.boardWidth = 7;
    game.boardHeight = 6;
  }
  else if (size == 3) {
    game.boardWidth = 8;
    game.boardHeight = 7;
  }

  //////////////////////////////////
  //////////////////////////////////
  //////////////////////////////////

  if (online) {

    join();
    return;

  }

  if (!online) {

    if (user.username == null) {
      user.username = "Player_1";
    }

    console.log("Offline game started");

    var gameBoard = initGame();

    drawBoard(gameBoard);

    if (document.getElementById("first").checked == false) {
      bot_play(gameBoard);
    }
    else {
      printPlayer(user.username);
    }

  }

}

function initGame() {

    var gameBoard = [];

  for (var i = 0; i < game.boardWidth; i++) {
    gameBoard[i] = [];
    for (var j = 0; j < game.boardHeight; j++) {
      gameBoard[i][j] = null;
    }
  }

  return gameBoard;

}

function drawBoard(gameBoard) { //deletes board and then draws it

  print_board_to_console(gameBoard);

  console.log("started printing game");

  deleteBoard();

  for (var i = 0; i < game.boardWidth; i++) {
    var col = document.createElement("div");
    col.classList.add("column");
    col.id = i;
    col.onclick = function () {
      play(this.id,gameBoard);
    };
    var board = document.getElementById("game");
    board.appendChild(col);

    for (var j = 0; j < game.boardHeight; j++) {
      var piece = document.createElement("div");
      if (gameBoard[i][j] == user.username) {
        piece.classList.add("player_" + mypiece);
      }
      else if (gameBoard[i][j] != null) {
        piece.classList.add("player_" + notmypiece);
      }
      else {
        piece.classList.add("null");
      }
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

  for (var i = 0; i < game.boardWidth; i++) {
    for (var j = 0; j < game.boardHeight; j++) {

      var board = document.getElementById("game");

      while (board.firstChild) {
        board.removeChild(board.firstChild);
      }
    }
  }

  console.log("finished deleting board");

}

function winner(tempBoard,player) {

  //check vertical

  var counter = 0;

  for (var i = 0; i < game.boardWidth; i++) {
    for (var j = 0; j < game.boardHeight; j++) {
      if (tempBoard[i][j] == player) {
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

  for (var j = 0; j < game.boardHeight; j++) {
    for (var i = 0; i < game.boardWidth; i++) {
      if (tempBoard[i][j] == player) {
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

  for (var i = 0; i < game.boardHeight - 3; i++) {
    for (var j = 0; j < game.boardWidth - 3; j++) {
      for (var t = 0; t < 4; t++) {
        if (tempBoard[i + t][j + t] == player) {
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

  for (var i = game.boardWidth - 1; i > 2; i--) {
    for (var j = 0; j < game.boardWidth - 3; j++) {
      for (var t = 0; t < 4; t++) {
        if (tempBoard[i - t][j + t] == player) {
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
  for (var i = 0; i < game.boardWidth; i++) {
    if (tempBoard[i][0] == 0) {
      return false;
    }
  }
  return true;
}

function find_row(currentBoard, column) {
  for (var j = 0; j < game.boardHeight; j++) {
    if (currentBoard[column][j] != 0) {
      return j - 1;
    }
  }
  return -1;
}

function close_input() {
  for (var i = 0; i < game.boardWidth; i++) {
    var delcol = document.getElementById(i);
    delcol.onclick = 0;
    delcol.classList.remove("column");
    delcol.classList.add("column_no_hover");
  }
}

function bot_play(gameBoard) {

  if (!gameActive) {
    return;
  }

  var col = Math.floor((Math.random() * (game.boardWidth)) + 0);

  while (gameBoard[col][0] != null) {
    col = Math.floor((Math.random() * (game.boardWidth)) + 0);
  }

  console.log("alphabeta escolheu :" + col);

  for (var j = 0; j < game.boardHeight - 1; j++) {
    if (gameBoard[col][j + 1] != null) {
      gameBoard[col][j] = bot;
      drawBoard(gameBoard);
      if (winner(gameBoard,bot)) {
        showWinner(bot);
        return;
      }
      printPlayer(user.username);
      return;
    }
  }

  gameBoard[col][game.boardHeight - 1] = bot;
  drawBoard(gameBoard);
  if (winner(gameBoard,bot)) {
    showWinner(bot);
    return;
  }
  printPlayer(user.username);

}

function play(col, gameBoard) {

  if (gameBoard[col][0] != null) {

    return false;
  }

  if (online) {
    notify(col);
    return;
  }

  if (!online) {

    for (var j = 0; j < game.boardHeight - 1; j++) {
      if (gameBoard[col][j + 1] != null) {
        gameBoard[col][j] = user.username;
        print_board_to_console(gameBoard);
        drawBoard(gameBoard);
        if (winner(gameBoard,user.username)) {
          showWinner(user.username);
          return;
        }

        console.log("oponnet play");
        printPlayer(bot);
        close_input();
        setTimeout(function() {bot_play(gameBoard)} ,2000);
        return;
      }
    }

    gameBoard[col][game.boardHeight-1] = user.username;
    drawBoard(gameBoard);

    if (winner(gameBoard,user.username)) {
      showWinner(user.username);
      return;
    }

    console.log("oponnet play");
    printPlayer(bot);
    close_input();
    setTimeout(function() {bot_play(gameBoard)} ,2000);
    return;

  }

}

function print_board_to_console(board) {

  console.log("Printing board to console");

  for (var i = 0; i < game.boardWidth; i++) {
    for (var j = 0; j < game.boardHeight; j++) {
      console.log("gameboard[" + i + "][" + j + "]=" + board[i][j] + " ");
    }
    console.log("\n");
  }

  console.log("Finishes printing board do console");

}

/////////////////////////////////////////////////////////////////////////
////////////////////// Alpha-Beta search algorithm //////////////////////
/////////////////////////////////////////////////////////////////////////

function avalia(tempBoard, player) {

  var other_player;
  var result = 0;
  var player_counter = 0;
  var other_player_counter = 0;

  if (player == 1) {
    other_player = 2;
  }

  //check horizontal

  for (var j = 0; j < game.boardHeight; j++) {
    for (var i = 0; i < game.boardWidth - 3; i++) {
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

  for (var i = 0; i < game.boardWidth; i++) {
    for (var j = 0; j < game.boardHeight - 3; j++) {
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

  for (var i = 0; i < game.boardWidth - 3; i++) {
    for (var j = 0; j < game.boardHeight - 3; j++) {
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

  for (var i = game.boardWidth - 1; i > 2; i--) {
    for (var j = 0; j < game.boardWidth - 3; j++) {
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

  for (var i = 0; i < game.boardWidth; i++) {
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

  for (var i = 0; i < game.boardWidth; i++) {
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

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
////////////////////////// Show current player //////////////////////////
/////////////////////////////////////////////////////////////////////////

function deletePlayer() {
  var outside_div = document.getElementById("player");

  if (outside_div.firstChild != outside_div.lastChild) {
    outside_div.removeChild(outside_div.lastChild);
  }
}

function printPlayer(player) {

  console.log("Started printing current player");

  if (player == user.username) {

    console.log("My turn");

    deletePlayer();

    var outside_div = document.getElementById("player");

    var color_div = document.createElement("div");
    color_div.classList.add("rightTextOFFON");
    color_div.id = "colorPlayer1";
    var ptext = document.createElement("p");
    var text = document.createTextNode("Sua Vez");
    ptext.id = "activePlayer";

    outside_div.appendChild(color_div);
    color_div.appendChild(ptext);
    ptext.appendChild(text);
  }


  else {

    console.log("Opponents Turn");

    deletePlayer();

    var outside_div = document.getElementById("player");

    var color_div = document.createElement("div");
    color_div.classList.add("rightTextOFFON");
    color_div.id = "colorPlayer2";
    var ptext = document.createElement("p");
    var text = document.createTextNode(player);
    ptext.id = "activePlayer";

    outside_div.appendChild(color_div);
    color_div.appendChild(ptext);
    ptext.appendChild(text);

  }

  console.log("Finished printing current player");

}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function classificacoes() {

  if (document.getElementById("container2") != null) {
    let container2 = document.getElementById("container2");
    document.getElementById("max_container").removeChild(container2);
    let body = document.getElementsByTagName("BODY")[0];
    body.style.overflow = "hidden";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    return;
  }

  var body = document.getElementsByTagName("BODY")[0];
  body.style.overflow = "auto";

  if (online) {
    ranking();
  }
  else {

    console.log("boas");

    if (typeof (Storage) != "undefined") {


      var container2 = document.createElement("div");
      container2.id = "container2";

      var title = document.createElement("h2");
      title.innerHTML = "Classificações";

      var classificacoes = document.createElement("div");
      classificacoes.id = classificacoes;

      var printclass = "<table>" +
        "<tr>" +
        "<th>Jogador</th>" +
        "<th>Vitorias/Jogos</th>" +
        "</tr>";

        printclass +=
          "<tr>" +
          "<td>" + "User" + "</td>" +
          "<td>" + localStorage.getItem("playerwins") + " / " + localStorage.getItem("playergames") + "</td>" +
          "</tr>";

          printclass +=
          "<tr>" +
          "<td>" + bot + "</td>" +
          "<td>" + localStorage.getItem("botwins") + " / " + localStorage.getItem("botgames") + "</td>" +
          "</tr>";


      closeRanking = "</table>";

      classificacoes.innerHTML = printclass + closeRanking;

      container2.appendChild(title);
      container2.appendChild(classificacoes);

      let maxcontainer = document.getElementById("max_container");

      maxcontainer.appendChild(container2);



    }


  }

}

window.onload = function () {
  var input = document.querySelector('input[type=checkbox]');

  var login = document.getElementById("pw");
  login.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      document.getElementById("login_button").click();
    }
  });

  if (localStorage.getItem("botgames")===null) {
    localStorage.setItem("botgames",0);
  }
  if (localStorage.getItem("botwins")===null) {
    localStorage.setItem("botwins",0);
  }

  if (localStorage.getItem("playergames")===null) {
    localStorage.setItem("playergames",0);
  }
  if (localStorage.getItem("playerwins")===null) {
    localStorage.setItem("playerwins",0);
  }



  function check() {

  }

}


/////////////////////////////////////////////////////////////////////////
////////////////////////// Functions that help //////////////////////////
/////////////////////////////////////////////////////////////////////////


function checkToggle() {

  online = false;

  if (document.getElementById("vs_pc").checked == true) {

    let keepspace = document.getElementById("keepSpace");

    let offon1 = document.createElement("div");
    offon1.classList.add("OFFON");
    offon1.id = "OFFONID";

    let lefttextoffon1 = document.createElement("div");
    lefttextoffon1.classList.add("leftTextOFFON");
    lefttextoffon1.innerHTML = "<p>Queres ser o primeiro?</p>";

    let righttextoffon1 = document.createElement("div");
    righttextoffon1.classList.add("rightTextOFFON");

    let insidediv1 = document.createElement("div");
    insidediv1.classList.add("insideDiv");

    let _switch = document.createElement("label");
    _switch.classList.add("switch");

    let checkbox = document.createElement("input");
    checkbox.classList.add("checkbox");
    checkbox.id = "first";
    checkbox.type = "checkbox";

    let slider = document.createElement("span");
    slider.classList.add("slider");
    slider.classList.add("round");

    let offon2 = document.createElement("div");
    offon2.classList.add("OFFON");
    offon2.id = "OFFONID";

    let lefttextoffon2 = document.createElement("div");
    lefttextoffon2.classList.add("leftTextOFFON");
    lefttextoffon2.innerHTML = "<p>Dificuldade:</p>";

    let righttextoffon2 = document.createElement("div");
    righttextoffon2.classList.add("rightTextOFFON");

    let insidediv2 = document.createElement("div");
    insidediv2.classList.add("insideDiv");

    let form = document.createElement("form");
    let select = document.createElement("select");
    select.id = "dificuldade";
    select.name = "dificuldade";

    let option1 = document.createElement("option");
    option1.value = "facil";
    option1.innerHTML = "Fácil";

    let option2 = document.createElement("option");
    option2.value = "medio";
    option2.innerHTML = "Médio";

    let option3 = document.createElement("option");
    option3.value = "dificil";
    option3.innerHTML = "Difícil";



    _switch.appendChild(checkbox);
    _switch.appendChild(slider);

    insidediv1.appendChild(_switch);

    righttextoffon1.appendChild(insidediv1);

    offon1.appendChild(lefttextoffon1);
    offon1.appendChild(righttextoffon1);

    keepspace.appendChild(offon1);

    select.appendChild(option1);
    select.appendChild(option2);
    select.appendChild(option3);

    form.appendChild(select);

    insidediv2.appendChild(form);

    righttextoffon2.appendChild(insidediv2);

    offon2.appendChild(lefttextoffon2);
    offon2.appendChild(righttextoffon2);

    keepspace.appendChild(offon2);

  }

  else {

    online = true;

    var keepSpace = document.getElementById("keepSpace");

    while(keepSpace.firstChild != keepSpace.lastChild) {
      keepSpace.removeChild(keepSpace.lastChild);
    }


  }

}
