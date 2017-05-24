$(document).ready(function () {
var navLinks = $(".navbar-nav a");
var sectionLinks = $(".section-title > a");
var navHeight = $('nav').outerHeight();

	$(window).on('scroll', activateLinkOnScroll);
	navLinkActiveOnClick();
	navBrandScrollToTop();


	function navLinkActiveOnClick () {
		navLinks.click(function () {
			var section = $(".section-title > a[id='" + $(this).attr("href").slice(1) + "']");
			navLinks.removeClass("active");
			$(this).addClass("active");
			$('.navbar-collapse').collapse('hide');
			$(window).off('scroll', activateLinkOnScroll);
			scrollToSection(section);
		})
	}

	function addScrollEventListener () {
		$(window).on('scroll', activateLinkOnScroll);
	}

	function activateLinkOnScroll () {
		var curPos = $(this).scrollTop();
		var docHeight = $(document).height();
		var windowHeight = $(window).height();

		sectionLinks.each(function () {
			var top = $(this).offset().top - navHeight * 3; // navHeight is multiplied by 3 to make the section active a bit earlier
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
	}

	function scrollToSection (selector) {
		$(document.body).animate({
			"scrollTop" : selector.offset().top - navHeight * 1.5
		}, 800);
		setTimeout(function () {
			$(window).on('scroll', activateLinkOnScroll);
		}, 800)
	}

	function navBrandScrollToTop () {
		$("a[href='#top']").click(function () {
			scrollToSection($("#top"));
		})
	}
})
