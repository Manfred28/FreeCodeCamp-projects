// win condition is reaching round 20.

/* TODO:

box-shadow

*/
"use strict";

window.addEventListener("load", function() {
	var OUTER_BUTTON_ARRAY = toArray(document.querySelectorAll("#outer-circle > button"))
	var OUTER_BUTTON1 = OUTER_BUTTON_ARRAY[0] // blue - starts with top right
	var OUTER_BUTTON2 = OUTER_BUTTON_ARRAY[1] // red 
	var OUTER_BUTTON3 = OUTER_BUTTON_ARRAY[2] // green
	var OUTER_BUTTON4 = OUTER_BUTTON_ARRAY[3] // yellow
	var OUTER_BUTTON_SOUNDS_ARRAY = toArray(document.getElementById("button-sounds").children);
	var OUTER_BUTTON_CLICK_COLORS = ["#4286f4", "#f44141", "#41f458", "#f4ee41"];
	var OUTER_BUTTON_ORIGIN_COLORS = ["#0f53c1", "#aa1212", "#13b528", "#e5d609"];
	var OUTER_BUTTON_CLICK_TIMEOUT = 400;
	var START_BUTTON = document.querySelectorAll("#inner-circle button")[0];
	var RESET_BUTTON = document.querySelectorAll("#inner-circle button")[1];
	var STRICT_BUTTON = document.querySelectorAll("#inner-circle button")[2];
	var ROUND_COUNTER_DISPLAY = document.getElementById("round-counter");
	var fullSequence = [];
	var currentSequence = [];
	var playSequence = null; // used with setinverval
	var gamePhase = "" // "show-sequence" , "sequence-input"
	var isStrict = false; 
	var maxRounds = 20;
	var roundCounter = 0;


	//		****		Main		****


	OUTER_BUTTON_ARRAY.forEach(function (button, index) {
		outerButtonsClickEvent(button, index);
	});

	START_BUTTON.addEventListener("click", function () {
		if (roundCounter === 0) {
			startGame();
		}
	})

	STRICT_BUTTON.addEventListener("click", function () {
		strictButtonToggleDisplay();
		if (isStrict === false) isStrict = true;
		else isStrict = false;
	})

	RESET_BUTTON.addEventListener("click", function () {
		startGame();
	})

	//		****		Game Logic		****


	function generateSequence () {
		for (var i = 0; i < maxRounds; i++){
			var randomNum = Math.floor(Math.random() * (5 - 1)) + 1;
			switch (randomNum) {
				case 1 :
					fullSequence.push(OUTER_BUTTON1);
					break;
				case 2 : 
					fullSequence.push(OUTER_BUTTON2);
					break;
				case 3 : 
					fullSequence.push(OUTER_BUTTON3);
					break;
				case 4 : 
					fullSequence.push(OUTER_BUTTON4);
					break;
				default :
					console.log("Error in generateSequence ()");
					break;
			}
		}
	}

	function showSequence () {
		gamePhase = "show-sequence";
		var i = 0;
		playSequence = setInterval(function () {
			currentSequence.push(fullSequence[i]);
			outerButtonsClickColor(fullSequence[i], OUTER_BUTTON_ARRAY.indexOf(fullSequence[i]));
			playButtonSound(OUTER_BUTTON_ARRAY.indexOf(fullSequence[i]));
			i++;
			if (i === roundCounter) {
				gamePhase = "sequence-input";
				console.log(gamePhase);
				clearInterval(playSequence)		
			}; 
		}, OUTER_BUTTON_CLICK_TIMEOUT + 200)
		
	}

	function sequenceMistake () {
		clearInterval(playSequence); // outside of the timeout sequence so that if the sequence is being shown, it is stopped instantly
		setTimeout( function () {
			clearInterval(playSequence); // used a second time inside the timeout to prevent issues when the function is called multiple times in quick succession
			if (isStrict) {
				startGame();
			}
			else {
				currentSequence = [];
				showSequence();
			}	
		}, 	OUTER_BUTTON_CLICK_TIMEOUT + 600);
	}

	function nextRound () {
		if (roundCounter === maxRounds) {
			roundCounterFlashText("WIN");
			return;
		}
		else {
			roundCounter++;
			roundCounterFlashText(roundCounter);
			showSequence();
		}
	}

	function outerButtonsClickEvent (button, buttonIndex) {
		button.addEventListener("mousedown", function () {
			if (gamePhase === "sequence-input") {
				outerButtonsClickColor(button, buttonIndex);
				if (button === currentSequence[0]) {
					currentSequence.shift();
					playButtonSound(buttonIndex);
					if (currentSequence.length === 0) setTimeout(nextRound, OUTER_BUTTON_CLICK_TIMEOUT + 600);
				}
				else if (button !== currentSequence[0]) {
					playButtonSound(4);
					sequenceMistake();
				}				
			}
		})	
	}

	function playButtonSound (buttonIndex) {
		OUTER_BUTTON_SOUNDS_ARRAY[buttonIndex].play();
	}

	function startGame () {
		currentSequence = [];
		fullSequence = [];
		roundCounter = 0;
		generateSequence();	
		nextRound();
	}

	//		****		CSS			****


	function outerButtonsClickColor (button, buttonIndex) {
		button.style.backgroundColor = OUTER_BUTTON_CLICK_COLORS[buttonIndex];
		setTimeout(function () {
			button.style.backgroundColor = OUTER_BUTTON_ORIGIN_COLORS[buttonIndex];
		}, OUTER_BUTTON_CLICK_TIMEOUT)
	}

	function strictButtonToggleDisplay () {
		if (isStrict) {
			STRICT_BUTTON.classList.add("strict-off")
			STRICT_BUTTON.classList.remove("strict-on")
		}
		else {
			STRICT_BUTTON.classList.add("strict-on")
			STRICT_BUTTON.classList.remove("strict-off")
		}
	}

	function roundCounterFlashText (text) {
		var i = 0;
		var flashInterval = setInterval(function () {
			if (i === 1) clearInterval(flashInterval);
			setTimeout(function () {
				ROUND_COUNTER_DISPLAY.textContent = "";
			}, 100)
			setTimeout(function () {
				ROUND_COUNTER_DISPLAY.textContent = text;
			}, 300)
			i++;
		}, 400)
	}


	//		****		UTILITIES			****


	function toArray (nodeList) {
		var newArray = [];
		for (var i = 0; i < nodeList.length; i++) {
			newArray.push(nodeList[i]);
		}
		return newArray;
	} 
})

