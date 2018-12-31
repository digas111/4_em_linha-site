"use strict"

//global variables

const saveFile = "./server/Saves/users.json"

var fs = require("fs");

var games = [];

module.exports.documentRoot = '';

module.exports.addGame = function (nick, size, gameId) {

  let board = initGame(size.columns, size.rows);

  let timeout = setTimeout(function () {
    stopWait(gameId);
  }, 120000);

  games.push({
    size: size,
    nick1: nick,
    nick2: null,
    gameId: gameId,
    timeout: timeout,
    response1: null,
    response2: null,
    board: board,
    turn: null,
    active: false
  });
}

module.exports.joinGame = function (nick, size) {
  for (let i = 0; i < games.length; i++) {
    if (areSameSize(games[i].size, size) && games[i].active == false) {
      games[i].nick2 = nick;
      return games[i].gameId;
    }
  }
  return null;
}

function stopWait(gameId) {
  //console.log("timeout");
  for (let i = 0; i < games.length; i++) {
    if (games[i].gameId == gameId) {
      if (games[i].nick2 == null) {
        update(JSON.stringify({ winner: null }),
          games[i].response1,
          games[i].response2);
      } else if (games[i].turn == games[i].nick1) {
        update(JSON.stringify({ winner: games[i].nick2 }),
          games[i].response1,
          games[i].response2);
      } else {
        update(JSON.stringify({ winner: games[i].nick1 }), 
          games[i].response1, 
          games[i].response2);
      }
      if (games[i].response1 != null) {
        games[i].response1.end();
      }
      if (games[i].response2 != null) {
        games[i].response2.end();
      }
      games.splice(i,1);
      break;
    }
  }
}



module.exports.leaveGame = function(gameId, nick) {

  for (let i=0; i<games.length; i++) {

    if (games[i].gameId == gameId) {
      if (games[i].nick1 != nick && games[i].nick2 != nick) {
        throw 'Player not in this game';
      }
      clearTimeout(games[i].timeout);
      if (games[i].nick2 == null) {
        winner = null;
      }
      else {
        if (games[i].nick1 == nick) {
          var winner = games[i].nick2;
          var loser = games[i].nick1;
        }
        else {
          var winner = games[i].nick1;
          var winner = games[i].nick2;
        }
        saveScoreVictory(winner, loser, games[i].size.columns);
      }
      update(JSON.stringify({winner: winner}), games[i].response1, games[i].response2);

      if (games[i].response1 != null) {
        games[i].response1.end();
      }
      if (games[i].response2 != null) {
        games[i].response2.end();
      }
      games.splice(i,1);
      return;
    }
  }

  throw 'Game doesn´t exist';

}

module.exports.notify = function(nick, pass, gameId, column) {

  //console.log("begin notify");

  for (let i=0; i<games.length; i++) {
    if (games[i].gameId == gameId && games[i].active == true) {
      clearTimeout(games[i].timeout);
      if (games[i].turn != nick) {
        return "turn";
      }
      else if (column < 0 || column >= games[i].size.columns) {
        return "negative_column";
      }

      let police = false;

      for (let j=0; j<games[i].size.rows; j++) {
        if (games[i].board[column][j+1] != null) {
          games[i].board[column][j] = nick;
          police = true;
        }
      }

      if (police == false) {

        games[i].board[column][games[i].size.rows-1] = nick; //makes the move

      }

      if (winner(games[i].board,games[i].size, nick)) {
        update(JSON.stringify({winner: nick, board: games[i].board, column: column}), games[i].response1, games[i].response2);
        games[i].response1.end();
        games[i].response2.end();
        if (games[i].nick1 == nick) {
          saveScoreVictory(nick, games[i].nick2, games[i].board.length);
        }
        else {
          saveScoreVictory(nick, games[i].nick1, games[i].board.length);
        }
        games.splice(i,1);
      }
      else if (boardIsFull(games[i].board)){
        update(JSON.stringify({winner: null, board: games[i].board, column: column}), games[i].response1, games[i].response2);
        games[i].response1.end();
        games[i].response2.end();

        saveScoreTie(games[i].nick1, games[i].nick2, games[i].size.columns);
      }

      else {

        if (games[i].turn == games[i].nick1) {
          games[i].turn = games[i].nick2;
        }

        else {
          games[i].turn = games[i].nick1;
        }

        games[i].timeout = setTimeout(function() {stopWait(gameId)}, 120000);

        update(JSON.stringify({turn: games[i].turn, board: games[i].board, colum: column}), games[i].response1, games[i].response2);

      }
      return "ok";
    }
  }

  //console.log("end notify");

}

module.exports.connect = function(gameId, nick) {

  for (let i=0; i<games.length; i++) {
    if (games[i].gameId = gameId) {
      if (games[i].nick1 == nick && games[i].response1 == null) {
        games[i].response1 = response;
        return 200;
      }
      else if (games[i].nick2 == nick && games[i].response2 == null) {
        games[i].response2 = response;
        games[i].active = true;
        games[i].turn = games[i].nick1;
        clearTimeout(games[i].timeout);
        update(JSON.stringify({turn: games[i].turn, board: games[i].board}), games[i].response1, games[i].response2);
        return 200;
      }
      break;
    }
    
  }
  return 400;
}



function update(message, response1, response2) {
  if (response1 != null) {
    response1.write("data: " + message + "\n\n");
  }
  if (response2 != null) {
    response2.write("data: " + message + "\n\n");
  }
}

/////////////////////////////////////////////////////////////////////////
///////////////////////////// Aux functions /////////////////////////////
/////////////////////////////////////////////////////////////////////////

function initGame(boardWidth, boardHeight) {

  var gameBoard = [];

for (var i = 0; i < boardWidth; i++) {
  gameBoard[i] = [];
  for (var j = 0; j < boardHeight; j++) {
    gameBoard[i][j] = null;
  }
}

return gameBoard;

}

function boardIsFull(board) {
  
  for (let i=0; i<board.length; i++) {
    if (board[i]!=null) {
      return false;
    }
  }
  return true;
}

function winner(tempBoard,size,player) {

  //check vertical

  var counter = 0;

  for (var i = 0; i < size.columns; i++) {
    for (var j = 0; j < size.rows; j++) {
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

  for (var j = 0; j < size.rows; j++) {
    for (var i = 0; i < size.columns; i++) {
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

  for (var i = 0; i < size.rows - 3; i++) {
    for (var j = 0; j < size.columns - 3; j++) {
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

  for (var i = size.rows - 1; i > 2; i--) {
    for (var j = 0; j < size.columns - 3; j++) {
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

function saveScoreTie(player1, player2, size) {

  try {
    var data = fs.readFileSync(saveFile);
    data = JSON.parse(data.toString())["users"];
  }

  catch(error) {
    console.log(error);
  }

  let police = 0;

  for (let i=0; i<data.length && police<2; i++) {

    if (data[i]["nick"] == player1 || data[i]["nick"] == player2) {

      police++;

      if (data[i]["games"][size] == null) {
        data[i]["games"][size] = {};
        data[i]["games"][size]["games"] = 1;
        data[i]["games"][size]["victories"] = 0;
      }

      else {
        data[i]["games"][size]["games"]++;
      }

    }

  }

  data = {users: data};

  try {
    fs.writeFileSync(saveFile, JSON.stringify(data));
  }
  catch(error) {
    console.log(error);
  }


}

function saveScoreVictory(winner, loser, size) {

  try {
    var data = fs.readFileSync(saveFile);
    data = JSON.parse(data.toString())["users"];
  }

  catch(error) {
    console.log(error);
  }

  let police = 0;

  for (let i=0; i<data.length && police<2; i++) {

    if (data[i]["nick"] == winner || data[i]["nick"]==loser) {

      police++;

      if (data[i]["games"][size] == null) {
        data[i]["games"][size] = {};
        data[i]["games"][size]["games"] = 1;
        data[i]["games"][size]["victories"] = 0;
      }
      else {
        data[i]["games"][size]["games"]++;
      }
    }

    if (data[i]["nick"] == winner) {
      data[i]["games"][size]["victories"]++;
    }

  }

  data = {users: data};

  try {
    fs.writeFileSync(saveFile, JSON.stringify(data));
  }
  catch(error) {
    console.log(error);
  }

}

function writeHeader(response) {
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Connection': 'keep-alive'
  });
  return response;
}

function areSameSize(size1,size2) {

  if (size1.rows != size2.rows)
    return false;
  if (size1.columns != size2.columns)
    return false;

  return true;

}