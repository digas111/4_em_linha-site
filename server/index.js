"use strict";

const http = require("http");

const PORT = 8161;

const request = require("./Modules/requests.js");

const server = http.createServer(function(request, response) {
 if (request.method == "GET") {
  request.getRequest(request, response);
  break;
 }
 if (request.method == "POST") {
  request.postRequest(request, response);
  break;
 }
 else {
  response.writeHead(501, { 'Content-Type': 'text/plain' });
  response.end();
 }
});

server.listen(PORT);