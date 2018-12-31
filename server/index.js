"use strict";

const http = require("http");

const PORT = 8161;

const requestModule = require("./Modules/requests.js");

const server = http.createServer(function(request, response) {
 if (request.method == "GET") {
  requestModule.getRequest(request, response);
  return;
 }
 if (request.method == "POST") {
  requestModule.postRequest(request, response);
  return;
 }
 else {
  response.writeHead(501, { 'Content-Type': 'text/plain' });
  response.end();
 }
});

server.listen(PORT);

console.log("Server running at localhost:8161");