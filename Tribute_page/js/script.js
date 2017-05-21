$(document).ready(function () {
var navLinks = $(".navbar-nav a");


	navLinkActiveOnClick();
	navLinkActiveOnScoll();


	function navLinkActiveOnClick () {
		navLinks.click(function (link) {
			navLinks.removeClass("active");
			$(this).addClass("active");
			$('.navbar-collapse').collapse('hide');
		})
	}

	function navLinkActiveOnScoll () {
		//add support for scrolling to bot
		$(window).on('scroll', function () {
			var sectionLinks = $(".section-title > a");
			var navHeight = $('nav').outerHeight();
			var curPos = $(this).scrollTop();
			var docHeight = $(document).height();
			var windowHeight = $(window).height();

			sectionLinks.each(function () {
				var top = $(this).offset().top - navHeight * 2; // navHeight is multiplied by 2 to make the section active a bit earlier
				var bottom = top + $(this).outerHeight();
				if (curPos >= top && curPos >= bottom) {
					navLinks.removeClass("active");
					$("nav").find('a[href="#' + $(this).attr("id") + '"]').addClass("active");
				}
				 //to make sure that the last section gets the active tag when the bottom of the page is reached
				if (docHeight - curPos - windowHeight < 100 ) {
					navLinks.removeClass("active");
					$("nav").find('a[href="#' + $(this).attr("id") + '"]').addClass("active");
				};
			})
		})
	}
})
