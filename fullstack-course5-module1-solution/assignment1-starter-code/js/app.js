(function() {
"use strict";

angular.module("LunchCheck", [])
.controller("LunchCheckController", LunchCheckController);
LunchCheckController.$inject = ["$scope"];

function LunchCheckController ($scope) {
	$scope.lunch = "";
	$scope.message = "";
	$scope.CheckItems = function () {

		var itemList = $scope.lunch.split(",");
		itemList = removeEmptyItem(itemList);
		document.querySelector(".message").style.color = "green";
		document.getElementById("lunch-menu").style.borderColor = "green";
		if ($scope.lunch === "") {
			$scope.message = "Please enter data first";
			document.querySelector(".message").style.color = "red";
			document.getElementById("lunch-menu").style.borderColor = "red";
		}
		else if (itemList.length <= 3) {
			$scope.message = "Enjoy!" ;
		}
		else if (itemList.length > 3) {
			$scope.message = "Too much!";
		}
		console.log(itemList);
	};

	function removeEmptyItem (itemList) {
		for (var i = 0; i < itemList.length; i++) {
			if (itemList[i] === "" || itemList[i] === " ") {
				console.log(itemList);
				itemList.splice(i, 1);
				console.log(itemList);
			};			
		};
		return itemList;
	}

}; 
})();