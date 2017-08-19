/*
    Fullscreen background is a small jQuery plugin that allows you to create fullscreen background.

    Author:     Gaya Kessler
    Date:       04-25-2012
    URL:        http://www.gayadesign.com
*/

(function ($) {
    var parentElement = "";
    var optionsArr = {
        selector: "img",
        fillOnResize: true,
        defaultCss: true
    };

    $.fn.fullscreenBackground = function (options) {
        if(options) {
            $.extend(optionsArr, options );
        }

        this.each(function () {
            parentElement = this;

            if (optionsArr.defaultCss == true) {
                $("html,body").css({
                    /*width: "100%",
                    height: "100%"*/
                });

                $(parentElement).css({
                    /*height: "100%",
                    width: "100%",*/
                    //overflow: "hidden",
                    position: "relative",
                    //top: "0px",
                    //left: "0px",
                    zIndex: 1
                });
            }

            if (optionsArr.fillOnResize == true) {
                $(window).resize(function () {
                    fillBg(optionsArr.selector, parentElement);
                });
            }

            fillBg(optionsArr.selector, parentElement);
        });
    };

    function fillBg(selector, parentobj) {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();

        $(selector, parentobj).each(function () {
			var imgHeight = $('img.moneyshot').attr("height");
			var imgWidth = $('img.moneyshot').attr("width");	

			//var galImgHeight = $('.popupbox img').attr("height");

            var newWidth = windowWidth;
            //var newHeight = (windowWidth / imgWidth) * imgHeight;
			var newHeight = windowHeight;
		
			var topMargin = ((newHeight - windowHeight) / 2) * -1;
            var leftMargin = 0;

            /*if (newHeight < windowHeight) {
                var newWidth = (windowHeight / imgHeight) * imgWidth;
                var newHeight = windowHeight;
                var topMargin = 0;
                var leftMargin = ((newWidth - windowWidth) / 2) * -1;
            }*/
			
			
			// matheus' function for moneyshot
			/*if (newHeight > 750) {
				$('img.moneyshot').css({
					right: 0,
					left: 'auto'
				});
			}
			else {
				$('img.moneyshot').css({
					left: 0,
					right: 'auto'
				});
			}*/
			
			/*if( windowHeight <= 560) {
				$('img.moneyshot').css({
					height: 560,
					marginLeft: leftMargin + "px",
					display: "block"
				});
			} else { 
				$('img.moneyshot').css({
					height: newHeight + "px",
					//width: newWidth + "px",
					marginLeft: leftMargin + "px",
					//marginTop: topMargin + "px",
					display: "block"
				});
			}*/
				
				//matheus' function for detecting scroll pop-up message
				
				
        });
    }
})(jQuery);