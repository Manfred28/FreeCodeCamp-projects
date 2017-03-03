(function () {

function randomNum() {
	var min = 1;
	var max = 3;
	return Math.floor((Math.random() * 3) +1 );
}


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

function transform () {
	transType = chooseTrans()
	var elem = document.querySelectorAll(".postColumn article img");
	for (i = 0; i < elem.length; i++) {
		elem[i].style.transform = transType;
		elem[i].style.width = "0px";
	};
	console.log(transType);
};

function transformBack () {
	var elem = document.querySelectorAll(".postColumn article img");
	for (i = 0; i < elem.length; i++) {
		elem[i].style.width = "100%";
		if (transType === ("scale(0.5)")) {
			elem[i].style.transform = "scale(1)";
		};
		if (transType === "rotate(180deg)") {
			elem[i].style.transform = "rotate(360deg)"
		}
		if (transType === "skew(20deg, 40deg)") {
			elem[i].style.transform = "skew(0deg, 0deg)"
		}
	}
}

window.transform = transform;
window.transformBack = transformBack;
})(window)