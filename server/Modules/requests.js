"use strict";

const url = require('url');
const crypto = require('crypto');
const fs = require('fs');

const maxResponseRanking = 10; //numero maximo de linhas na tabela de classificações

module.exports.getRequest = function (request, response) {

  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  let body = '';

  request
    .on('data', (chunk) => { body += chunk;  })
    .on("end", function() {
      if (pathname == "/update") {

        if (borderpass(nick,pass) != 200) {
          //retornar erro
        }

        let resultUpdate = utils.connect(query["game"], query["nick"], reponse);

        if (resultUpdate == 400) {
          response.writeHead(400, { 'Content-Type': 'text/plain' });
          response.write(JSON.stringify({error: "Invalid game reference"})); //verificar erro
          response.end();
        }


      }
      else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end();
      }
    })
    .on("close", function(){
      reponse.end();
    })
    .on("error", function(error){
      console.log(error.message);
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end();
    });
}

module.exports.postRequest = function (request, response) {

  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;

  request.on("end", function () {

    switch (pathname) {
      case "/register":

        let borderpassresult = borderpass(query["nick"], query["pass"]);

        response.writeHead(borderpassresult, { 'Content-Type': 'text/plain' });

        switch (borderpassresult) {
          case 401:
            response.write(JSON.stringify({ error: "User registerd with a different password" }));
            break;
          default:
            response.write(JSON.stringify({}));
        }
        response.end();
        break;
      case '/ranking':
        if(query['size']==null) {
          response.writeHead(400, { 'Content-Type': 'text/plain' });
          response.write(JSON.stringify({ error: "Undefined size" }));
          response.end();
        }
        else if (!Number.isInteger(parseInt(query["size"]))){
          response.writeHead(400, { 'Content-Type': 'text/plain' });
          response.write(JSON.stringify({ error: "Invalid size" }));
          response.end();
        }
        
        try {
          var data = fs.readFileSync("Saves/users.json");
          data = JSON.parse(data.toString())["users"];
        }
        catch(error) {
          console.log(error);
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end();
          //add new error type for read file
          break;
        }

        var rank = [];

        for (var i=0; i<data.length && i< maxResponseRanking; i++) {
          if (data[i]["games"][query["size"]] != null) {
            rank.push({nick: fileData[i]["nick"], victories: data[i]["games"][query["size"]]["victories"], games: data[i]["games"][query["size"]]["games"]});
          }
        }


        rank = {ranking: rank};

        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write(JSON.stringify(rank));
        response.end();
      break;
      case "/join":
        var gameID = utils.joinGame(query["nick"],query["size"]);

        if (gameID!=null) {
          response.writeHead(200, { 'Content-Type': 'text/plain' });
          response.write(JSON.stringify({game: gameID}));
          response.end();
        }

        else {
          var date = new Date();
          date = date.getTime();
          var gameID = crypto
              .createHash('md5')
              .update(date.toString())
              .digest('hex');

          utils.addGame(query["nick"], query["size"], gameID);
          response.writeHead(200, { 'Content-Type': 'text/plain' });
          response.write(JSON.stringify({game: gameID}));
          response.end();
        }
      break;

      case "/leave":
        let resultLeave = utils.leaveGame(query["game"], query["nick"]);

        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write(JSON.stringify({}));
        response.end();
      break;

      case "/notify":
        let resultNotify = utils.notify(query["game"], query["nick"], query["column"]);

        if (resultNotify == "turn") {
          response.writeHead(400, { 'Content-Type': 'text/plain' });
          response.write(JSON.stringify({"error": "Not your turn to play"}));
          response.end();
        }

        else if (resultNotify == "negative_column") {
          response.writeHead(400, { 'Content-Type': 'text/plain' });
          response.write(JSON.stringify({"error": "Column reference is negative"}));
          response.end();
        }
      break;

      default:
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end();

    }

  });
}



function borderpass(nick, pass) {

  if (nick == null || pass == null) {
    return 401;
  }

  const hash = crypto
    .createHash('md5')
    .update(pass)
    .digest('hex');

  try {
    var file = fs.readFileSync("Saves/users.json");
    file = JSON.parse(file.toString())["users"];
  }
  catch (error) {
    console.log("Error reading user save");
    return 500;
  }

  var police = false;

  for (let i = 0; i < file.length; i++) {
    if (file[i]['nick'] == nick) {
      police = true;
      break;
    }
  }

  if (police == false) {

    file.push({ nick: nick, pass: pass });
    file = { users: file };

    try {
      fs.writeFileSync("Saves/users.json", JSON.stringify(file));
    }
    catch (error) {
      console.log("Error writting user save");
      return 500;
    }
  }

  else {
    if (file[i]["pass"] == pass) {
      return 200;
    }
    else {
      return 401;
    }
  }
}