(function ($) {
	"use strict";

	/*----------- 01 Preloader -------*/
	function preloader_load() {
		if ($('.page-preloader').length) {
			$('.page-preloader').delay(200).fadeOut(400);
		}
	}

	/*----------- 02 Magnific popup -------*/

	$(document).ready(function () {
	$('.video-popup').magnificPopup({
		type: 'iframe',
		iframe: {
			markup: '<div class="mfp-iframe-scaler">' +
				'<div class="mfp-close"></div>' +
				'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
				'</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button

			patterns: {
				youtube: {
					index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

					id: 'v=', // String that splits URL in a two parts, second part should be %id%
					// Or null - full URL will be returned
					// Or a function that should return %id%, for example:
					// id: function(url) { return 'parsed id'; }

					src: 'https://www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
				},
				vimeo: {
					index: 'vimeo.com/',
					id: '/',
					src: 'https://player.vimeo.com/video/%id%?autoplay=1'
				},
				gmaps: {
					index: 'https://maps.google.',
					src: '%id%&output=embed'
				},


				dailymotion: {

					index: 'dailymotion.com',

					id: function (url) {
						var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
						if (m !== null) {
							if (m[4] !== undefined) {

								return m[4];
							}
							return m[2];
						}
						return null;
					},

					src: 'https://www.dailymotion.com/embed/video/%id%'

				}

				// you may add here more sources



			},

			srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
		}


	});
	if ($('.popup-img').length) {
		$(".popup-img").magnificPopup({
			type: "image",
			gallery: {
				enabled: true,
			}

		});
	}

		});
	
	
	/*----------- 03 Fact counter -------*/
	$(document).ready(function () {
		$('h4.fact-timer').counterUp({
			delay: 5,
			time: 2000
		});
	});

	/*----------- 04 Wow animation -------*/
	function wowAnimation() {
		var wow = new WOW({
			animateClass: 'animated',
			mobile: true, // trigger animations on mobile devices (default is true)
			offset: 0
		});
		wow.init();
	}



	/*----------- 06 Scroll to top -------*/
	function scrollToTopppp() {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 0) {
				$('.scrollToAbout').fadeIn();
			} else {
				$('.scrollToAbout').fadeOut();
			}
		});

		//Click event to scroll to top
		$('.scrollToAbout').on('click', function () {
			$('html, body').animate({
				scrollTop: 1200
			});
			return false;
		});
	}

	/*----------- 06 Scroll to top -------*/
	function scrollToHead() {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 200) {
				$('.scrollToTop').fadeIn();
			} else {
				$('.scrollToTop').fadeOut();
			}
		});

		//Click event to scroll to top
		$('.scrollToTop').on('click', function () {
			$('html, body').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	}

	/*----------- 07 Carousel -------*/
	/* Home iphone carousel */
	$('#home-iphone-gallery').carousel({
		interval: 5000,
		autoplay:true,

	});

	/* Apps showcase carousel */
	$('#app-carousel').carousel({
		interval: 5000,
		autoplay:true,
	});

	/* Review carousel */
	$('#review-carousel').carousel({
		interval: false
	});

	/* teams carousel */
	$('#team-carousel').carousel({
		interval: false
	});

	/* Blog Gallery carousel */
	$('#blog-carousel').carousel({
		interval: 5000
	});

	var animtime = 750; // milliseconds for clients carousel

	// prev & next btns for testimonials

	$('#prev-review').on('click', function () {
		var $last = $('.reviewsetup li:last');
		$last.remove().css({
			'margin-left': '-360px'
		});
		$('.reviewsetup li:first').before($last);
		$last.animate({
			'margin-left': '0px'
		}, animtime);
	});

	$('#next-review').on('click', function () {
		var $first = $('.reviewsetup li:first');
		$first.animate({
			'margin-left': '-760px'
		}, animtime, function () {
			$first.remove().css({
				'margin-left': '0px'
			});
			$('.reviewsetup li:last').after($first);
		});
	});

	// prev & next btns for testimonials

	$('#prev-team').on('click', function () {
		var $last = $('.teamsetup li:last');
		$last.remove().css({
			'margin-left': '-100px'
		});
		$('.teamsetup li:first').before($last);
		$last.animate({
			'margin-left': '0px'
		}, animtime);
	});

	$('#next-team').on('click', function () {
		var $first = $('.teamsetup li:first');
		$first.animate({
			'margin-left': '-100px'
		}, animtime, function () {
			$first.remove().css({
				'margin-left': '0px'
			});
			$('.teamsetup li:last').after($first);
		});
	});

	/*----------- When document is ready, do -------*/
	$(document).on('ready', function () {
		wowAnimation();
		scrollToHead();
		scrollToTopppp();
	});

	/*----------- When document is Scrollig, do -------*/
	// window on Scroll function
	$(window).on('scroll', function () {
		// add your functions
	});

	/*----------- When document is loading, do -------*/
	$(window).on('load', function () {
		// add your functions
		preloader_load();
		
	});

	/*----------- When Window is resizing, do -------*/
	$(window).on('resize', function () {
		// add your functions
	});


})(window.jQuery);