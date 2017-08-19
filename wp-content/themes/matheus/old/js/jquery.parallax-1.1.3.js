/*
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

(function( $ ){
	var $window = $(window);
	var windowHeight = $window.height();
	var windowWidth = $window.width();

	$window.resize(function () {
		windowHeight = $window.height();
		windowWidth = $window.width();
	});

	$.fn.parallax = function(xpos, speedFactor, outerHeight) {
		var $this = $(this);
		var getHeight;
		var firstTop;
		var paddingTop = 0;
		
		//get the starting position of each element to have parallax applied to it		
		$this.each(function(){
		    firstTop = $this.offset().top;
		});

		if (outerHeight) {
			getHeight = function(jqo) {
				return jqo.outerHeight(true);
			};
		} else {
			getHeight = function(jqo) {
				return jqo.height();
			};
		}
			
		// setup defaults if arguments aren't specified
		if (arguments.length < 1 || xpos === null) xpos = "50%";
		if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
		if (arguments.length < 3 || outerHeight === null) outerHeight = true;
		
		// function to be called whenever the window is scrolled or resized
		function update(){
			var pos = $window.scrollTop();				

			$this.each(function(){
				var $element = $(this);
				var top = $element.offset().top;
				var height = getHeight($element);

				// Check if totally above or totally below viewport
				if (top + height < pos || top > pos + windowHeight) {
					return;
				}

				$this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
			});
		}		

		$window.bind('scroll', update).resize(update);
		update();
	};
	
	$.fn.horparallax = function(ypos, speedFactor, outerWidth) {
		var $this = $(this);
		var getWidth;
		var firstLeft;
		var paddingLeft = 0;
		
		//get the starting position of each element to have parallax applied to it		
		$this.each(function(){
		    firstLeft = $this.offset().left;
		});

		if (outerWidth) {
			getWidth = function(jqo) {
				return jqo.outerWidth(true);
			};
		} else {
			getWidth = function(jqo) {
				return jqo.width();
			};
		}
			
		// setup defaults if arguments aren't specified
		if (arguments.length < 1 || ypos === null) ypos = "50%";
		if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
		if (arguments.length < 3 || outerWidth === null) outerWidth = true;
		
		// function to be called whenever the window is scrolled or resized
		function update(){
			var pos = $window.scrollLeft();				

			$this.each(function(){
				var $element = $(this);
				var left = $element.offset().left;
				var width = getWidth($element);

				// Check if totally above or totally below viewport
				if (left + width < pos || left > pos + windowWidth) {
					return;
				}

				$this.css('left', Math.round((firstLeft + pos) * speedFactor *-1) + "px");
			});
		}		

		$window.bind('scroll', update).resize(update);
		update();
	};
	
})(jQuery);
