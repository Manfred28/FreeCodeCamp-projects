$(document).ready(function () {
var navLinks = $(".navbar-nav a");
var sectionLinks = $(".section-title > a");
var navHeight = $('nav').outerHeight();

	navLinkActiveOnScoll();
	navLinkScrollOnClick();
	navBrandScrollToTop();




	function navLinkActiveOnScoll () {
		//add support for scrolling to bot
		$(window).on('scroll', function () {
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

	function scrollToSection (selector) {
		$(document.body).animate({
			"scrollTop" : selector.offset().top - navHeight * 1.5
		}, 800);
	}

	function navLinkScrollOnClick () {
		navLinks.click(function () {
			var section = $(".section-title > a[id='" + $(this).attr("href").slice(1) + "']");
			scrollToSection(section);
		})
	}

	function navBrandScrollToTop () {
		$("a[href='#top']").click(function () {
			 scrollToSection($("#top"));
		})
	}
})
