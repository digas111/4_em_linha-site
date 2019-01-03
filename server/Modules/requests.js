"use strict";

const url = require('url');
const crypto = require('crypto');
const fs = require('fs');

const utils = require('./utils.js')

const maxResponseRanking = 10; //numero maximo de linhas na tabela de classificações

module.exports.getRequest = function (request, response) {

  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  let body = '';

  request
    .on('data', (chunk) => { body += chunk; })
    .on("end", function () {
      switch (pathname) {
        case '/update':
          if (borderpass(query["nick"], query["pass"]) != 200) {
            //retornar erro
          }

          let resultUpdate = utils.connect(query["game"], query["nick"],response);

          if (resultUpdate == 400) {
            response.writeHead(400, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Access-Control-Allow-Origin': '*',
              'Connection': 'keep-alive'
            });
            response.write(JSON.stringify({ error: "Invalid game reference" }));
          }
          break;
        case '/':
          fs.readFile('./index.html', function (error, data) {
            if (error){
              throw error;
            } 
            console.log(data);
            responseWriter(response,200,'css',data);
          })
        break;
        case '/index.js':
        fs.readFile('./index.js', function (error, data) {
          if (error){
            throw error;
          } 
          responseWriter(response,200,'plain',data);
        });
        break;
        case '/style.css':
        fs.readFile('./style.css', function (error, data) {
          if (error){
            throw error;
          } 
          responseWriter(response,200,'css',data);
        });
        break;
        case '/script.js':
        fs.readFile('./script.js', function (error, data) {
          if (error){
            throw error;
          } 
          responseWriter(response,200,'plain',data);
        });
        break;
        case '/snow.js':
        fs.readFile('./snow.js', function (error, data) {
          if (error){
            throw error;
          } 
          responseWriter(response,200,'plain',data);
        });
        break;
        case '/img/2019.png':
          fs.readFile('./img/2019.png', function (error, data) {
            if (error){
              throw error;
            } 
            responseWriter(response,200,'png',data);
          });
        break;
        case '/img/balloons.png':
          fs.readFile('./img/balloons.png', function (error, data) {
            if (error){
              throw error;
            }  
            responseWriter(response,200,'png',data);
          });
        break;
        case '/img/head.ico':
          fs.readFile('./img/head.ico', function (error, data) {
            if (error){
              throw error;
            }  
            responseWriter(response,200,'icon',data);
          });
        break;
        case '/fonts/pacifico.ttf':
          fs.readFile('./fonts/pacifico.ttf', function (error, data) {
            if (error){
              throw error;
            }  
            responseWriter(response,200,'font',data);
          });
        break;
        default:
        responseWriter(response, 404, 'plain',JSON.stringify({}));

      }
    })
    .on("close", function (error) {
      response.end();
    })
    .on("error", function (error) {
      console.log(error.message);
      responseWriter(response, 400, 'plain',JSON.stringify({}));
    });
}

module.exports.postRequest = function (request, response) {

  //console.log("post");

  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  var body = "";

  request.on("data", function (chunk) {
    body += chunk;
  });

  request.on("end", function () {

    try {
      var query = JSON.parse(body);
    }
    catch (error) {
      console.log(error.message);
      response.writeHead(400, headers["plain"]);
      response.write(JSON.stringify({ error: "Error parsing JSON request: " + error }));
      response.end();
      return;
    }

    switch (pathname) {
      case "/register":

        //console.log("register");

        let borderpassresult = borderpass(query["nick"], query["pass"]);

        switch (borderpassresult) {
          case 401:
            responseWriter(response, 401, 'plain', JSON.stringify({ error: "User registerd with a different password" }));
            break;
          default:
            responseWriter(response, 200, 'plain', JSON.stringify({}));
            //console.log("login done");
            break;
        }
        break;

      case '/ranking':

        if (query['size'] == null) {
          responseWriter(response, 400, 'plain', JSON.stringify({ error: "Undefined size" }));
        }
        else if (!Number.isInteger(parseInt(query["size"].rows))) {
          responseWriter(response, 400, 'plain', JSON.stringify({ error: "Invalid size" }));
        }

        try {
          var data = fs.readFileSync("./server/Saves/users.json");
          data = JSON.parse(data.toString())["users"];
        }
        catch (error) {
          console.log(error);
          responseWriter(response, 500, 'plain',JSON.stringify({}));

          //add new error type for read file
          break;
        }

        var rank = [];

        //console.log("boas");
        //console.log(query["size"]["columns"]);

        for (var i = 0; i < data.length; i++) {
          if (data[i]["games"][query["size"]["columns"]] != null) {
            //console.log(data[i]["games"][query["size"]["victories"]);
            rank.push({
              nick: data[i]["nick"],
              victories: data[i]["games"][query["size"]["columns"]]["victories"],
              games: data[i]["games"][query["size"]["columns"]]["games"]
            });
          }
        }

        for (i = 0; i < rank.length; i++) {
          for (var j = 0; j < rank.length; j++) {
            if (rank[j]["victories"] > rank[i]["victories"]) {
              let aux = rank[i];
              rank[i] = rank[j];
              rank[j] = aux;
            }
          }
        }

        rank = rank.slice(0, maxResponseRanking);

        rank = { ranking: rank };

        responseWriter(response, 200, 'plain', JSON.stringify(rank));
        break;
      case "/join":
        var gameID = utils.joinGame(query["nick"], query["size"]);

        if (gameID != null) {
          responseWriter(response, 200, 'plain', JSON.stringify({ game: gameID }));
        }

        else {
          var date = new Date();
          date = date.getTime();
          var gameID = crypto
            .createHash('md5')
            .update(date.toString())
            .digest('hex');

          utils.addGame(query["nick"], query["size"], gameID);
          responseWriter(response, 200, 'plain', JSON.stringify({ game: gameID }));

        }
        break;

      case "/leave":
        
        utils.leaveGame(query["game"], query["nick"]);

        responseWriter(response, 200, 'plain', JSON.stringify({}));

        break;

      case "/notify":

        var resultNotify = utils.notify(query["nick"], query["pass"], query["game"], query["column"]);

        if (resultNotify === "turn") {
          responseWriter(response, 400, 'plain', JSON.stringify({ "error": "Not your turn to play" }));

        }

        else if (resultNotify === "negative_column") {
          responseWriter(response, 400, 'plain', JSON.stringify({ "error": "Column reference is negative" }));

        }
        else if (resultNotify === "ok") {
          responseWriter(response, 200, 'plain', JSON.stringify({}));
        }
        break;

      default:
        responseWriter(response, 404, 'plain', JSON.stringify({}));

    }

  });
}

function borderpass(nick, pass) {

  if (nick == null || pass == null) {
    return 401;
  }

  pass = crypto
    .createHash('md5')
    .update(pass)
    .digest('hex');

  try {
    var file = fs.readFileSync("./server/Saves/users.json");
    file = JSON.parse(file.toString())["users"];
  }
  catch (error) {
    console.log("Error reading user save");
    return 500;
  }

  for (let i = 0; i < file.length; i++) {
    if (file[i]['nick'] == nick) {

      if (file[i]["pass"] == pass) {
        return 200;
      }

      else {
        return 401;
      }
    }
  }

  file.push({ nick: nick, pass: pass, games: { size: {} } });
  file = { users: file };

  try {
    fs.writeFileSync("./server/Saves/users.json", JSON.stringify(file));
  }

  catch (error) {
    console.log("Error writting user save");
    return 500;
  }

}

function responseWriter(response, code, type, message) {

  switch(type) {
    case 'plain':
      response.writeHead(code, {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
    break;
    case 'html':
      response.writeHead(code, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
    break;
    case 'css':
      response.writeHead(code, {
        'Content-Type': 'text/css',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
    break;
    case 'icon':
      response.writeHead(code, {
        'Content-Type': 'img/x-icon',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
    break;
    case 'png':
      response.writeHead(code, {
        'Content-Type': 'img/png',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
    break;
    case 'font':
      response.writeHead(code, {
        'Content-Type': 'font/ttf',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
    break;
    case 'stream':
      response.writeHead(code, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
      });
    break;
    default:
    throw 'shoud not be here';
  }

  response.write(message);
  response.end();
}