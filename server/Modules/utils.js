"use strict"

var fs = require("fs");

//arranjar melhor nome para esta função  
module.exports.addGame = function (nick, size, gameId) {
  let board = [];
  for (let i = 1; i <= size; i++) {
    board.push(i);
  }

  let timeout = setTimeout(function () {
    stopWait(gameId);
  }, 120000);

  games.push({
    size: size,
    nick1: nick,
    nick2: null,
    gameId: gameId,
    timeout: timeout,
    responses: {
      response1: null,
      response2: null
    },
    board: board,
    turn: null,
    active: false
  });
}

module.exports.joinGame = function (nick, size) {
  for (let i = 0; i < games.length; i++) {
    if (games[i].size == size && games[i].active == false) {
      games[i].nick2 = nick;
      return games[i].gameId;
    }
  }
  return null;
}

function stopWait(gameId) {
  for (let i = 0; i < games.length; i++) {
    if (games[i].gameId == gameId) {
      if (games[i].nick2 == null) {
        update(JSON.stringify({ winner: null }),
          games[i].responses.response1,
          games[i].responses.response2);
      } else if (games[i].turn == games[i].nick1) {
        update(JSON.stringify({ winner: games[i].nick2 }),
          games[i].responses.response1,
          games[i].responses.response2);
      } else {
        update(JSON.stringify({ winner: games[i].nick1 }), 
          games[i].responses.response1, 
          games[i].responses.response2);
      }
    }
  }
}