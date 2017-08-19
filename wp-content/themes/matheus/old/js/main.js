var _gaq = _gaq || []; 
var pluginUrl = 
'//www.google-analytics.com/plugins/ga/inpage_linkid.js';
_gaq.push(['_require', 'inpage_linkid', pluginUrl]);
_gaq.push(['_setAccount', 'UA-12119947-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(window).load( function() {
  var cookieName = 'firstTimerTut';
  var firstTimer = 1;
  if(!$.cookie(cookieName, {domain:'matheus.li'})){
    if (!Modernizr.touch){
      $(".conoverlay").fadeIn(300);
      $('.tutorial').show();
      $('.contactnow').hide();
      firstTimer = 0;
      $.cookie(cookieName, firstTimer, { expires: 365, domain: 'matheus.li' });
      animatePanning();
    }
  }

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=502675583087434";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
    FB.Event.subscribe('edge.create', function(targetUrl) {
      _gaq.push(['_trackSocial', 'facebook', 'like', targetUrl]);
    });
    FB.Event.subscribe('edge.remove', function(targetUrl) {
      _gaq.push(['_trackSocial', 'facebook', 'unlike', targetUrl]);
    });
    FB.Event.subscribe('message.send', function(targetUrl) {
      _gaq.push(['_trackSocial', 'facebook', 'send', targetUrl]);
    });
  };

});

function animatePanning() {
  var $body = $('.panning img');
  cycle = function() {
    $body.delay(1000)
      .animate({left:'-420'}, 5000)
      .delay(1000)
      .animate({left:'0'}, 8000, cycle);
  };
}

/* Motion parallax */
var strength  = 10;
var strength1 = 5;
var strength3 = 10;
$("html").mousemove(function(e){
  var pageX = e.pageX - ($(window).width() / 2);
  var pageY = e.pageY - ($(window).height() / 2);
  var newvalueX = 1* pageX * -1;
  var newvalueY = 1* pageY * -1;
  $('ul.big.cfix').css("margin-left", (strength / $(window).width() * pageX ) +"px");
  $('img.background').css("margin-left", (strength1 / $(window).width() * pageX * -1)-100 +"px");
  $('img.foreground').css("margin-left", (strength3 / $(window).width() * pageX * -1)-100 +"px");
});

$(document).ready(function () {
  // cookie page scroll
  if( $.cookie( 'pageScrollHome', { domain: 'matheusdesain.com' }) ) {
    $('content').scrollLeft($.cookie('pageScrollHome'));
  }
  $('content').scroll( function(){
    var lastLocation = $(this).scrollLeft();
    $.cookie('pageScrollHome', lastLocation, { domain: 'matheusdesain.com' });
  });
  $(window).unload(function () {
      $.cookie('pageScrollHome', null);
  });

  // middle align the content
  function alignMiddle() {
    wHeight = $(window).height();
    midCalculation = wHeight / 2 - 270;
    $('ul.big.cfix').css('padding-top', midCalculation);
    $('.subnav').css('top', midCalculation+400);
  } alignMiddle();
  
  // horizontal page scroll
  function scrollhorizontal() {
    $('content').mousewheel(function(event, delta) {
      if ($('.conoverlay').hasClass('active')) {
        return;
      } else {
        var distance = delta * event.deltaFactor;
        this.scrollLeft -= distance;
        event.preventDefault();
      }
    });
  }
  
  // fixed icos position
  $('.conoverlay').scroll( function() {
    var fixedicos = $('.conoverlay').scrollTop();
    $('.popupbox .icos').stop().animate({ 'top': fixedicos },400);
  });
  scrollhorizontal();
  
  // hover effect
  $(".hover-eff img.grey").hover(
    function() {
      $(this).stop().animate({"opacity": "0"}, 300);
    },
    function() {
      $(this).stop().animate({"opacity": "1"}, 300);
  });
      
  // slider after expansive
  $('.jq-slider').slides({
    preload: true,
    }); 
  
  // width counter
  var totalWidth = 0;
  $("ul.cfix").children().each(function() {
    totalWidth = totalWidth + $(this).outerWidth(true);
  });
  totalWidth = totalWidth + 30;
  $('ul.cfix').css( 'width', totalWidth);
  
  /** init scroll bar **/
  var totalScrollableWidth,
      totalOfScrollableTracker,
      convertNumber,
      transRealPosition,
      numberPixelScrolll,convertPercent,
      amountOfBarTravelled;
  
  function repositionBar() {
    if(!Modernizr.touch) {
      totalScrollableWidth = totalWidth - ($('html').width());
      numberPixelScrolll = $('content').scrollLeft();
      convertPercent = numberPixelScrolll / totalScrollableWidth;
      totalOfScrollableTracker = ($('html').width()) - 50; // 50 equals to handler's width
      amountOfBarTravelled = convertPercent * totalOfScrollableTracker;
      $('.handler').css({'left': amountOfBarTravelled});
    }
  }
  
  $('content').scroll( function() {
    if(!Modernizr.touch) {
      repositionBar();
      $('.scrollbar.vertical > div').css('bottom', '0px');
      
      clearTimeout(this.id);
      this.id = setTimeout(function(){
        $('.scrollbar.vertical > div').css('bottom', ''); 
      }, 500);
    }
  });
  $(window).resize( function() {
    repositionBar(); alignMiddle();
  });
  
  if(!Modernizr.touch) {
    $('.handler').draggable({ 
      axis: 'x',
      containment: 'parent',
      drag: function( event, ui ) {
        
        var totalOfScrollableTracker = ($('html').width()) - 50;
        var totalScrollableWidth = totalWidth - ($('html').width());    
        
        var convertNumber = ui.position.left / totalOfScrollableTracker;    
        var transRealPosition = totalScrollableWidth * convertNumber;
        
        $('content').scrollLeft(transRealPosition);
      },
      stop: function(event, ui) {
      }
    });
  }
  
  //dragable slides
  $('.slides_control').each(function(){
    $(this).draggable({
      axis: 'x'
    });
  })
  
  /**
  * ProgressBar for jQuery
  *
  * @version 1 (29. Dec 2012)
  * @author Ivan Lazarevic
  * @requires jQuery
  * @see http://workshop.rs
  *
  * @param  {Number} percent
  * @param  {Number} $element progressBar DOM element
  */
  
  // progress bar
  var numberOfImages = $('img').length,
  numberOfLoaded = 0,
  percent,
  progressBarWidth,
  step = 100 / numberOfImages;

  function cancelProgressBar() {
    if (numberOfImages == numberOfLoaded) {
      $('content').animate( {opacity:'1'},1400 );
      $('.progwrap').hide();
    } 
  }
  
  // progress loading bar
  $('img').each( function () {
    if (!this.complete) {
      $(this).load( function () {
        numberOfLoaded++;
        percent = step * numberOfLoaded;
        progressBarWidth = percent * $('.progwrap #progressBar').height() / 100;
        $('.progwrap #progressBar').find('div').stop().animate({ height:  progressBarWidth}, 200 );
        cancelProgressBar();
      });
    } else {
      numberOfLoaded++;
      cancelProgressBar();
    }
  });
  
  
});

// init hover and slider
$(function() {    
  // travelling pants to anchor's position
  $('.subnav ul a').click(function(){
    $('content').stop().animate({
      scrollLeft: checkpoints[$(this).index()]
    }, 350);
    return false;
  });
  
  // array of checkpoints
  var checkpoints = [];
  $('.checkpoint').each( function() {
    checkpoints.push($(this).offset().left);
  });
  
  var numberWaypoint = 1;
  // give travelingpants dynamic names
  $(".subnav ul a").each( function() {
    $(this).attr("class", "waypoint"+numberWaypoint);
    numberWaypoint++;
  });
  
  var i = 0;
  var numberCheckpoints = $('.checkpoint').length;
  var lastCheckPoint = checkpoints[0];
  
  $('content').scroll(function() {
    position = $('content').scrollLeft();
    //console.log(position);
    for(i=0; i < numberCheckpoints; i++) {
      if( position >= checkpoints[i]) {
        y= i+1;
        $('.subnav ul a').removeClass('nav-default active');
        $('.subnav ul a.waypoint'+y).addClass('active');
      }
    }
    if ( position > 602 )  {
      $('.subnav').css({ 
        position: 'fixed',
        left: '40px'
      }); 
    } else {
      $('.subnav').css({ 
        position: '',
        left: ''
      });   
    }
    // drop google maaaaaaaps on sight  
    if(position>1100) {
      dropGoogleMaps();
    }
  });
  initializeGoogleMaps();
  
  /** init responsiveness **/
  var windowHeight = $(window).height();
  // popup
  $('.popup').click( function() {
    
    $('.tutorial, .contactnow, .search').hide();
    var imgsrc = $(this).attr('href');
    $(".conoverlay").fadeIn(300).addClass('active');
    $('.conoverlay .popupbox')
      .append('<img src="'+ imgsrc +'"/>')
      .show()
      .addClass('active');
    return false;
  });
  
  // init contact pop up
  $(".contactbtn").click(function(){
    $(".conoverlay").fadeIn(300);
    $('.tutorial, .search').hide();
    $('.contactnow').show();
    return false;
  });
  
  // init expanding box effect
  $('.jq-trans').click(function () {
    if( !$(this).is('.expanded') ) {
      cancelExpand();
      $(this).addClass('expanded');
      
      $(this).find('.blurb').hide();
      $(this).find('.description').show();
      
      // animate dynamic height
      var object_target = $(this);
      
      // z-index that bitch 
      object_target.css({'z-index': '1000'});
      //var target_height = object_target.height('100%').height();
      var target_height = object_target.height('366px').height();
      var target_width = object_target.width('605px').width();
      
      object_target.height('168px');
      object_target.width('288px');
  
      // animate width
      object_target.animate({
        height: target_height + 'px',
        width: target_width + 'px',
       //height: 'toggle'  
      }, 300 );
    }
  });
  
  // init cancel expansive if already in expanded view
  $('html').mousedown(function() {
    cancelExpand();
    cancelContact();
    cancelPopup();
  });
  
  $('.tutorial, .popupbox, .contactnow, .expand, .popsearch, .search, .cancelpopup').mousedown(function(event){ 
    event.stopPropagation();
  });
  
  // kill popupfullimg 
  function cancelPopup() {
    $('.conoverlay .popupbox > img').remove();
    $('.conoverlay .popupbox, .tutorial, .conoverlay .search').hide();
    $(".conoverlay").fadeOut(300).removeClass('active');
    $('.sresult').empty();
    cancelExpand();
  }
  $(document).keydown(function(e){
    if(e.keyCode == 27) {
      cancelPopup();
      return false;
    }
  });
  
  // init search function
  $(".popsearch").click(function(){ 
    $(".conoverlay").fadeIn(300).addClass('active');
    $('.conoverlay > div').hide();
    $('.conoverlay .search').show();
    $('.conoverlay .search input.searchinput').focus();
    return false;
  });
  
  function loadSearch() {
    searchQuery = encodeURI($('input.searchinput').val());
    $('.sresult').load('http://matheusdesain.com/?s='+searchQuery);
  }
  $('input.searchinput').keypress( function () {
    clearTimeout(this.id);
    this.id = setTimeout(loadSearch, 500);
  });
  $('.search .navigation a').click(function(){
    var oldNewEntries = $(this).attr('href');
    $('.sresult').load('http://matheusdesain.com/?s='+searchQuery);
    return false;
  });
  
  //init cancel expand if close btn is clicked
  $('.close').click( function(event){
    cancelExpand();
    return false;
  });
  $('.popupclose').click( function(event) {
    cancelPopup();
  });
   
  // function kill contact
  function cancelContact() {
    $(".conoverlay").fadeOut(300);
    return false;
  }
  
  // function kill expanded view
  function cancelExpand() {
    // animate dynamic height
    var toggle_expands = $('.expanded');
    
    //var target_height = object_target.height('100%').height();
    var target_height = toggle_expands.height('168px').height();
    var target_width = toggle_expands.width('288px').width();
    
    toggle_expands.height('366px');
    toggle_expands.width('605px');
    
    // animate width
    toggle_expands.animate({
      height: target_height + 'px',
      width: target_width + 'px',
     //height: 'toggle'  
    }, 300 );
    
    toggle_expands.find('.description').hide();
    toggle_expands.find('.blurb').show();
    
    // z-index that bitch 
    toggle_expands.css({'z-index': '25'});
    setTimeout(function(){
      toggle_expands.css({'z-index': '1'});
    },300);
    
    toggle_expands.removeClass('expanded');
    return false;
  }    
  
});