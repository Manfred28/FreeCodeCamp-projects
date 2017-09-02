$(document).ready(function() {
  var sessionNum = $("#sessionNum > span").text();
  var sessionLength = $("#sessionLength > span").text();
  var breakLength = $("#breakLength > span").text();
  var sessionOngoing = true;
  var currentSeconds = 0;
  var currentMinutes = sessionLength;
  var clockActive = false;
  var countback = null;
  var totalSeconds = 0;

  // Main

  $(".clock").click(function() {
    calculateTotalSeconds();
    clockActive ? stopCountback() : startCountback();
  });
  $("button").click(function() {  //functionality of "+" "-" buttons
    if (clockActive) return;
    else {
      var parameter = $(this).parent().attr("id");
      var parameterText = $(this).siblings("span");
      var buttonValue = $(this).attr("value")
      switch (parameter) {
        case "sessionNum":
          sessionNum = adjustClockParameter(sessionNum, buttonValue);
          parameterText.text(sessionNum);
          break;
        case "sessionLength":
          sessionLength = adjustClockParameter(sessionLength, buttonValue);
          parameterText.text(sessionLength);
          if (sessionOngoing) {
            currentMinutes = sessionLength;
            currentSeconds = 0;
          }
          break;
        case "breakLength":
          breakLength = adjustClockParameter(breakLength, buttonValue);
          parameterText.text(breakLength);
          if (!sessionOngoing) {
            currentMinutes = breakLength;
            currentSeconds = 0;
          }
          break;
      }
      updateClockDisplay();
    }
  });

  // Function definitions

  function startCountback() {
    clockActive = true;
    countback = setInterval(count, 1000);
    $(".clock > div:nth-child(1)").text("Click to Stop");
  }

  function count() {
    if (currentSeconds === 0 && currentMinutes === 0) switchSessionBreak();
    else if (sessionNum != 0) {
      reduceSeconds();
      updateClockDisplay();
      updateClockBackground(); //css
    } else {
      stopCountback();
      $(".clock > div:nth-child(1)").text("Finished");
    }
  }

  function stopCountback() {
    clockActive = false;
    clearInterval(countback);
    $(".clock > div:nth-child(1)").text("Click to Start");
  }

  function reduceSeconds() {
    currentSeconds--;
    if (currentSeconds < 0) {
      currentSeconds = 59;
      currentMinutes--;
    }
  }

  function updateClockDisplay() {
    if (currentSeconds < 10) {
      $(".clock > div:nth-child(2)").text(currentMinutes + ":0" + currentSeconds);
    } else {
      $(".clock > div:nth-child(2)").text(currentMinutes + ":" + currentSeconds);
    }
  }

  function startSession() {
    sessionOngoing = true;
    sessionNum--;
    $("#sessionNum > span").text(sessionNum);
    currentSeconds = 0;
    currentMinutes = sessionLength;
    calculateTotalSeconds();
  }

  function startBreak() {
    sessionOngoing = false;
    currentMinutes = breakLength;
    currentSeconds = 0;
    calculateTotalSeconds();
  }

  function switchSessionBreak() {
    document.querySelector("audio").play();
    if (sessionOngoing === true) startBreak();
    else startSession();
  }

  function adjustClockParameter(parameter, buttonValue) {
    if (buttonValue === "+" && parameter < 60) {
      parameter++;
    } else if (buttonValue === "-" && parameter > 1) {
      parameter--;
    }
    return parameter;
  }

  // CSS

  function calculateTotalSeconds() {
    sessionOngoing ? totalSeconds = sessionLength * 60 : totalSeconds = breakLength * 60;
  }

  function updateClockBackground() {
    var gradientPercentage = Math.floor((currentMinutes * 60 + currentSeconds) / totalSeconds * 100);
    sessionOngoing ?
      $(".clock").css("backgroundImage", "linear-gradient(#ff704d 0%, #ff704d " + gradientPercentage + "%, #ff0000 " + gradientPercentage + "%, #ff0000 100%)") :
      $(".clock").css("backgroundImage", "linear-gradient(to top, #ff0000 0%, #ff0000 " + gradientPercentage + "%, #ff704d " + gradientPercentage + "%, #ff704d 100%)");
  }
})
