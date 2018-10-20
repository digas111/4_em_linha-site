var gameActive = false; //know if the game is active
var activePlayer = 0; //know who is playing
var boardWidth = 7;
var boardHeight = 6;
var gameBoard = [boardWidth][boardHeight];

function drawBoard() {

  for (var col=0; col<)



  for (var row=0; row<=7; row++) {
    /*document.writeln() function will write HTML code to the browser.  If you "inspect" this page after the browser has
    rendered the page, you will see a bunch of HTML
    write the start of the table row tag
    */
    document.writeln("<tr>");
    for (var col=0; col<=9; col++) {
      //write each table data element - with the row and col variables in the ID so it can be accessed later.
      document.writeln("<td id='square_" + row + "_"+ col +"' class='board_square'></td>");
    }
    //write the closing table row tag.
    document.writeln("</tr>");
  }
}


function startGame() {

  if (game_active = true) return false;

  game_active = true;

  for (row=0; row<boardHeight; row++) {
    for (column=0; column<boardWidth; column++) {
      gameBoard[row][column] = 0;
    }
  }

  drawBoard(); //cal the function to draw the board
  activePlayer = 1; //set the first player as their turn
  setUpTurn(); //get ready for the player's turn

}

// function drawBoard() {
//   checkWin();
//   for ()
// }


// function evaluate(game[boardWidth][boardHeight],player) {
//
//   var nplayer = 2;
//   if(player ==2) nplayer=1;
//
//   for(i=0;i<6;i++) {
//       for (j=0;j<7;j++) {
//           if (game[i][j]==player) {
//               contp++;
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//           else if (game[i][j]==nplayer) {
//               contnp++;
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//           }
//           else {
//
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//
//       }
//       if (contp!=0) {
//           if (contp==1) pont += 1;
//           if (contp==2) pont += 10;
//           if (contp==3) pont += 50;
//           contp=0;
//       }
//       if (contnp!=0) {
//           if (contnp==1) pont -= 1;
//           if (contnp==2) pont -= 10;
//           if (contnp==3) pont -= 50;
//           contnp=0;
//       }
//   }
//   for (i=0;i<7;i++) {
//       for (j=0;j<6;j++) {
//           if (game[j][i]==player) {
//               contp++;
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//           else if (game[j][i]==nplayer) {
//               contnp++;
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//           }
//           else {
//
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//       }
//       if (contp!=0) {
//           if (contp==1) pont += 1;
//           if (contp==2) pont += 10;
//           if (contp==3) pont += 50;
//           contp=0;
//       }
//       if (contnp!=0) {
//           if (contnp==1) pont -= 1;
//           if (contnp==2) pont -= 10;
//           if (contnp==3) pont -= 50;
//           contnp=0;
//       }
//   }
//   for (i=0;i<7;i++) {
//       for (j=0, t=i; j<6 && t<7;j++, t++) {
//           if (game[j][t]==player) {
//               contp++;
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//           else if (game[j][t]==nplayer) {
//               contnp++;
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//           }
//           else {
//
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//       }
//       if (contp!=0) {
//           if (contp==1) pont += 1;
//           if (contp==2) pont += 10;
//           if (contp==3) pont += 50;
//           contp=0;
//       }
//       if (contnp!=0) {
//           if (contnp==1) pont -= 1;
//           if (contnp==2) pont -= 10;
//           if (contnp==3) pont -= 50;
//           contnp=0;
//       }
//   }
//   for (i=1;i<6;i++) {
//       for (j=0, t=i; j<7 && t<6;j++, t++) {
//           if (game[t][j]==player) {
//               contp++;
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//           else if (game[t][j]==nplayer) {
//               contnp++;
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//           }
//           else {
//
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//       }
//       if (contp!=0) {
//           if (contp==1) pont += 1;
//           if (contp==2) pont += 10;
//           if (contp==3) pont += 50;
//           contp=0;
//       }
//       if (contnp!=0) {
//           if (contnp==1) pont -= 1;
//           if (contnp==2) pont -= 10;
//           if (contnp==3) pont -= 50;
//           contnp=0;
//       }
//   }
//   for (i=6;i>=0;i--) {
//       for (j=0, t=i; j<6 && t>=0;j++, t--) {
//           if (game[j][t]==player) {
//               contp++;
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//           else if (game[j][t]==nplayer) {
//               contnp++;
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//           }
//           else {
//
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//       }
//       if (contp!=0) {
//           if (contp==1) pont += 1;
//           if (contp==2) pont += 10;
//           if (contp==3) pont += 50;
//           contp=0;
//       }
//       if (contnp!=0) {
//           if (contnp==1) pont -= 1;
//           if (contnp==2) pont -= 10;
//           if (contnp==3) pont -= 50;
//           contnp=0;
//       }
//   }
//   for (i=1;i<6;i++) {
//       for (j=6, t=i; j>=0 && t<6;j--, t++) {
//           if (game[t][j]==player) {
//               contp++;
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//           else if (game[t][j]==nplayer) {
//               contnp++;
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//           }
//           else {
//
//               if (contp!=0) {
//                   if (contp==1) pont += 1;
//                   if (contp==2) pont += 10;
//                   if (contp==3) pont += 50;
//                   contp=0;
//               }
//
//               if (contnp!=0) {
//                   if (contnp==1) pont -= 1;
//                   if (contnp==2) pont -= 10;
//                   if (contnp==3) pont -= 50;
//                   contnp=0;
//               }
//           }
//       }
//       if (contp!=0) {
//           if (contp==1) pont += 1;
//           if (contp==2) pont += 10;
//           if (contp==3) pont += 50;
//           contp=0;
//       }
//       if (contnp!=0) {
//           if (contnp==1) pont -= 1;
//           if (contnp==2) pont -= 10;
//           if (contnp==3) pont -= 50;
//           contnp=0;
//       }
//   }
//
//
//
// }
