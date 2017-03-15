(function () {

function randomNum() {
	var min = 1;
	var max = 3;
	return Math.floor((Math.random() * 3) +1 );
}

													//  *************** RANDOM ANIMATION ON WINDOW
function chooseTrans () {
	var number1 = randomNum();
	if (number1 === 1) {
		return "scale(0.5)"
	}

	else if (number1 === 2) {
		return "rotate(180deg)"	
	}
	else {
		return "skew(20deg, 40deg)"
	}
};

var transType = ""

function transform (self) {
	transType = chooseTrans()
		self.style.transform = transType;
		self.style.width = "0px";
};

function transformBack (self) {
	var elem = document.querySelectorAll(".postColumn article img");
		self.style.width = "100%";
		if (transType === ("scale(0.5)")) {
			self.style.transform = "scale(1)";
		};
		if (transType === "rotate(180deg)") {
			self.style.transform = "rotate(360deg)"
		};
		if (transType === "skew(20deg, 40deg)") {
			self.style.transform = "skew(0deg, 0deg)"
		};
	
}

window.transform = transform;
window.transformBack = transformBack;


												// EVENTLISTENER STUFF

window.addEventListener("keydown", function (a) {	
	if (a.keyCode === 65) {
		document.querySelector(".test3").classList.toggle("test3test");
	}
})

window.addEventListener("keyup", function (a) {
	if (a.keyCode === 65) {
		document.querySelector(".test3").classList.remove("test3test");
	}
})

												// IDK JSON WITH JQUERY
$(document).ready(function () {
	$("#test5 ").click(function() {
		$("#test4 > div").text("");  //clears any image / text currently in the box
		var movieTitle = $("#movieTitle").val();
		movieTitle = movieTitle.split(" ").join("+");
		console.log(movieTitle);
		$.getJSON("https://api.themoviedb.org/3/search/movie?api_key=fabab376626db9d67b0edc58f625e1f0&query=" + movieTitle, function(data) {
			console.log(data);
			if (data.results[0].poster_path === null){
				$("#test4 > div").append("No Image Found")
				return ;
			} 
			
			$("#test4 > div").append("<img src='https://image.tmdb.org/t/p/w640" + data.results[0].poster_path + "'>");

		})
	})

});


})(window)