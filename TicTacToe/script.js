/*
Possible improvements:

- Highlight winning move, slightly extend delay before endscreen
  - There should be a function for resetting the gameboard (clear tiles, winner) but it should exclude decideFirstPlayer. The Reset button should call this function, and separately do any additional changes needed.
- Add a delay to the computers move. This could possibly be achieved by using a custom cubic-beizer value for fade in, where it instantly happens towards the end. Need to edit the specific tile where the move was made, and only when it is the computers move.  --- need to add a span tag to the .board-tile div for this to be viable
- If transition is set up anyway, it could be used to add fade in effects after moves. Note that since both the computers and players move require FadeIn, but the computers move only starts after a delay, the time required for this transition is longer.
*/

window.onload = function() {

  var RESETBUTTON = document.getElementById("reset");
  var BOARD = document.getElementById("board");
  var TILES = arrayFromHtmlCol(document.getElementsByClassName("board-tile")); //Array.from not supported by IE 11 and below
  var STARTSCREEN = document.getElementsByClassName("start-screen")[0];
  var STARTSCREENBUTTONS = arrayFromHtmlCol(STARTSCREEN.getElementsByTagName("button"));
  var ENDSCREEN = document.getElementById("end-screen");
  var STATEINDICATOR = document.getElementById("stateIndicator");
  var turnOf = null;
  var winner = null;
  var playerOne = "X"; //sign
  var playerTwo = "O"; //sign
  var playerOneScore = 0;
  var playerTwoScore = 0;
  var computer = false;

  // **********   Main    **********

  TILES.forEach(function(tile) {
    tile.addEventListener("click", function() {
      if (winner !== null) return;
      occupyTile(this);
      if (checkWinCondition()) setTimeout(gameOver, 600);
      if (computer) {
         //this should likely be abstracted away, and might be better moved somewhere else
        if (turnOf === playerTwo) {
          occupyTile(TILES[computerStep()]);
          if (checkWinCondition()) setTimeout(gameOver, 600);
        }
      }
    })
  })

  RESETBUTTON.addEventListener("click", function() {
    resetGame();
  })

  STARTSCREENBUTTONS.forEach(function(button) {
    button.addEventListener("click", function() {
      startScreenButtonsAction(button);
    })
  })

  //    **********  Function Definitions **********

  function decideFirstPlayer() {
    if (Math.floor(Math.random() * 10) < 5) {
      turnOf = playerOne;
      STATEINDICATOR.textContent = "Player One's Turn";
    } else {
      turnOf = playerTwo;
      STATEINDICATOR.textContent = "Player Two's Turn";
    }
  }

  function occupyTile(tile) {
    if (tile.textContent === "") {
      tile.textContent = turnOf;
      if (turnOf === playerOne) {
        turnOf = playerTwo;
        STATEINDICATOR.textContent = "Player Two's Turn"
      } else {
        turnOf = playerOne;
        STATEINDICATOR.textContent = "Player One's Turn"
      }
    }
  }

  function checkBoardTiles(condition) {
    var passedCondition = [];
    for (var i = 0; i < 3; i++) {
      passedCondition = condition(i * 3, i * 3 + 1, i * 3 + 2, passedCondition); // checks one line on each iteration
      passedCondition = condition(i, i + 3, i + 6, passedCondition) // checks one column on each iteration
    }
    passedCondition = condition(0, 4, 8, passedCondition); // first diagonal
    passedCondition = condition(2, 4, 6, passedCondition); // second diagonal
    return passedCondition;
  }

  function resetGame() {
    ENDSCREEN.style.display = "none";
    BOARD.style.display = "none";
    STARTSCREEN.style.display = "flex";
    STATEINDICATOR.textContent = "Setting up game";
    TILES.forEach(function(tile) {
      tile.textContent = "";
    })
    turnOf = "X";
    changeActiveButton("x", "o")
    winner = null;
    computer = false;
    playerOneScore = 0;
    playerTwoScore = 0;
    changeActiveButton("2players", "computer")
  }

  function startScreenButtonsAction(button) {
    var buttonValue = button.getAttribute("value");
    switch (buttonValue) {
      case "start":
        decideFirstPlayer();
        STARTSCREEN.style.display = "none";
        BOARD.style.display = "flex";
        if (turnOf === playerTwo && computer === true) occupyTile(TILES[computerStep()]);
        break;
      case "x":
        playerOne = "X";
        playerTwo = "O";
        changeActiveButton("x", "o");
        break;
      case "o":
        playerOne = "O";
        playerTwo = "X";
        changeActiveButton("o", "x");
        break;
      case "2players":
        computer = false;
        changeActiveButton("2players", "computer");
        break;
      case "computer":
        computer = true;
        changeActiveButton("computer", "2players");
        break;
    }
  }

  //    **********    functions for Computer steps    **********

  function computerStep() {
    var potentialSteps = checkBoardTiles(twoEqualTilesOneEmpty); //
    if (TILES[4].textContent === "") potentialSteps.unshift(4);
    for (var i = 0; i < potentialSteps.length; i++) {
      if (potentialSteps[i] !== undefined) return potentialSteps[i];
    }
    return randomStep();
  }

  function twoEqualTilesOneEmpty(tileOneIndex, tileTwoIndex, tileThreeIndex, passedCondition) {
    // can be passed to checkBoardTiles as parameter
    var playerTwoTiles = 0;
    var playerOneTiles = 0;
    var emptyTileIndex = null;

    for (var i = 0; i < 3; i++) {
      if (TILES[arguments[i]].textContent === playerTwo) playerTwoTiles++;
      else if (TILES[arguments[i]].textContent === playerOne) playerOneTiles++;
      else emptyTileIndex = arguments[i];
    }
    if (playerTwoTiles === 2 && emptyTileIndex !== null && passedCondition[0] === undefined) passedCondition[0] = emptyTileIndex;
    else if (playerOneTiles === 2 && emptyTileIndex !== null && passedCondition[1] === undefined) passedCondition[1] = emptyTileIndex;
    return passedCondition;
  }

  function randomStep() {
    var emptyTiles = [];
    var randomIndex = 0;
    TILES.forEach(function(tile, index) {
      if (tile.textContent === "") emptyTiles.push(index)
    })
    randomIndex = Math.floor(Math.random() * emptyTiles.length)
    return emptyTiles[randomIndex];
  }

  //    **********    functions for ending the game   **********

  function checkWinCondition() {
    var winnerTileIndex = checkBoardTiles(threeEqualTiles);
    var occupiedTiles = checkBoardTiles(occupiedTilesArray);

    if (winnerTileIndex[0] !== undefined) {
      winner = TILES[winnerTileIndex[0]].textContent;
      return true
    }
    if (occupiedTiles.length === TILES.length) {
      winner = "draw";
      return true;
    }
  }

  function threeEqualTiles(tileOneIndex, tileTwoIndex, tileThreeIndex, passedCondition) {
    // can be passed to checkBoardTiles as parameter
    if (TILES[tileOneIndex].textContent !== "" &&
      TILES[tileOneIndex].textContent === TILES[tileTwoIndex].textContent &&
      TILES[tileOneIndex].textContent === TILES[tileThreeIndex].textContent) {
      passedCondition[0] = tileOneIndex;
    }
    return passedCondition;
  }

  function occupiedTilesArray(tileOneIndex, tileTwoIndex, tileThreeIndex, passedCondition) {
    // can be passed to checkBoardTiles as parameter
    for (var i = 0; i < 3; i++) {
      if (TILES[arguments[i]].textContent !== "" && !(arrayIncludes(passedCondition, arguments[i]))) passedCondition.push(arguments[i]);
    }
    return passedCondition;
  }

  function updateScore () {
    if (winner === playerOne) playerOneScore++
    else if (winner === playerTwo) playerTwoScore++;
    STATEINDICATOR.textContent = "Player One: " + playerOneScore.toString() + " Player Two: " + playerTwoScore.toString();
  }

  function gameOver() {
    if (winner === playerOne && computer === false) ENDSCREEN.textContent = "Player One Won";
    else if (winner === playerOne && computer === true) ENDSCREEN.textContent = "You Won! ";
    else if (winner === playerTwo && computer === false) ENDSCREEN.textContent = "Player Two Won";
    else if (winner === playerTwo && computer === true) ENDSCREEN.textContent = "You Lost :(";
    else if (winner === "draw") ENDSCREEN.textContent = "Draw!";
    updateScore();
    ENDSCREEN.style.display = "flex";
    BOARD.style.display = "none";
    setTimeout(function() { // new game after 3 seconds,
      decideFirstPlayer();
      STARTSCREEN.style.display = "none";
      ENDSCREEN.style.display = "none";
      BOARD.style.display = "flex";
      winner = null;
      TILES.forEach(function(tile) {
        tile.textContent = "";
      })
      if (turnOf === playerTwo && computer === true) occupyTile(TILES[computerStep()]);
    }, 3000);
  }

  //    **********    auxiliary functions   **********

  function arrayFromHtmlCol(htmlCollection) {
    // Array.from not supported by IE 11 and below
    var newArray = [];
    for (var i = 0; i < htmlCollection.length; i++) {
      newArray.push(htmlCollection[i]);
    }
    return newArray;
  }

  function arrayIncludes(array, value) {
    // Array.includes not supported by IE
    var includes = false;
    for (var i = 0; i < array.length; i++) {
      if (array[i] === value) includes = true;
    }
    if (includes === false) return false;
    else return true;
  }

  //    **********    CSS    **********

  function changeActiveButton(add, remove) {
    document.querySelector('button[value="' + add + '"]').classList.add("active");
    document.querySelector('button[value="' + remove + '"]').classList.remove("active");
  }
};
