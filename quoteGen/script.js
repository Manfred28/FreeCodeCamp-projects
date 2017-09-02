$(document).ready(function() {

  var quoteList = [];
  var currentQuote = "";
  var bShadowValue = 5;
  var shadowIsGrowing = false;

  //  QUOTE FUNCTIONS

  $.getJSON("https://manfred28.github.io/FreeCodeCamp-projects/quotegen/WOTquotes.json", function(quotes) {
    for (q in quotes) {
      quoteList.push(quotes[q]);
    }
  });

  function randQuote() {
    var quoteId = Math.floor(Math.random() * quoteList.length);
    return quoteList[quoteId];
  };


  // BUTTON FUNCTIONS

  $("#quoteBtn")
    .click(function() {
      currentQuote = randQuote();
      $('#quote')
        .addClass('animated fadeIn')
        .text(currentQuote)
      tweetQuote();
    })
    .mouseup(function() {
      $('#quote')
        .removeClass('animated fadeIn');
      bShadowChange();
    });

  function tweetQuote() {
    var twitterHref = "https://twitter.com/intent/tweet?text=" + currentQuote + "&hashtags=WOTQuote";
    $("#twitter").attr("href", twitterHref);
  };

  // CSS

  function bShadowChange() {
    bShadow = "1px 1px " + bShadowValue + "px " + bShadowValue + "px " + "#d2a679";
    $("#quoteWindow").css("box-shadow", bShadow);
    if (bShadowValue <= 25 && shadowIsGrowing === false) {
      if (bShadowValue === 25) {
        shadowIsGrowing = true;
      }
      return bShadowValue += 5;
    } else {
      if (bShadowValue === 5) shadowIsGrowing = false;
      return bShadowValue -= 5;
    }
  }
})
