$(function() {
	
	"use strict";


// Lazy Load
// $("img.lazy").lazyload({
// 	// effect : 'fadeToggle',
// 	// threshold: 100
// });

$("img.lazy").lazyLoadXT({
	srcAttr: 'data-src'
});



// Login / Register
$('.ht-wrapper').on('click', '.ht-logreg', function() {
	$('.logreg').show();
});

$('.lr-item').on('click', '.lr-header', function() {
	$('.logreg').hide();
});

$('.lr-nav li').on('click', 'a', function(e) {
	e.preventDefault();

	var id = $(this).parent().index();

	$('.lr-nav').find('li').removeClass('active').eq(id).addClass('active');

	$('.lr-content').find('li').hide();
	$('.lr-content').find('li').eq(id).show();
});



/************** Nav **************/
$('.dropdown a.nav-link').on('click', function(e) {

	var $this = $(this);
  	if (!$this.next().hasClass('show')) {
		$('.dropdown-menu').not($this.parents('.nav-item').find('.dropdown-menu')).removeClass('show');
	    $this.parents('.dropdown-menu').first().find('.show').removeClass("show");
	}

	if ($this.next().hasClass('show')) {
		$('.dropdown-menu').not($this.parents('.nav-item').find('.dropdown-menu')).removeClass('show');
	    $this.parent().find('.dropdown-menu').find('.show').removeClass("show");
	}

  	if($this.parent().hasClass('nav-megamenu')) {
		$('.dropdown-menu').not($this.parent().find('.dropdown-menu')).removeClass('show');
  		
		$this.parent().find('.dropdown-menu').toggleClass('show');
  	}
  	
  	var $subMenu = $this.next(".dropdown-menu");
  	$subMenu.toggleClass('show');


	// $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
 //    	$('.dropdown-menu .show').removeClass("show");
 //  	});

	return false;
});

$(document).ready(function(){

	function splitEffect(effect, split) {
		var eff = effect.split(split);
		var res;

		for(var i = 0; i < eff.length; i++) {
			res += eff.join(',');
		}

		return res;
	}

	var hazelClass = '.hazel-slider-',
		hazelLastIndex = $('.hazel-slider').last().data('index');

	for (var i = 1; i <= hazelLastIndex; i++) {
		$(hazelClass + i).hazelSlider({
			auto   : $(hazelClass + i).data('auto'), /* Default true*/
			// background : 'rgba(255, 255, 255, 1)', /* Default rgba(255, 255, 255, 1) */
			slice  : $(hazelClass + i).data('slice'), /* Default 7 */
			// width  : $(hazelClass + i).data('width'), /* Default 'auto' */
			// height : $(hazelClass + i).data('height'), /* Default 'auto' */
			// imageHeightRatio : 52 /* Default 52 (52% - width * imageHeightRatio / 100) */
			namespace : 'hazel-slider',
			item : 'hazel-slider-item',	
			contentID : 'hazel_slider_content',
			contentEffect : $(hazelClass + i).data('contenteffect'), /* Max 2*/
			pieceNum : 1, /* Max 1*/
			random : $(hazelClass + i).data('random'), /* Default true*/
			effects : JSON.parse("["+ $(hazelClass + i).data('effects') +"]"), /* Max 5 [1, 2, 3, 4, 5] */
			delay  : $(hazelClass + i).data('delay'), /* Default 6000*/
			animateTime : $(hazelClass + i).data('atime') /* Default 1500*/
		});
	}


});


/* Owl Carousel */
$.owlNav = function() {
	var owlImgHeight = $('.carousel-content').height();
	$('.carousel-content.owl-nav').css({'top': (owlImgHeight / 2 - 20) + 'px'});
}

$(window).resize(function() {
	$.owlNav();
});

$(document).ready(function(){
	$.owlNav();

	$('.carousel-content .owl-carousel').owlCarousel({
	    loop:true,
	    responsiveClass:true,
	    items: 1,
	    nav: true
	});

	$('.sb-card .owl-carousel').owlCarousel({
	    loop:true,
	    responsiveClass:true,
	    items: 1,
	    nav: true,
	    autoplay:true,
	    autoplayTimeout:2500,
	    autoplayHoverPause:true
	});
	$('.play').on('click',function(){
	    owl.trigger('play.owl.autoplay',[2000])
	});
	$('.stop').on('click',function(){
	    owl.trigger('stop.owl.autoplay')
	});

});
























});