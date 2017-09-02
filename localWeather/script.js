$(document).ready(function() {
  var locationInfo = {
    "city" : "",
    "countryCode" : ""
  }
  var currentWeather = {
    "description" : "",
    "iconUrl" : "",
    "tempC" : 0,
    "tempF" : 0
  }


  $("#weather").hide();
  getLocation(getCurrentWeather)
  $("#temp-value + span").click(temperatureConversion)


  function getLocation(callback) {
    // Gets the location of user by IP address
    $.getJSON("https://ipapi.co/json/", function(location) {
      var apiQueryLink = "";
      var corsHelper = "https://cors-anywhere.herokuapp.com/"; // openweathermap.org only works with http

      locationInfo.city = location["city"];
      locationInfo.countryCode = location["country"];
      apiQueryLink = corsHelper + "http://api.openweathermap.org/data/2.5/weather?q=" + locationInfo.city + "," + locationInfo.countryCode.toLowerCase() + "&units=metric&APPID=d45b32391fcfc7452efdef81c0db297b";

      if (typeof(callback) === "function") callback(apiQueryLink);
    })
  }

  function getCurrentWeather(apiQueryLink) {
    $.getJSON(apiQueryLink, function(weatherInfo) {
      getTemperature(weatherInfo);
      getWeatherDescription(weatherInfo);
      createIconUrl(weatherInfo);
      renderWeatherInfo(weatherInfo);
    })
  }

  function getTemperature(weatherInfo) {
    currentWeather.tempC = weatherInfo["main"]["temp"]; // displayed by default
    currentWeather.tempF = Math.floor(currentWeather.tempC * 1.8 + 32);
  }

  function getWeatherDescription(weatherInfo) {
    currentWeather.description = weatherInfo["weather"][0]["description"];
  }

  function createIconUrl(weatherInfo) {
    var iconLocation = "http://openweathermap.org/img/w/";
    var iconCode = weatherInfo["weather"][0]["icon"];
    currentWeather.iconUrl = iconLocation + iconCode + ".png";
  }

  function renderWeatherInfo() {
    $("#weather > div:nth-child(1) span").text(locationInfo.city + ", " + locationInfo.countryCode);
    $("#temp-value").text(currentWeather.tempC);
    $("#weather > div:nth-child(3) span").text(toTitleCase(currentWeather.description));
    $("#weather > div:nth-child(3) img").attr("src", currentWeather.iconUrl);
    $("#loading").hide();
    $("#weather").fadeIn("slow");
  }

  function temperatureConversion() {
    // probably badly named, does not do actual conversion, changes displayed value
    var $temperatureScale = $("#temp-value + span");
    var $temperatureValue = $("#temp-value");
    var $temperatureContainer = $("#weather div:nth-child(2) span");

    if ($temperatureScale.text() === "°C") {
      $temperatureContainer.fadeOut("fast", function() {
        $temperatureScale.text("°F");
        $temperatureValue.text(currentWeather.tempF);
        $temperatureContainer.fadeIn("fast");
      })
    } else {
      $temperatureContainer.fadeOut("fast", function() {
        $temperatureScale.text("°C");
        $temperatureValue.text(currentWeather.tempC);
        $temperatureContainer.fadeIn("fast");
      })
    }
  }

  // Utility

  function toTitleCase(text) {
    var newChar = ""
    text = text.split(" ");

    for (var i = 0; i < text.length; i++) {
      newChar = text[i].toUpperCase().charAt(0);
      text[i] = newChar + text[i].substr(1);
    }
    text = text.join(" ");
    return text;
  }

})
