<?php 
 /* Template Name: old
 */
?>
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>Matheus Desain | Web and Graphic Design</title>
<meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="<?php bloginfo( 'template_directory' ); ?>/old/css/twentythirteen.css" type="text/css" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="<?php bloginfo( 'template_directory' ); ?>/old/js/slides.min.jquery.js"></script>
<script src="<?php bloginfo( 'template_directory' ); ?>/old/js/jquery.parallax-1.1.3.js"></script>
<script src="<?php bloginfo( 'template_directory' ); ?>/old/js/jquery.mousewheel.min.js"></script>
<script src="<?php bloginfo( 'template_directory' ); ?>/old/js/jquery.cookie.js"></script>
<script src="<?php bloginfo( 'template_directory' ); ?>/old/js/jquery.easing.1.3.js"></script>

<script src="<?php bloginfo( 'template_directory' ); ?>/assets/angular/core-js/client/shim.min.js"></script>
<script src="<?php bloginfo( 'template_directory' ); ?>/assets/angular/zone.js/dist/zone.js"></script>
<script src="<?php bloginfo( 'template_directory' ); ?>/assets/angular/reflect-metadata/Reflect.js"></script>
<script src="<?php bloginfo( 'template_directory' ); ?>/assets/angular/systemjs/dist/system.src.js"></script>
<script src="<?php bloginfo( 'template_directory' ); ?>/assets/angular/systemJSConfig/systemjs.config.js"></script>
<script>
    System.import('app').then(null, console.error.bind(console));
</script>

<script type="text/javascript">
  $(document).ready(function () {  
    // horizontal page scroll
    function scrollhorizontal() {
      $('body, html').mousewheel(function(event, delta) {
        if ($('.conoverlay').hasClass('active')) {
          return;
        } else {
          if (delta != 0) {
            this.scrollLeft -= delta;
            this.scrollTop = 0;
            event.preventDefault();
          }
        }
      });
    }
    
    // fixed icos position
    $('.conoverlay').scroll( function() {
      var fixedicos = $('.conoverlay').scrollTop();
      $('.popupbox .icos').stop().animate({ 'top': fixedicos },400);
    });
    scrollhorizontal();

    // parallax
    $('.moneyshot').horparallax('50%', 0.15);

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
    //  alert( $(this).outerWidth(true) );
      totalWidth = totalWidth + $(this).outerWidth(true);
      });
    $('ul.cfix').css( 'width', totalWidth);   
  });
  
  // init hover and slider
  $(function() {
    
    /** init subnav travelingpanties shiiiit neaga **/
    $('.travelingpants').click(function(){
      var target = $(this).attr('href');
      $('html, body').animate({
        scrollLeft: $(target).offset().left
      }, 400);
      return false;
    });
    
    //checkpoints
    var numberCheckpoints = $('.checkpoint').length;
    var numberWaypoint = 1;
    
    // array of checkpoints
    var checkpoints = [];
    $('.checkpoint').each( function() {
      checkpoints.push($(this).offset().left);
    });
    
    // give travelingpants dynamic names
    $(".subnav ul a").each( function() {
      $(this).attr("class", "waypoint"+numberWaypoint);
      numberWaypoint++;
    });
    
    // check for positions and apply friggin classes
    var i; var y = 0;
    
    var position = $(document).scrollLeft();
    function defaultPosChecker() {
      if (position <= checkpoints[0]) {
        y = 0;
        $('.subnav ul a').addClass('nav-default').removeClass('active');
      }  
    }
    $(window).scroll(function() {
      position = $(document).scrollLeft();
      if (position > 995 ) {
        $('.subnav').css({
          'position': 'fixed',
          'left': '35px'
        });
      } else {
        $('.subnav').css({
          'position': 'absolute',
          'left': '1030px'
        });
      }
      
      // looping some position checker
      for (i = 0; i < numberCheckpoints; i++) {
        if (position >= checkpoints[i])  {
          y = i+1;
          $('.subnav ul a').removeClass('nav-default active');
          $('.subnav ul a.waypoint'+y).addClass('active');  
        }
        defaultPosChecker();
      }
      
    });
    defaultPosChecker();
    
    /** init responsiveness **/
    var windowHeight = $(window).height();
      
    // popup
    $('.popup').click( function() {
      $('.contactnow, .search').hide();
      var imgsrc = $(this).attr('href');
      $(".conoverlay").fadeIn(300).addClass('active');
      $('.conoverlay .popupbox')
      .append('<img src="'+ imgsrc +'"/>')
      .show()
      .addClass('active');
      //scrollhorizontal();
      return false;
    });
    
    // init contact pop up
    $(".contactbtn").click(function(){
      $(".conoverlay").fadeIn(300);
      $('.search').hide();
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
        }, 300 );
      }
    });
    
    // init cancel expansive if already in expanded view
    $('html').click(function() {
      cancelExpand();
      cancelContact();
      cancelPopup();
    });
    
    $('.popupbox, .contactnow, .expand, .popsearch, .search, .cancelpopup').click(function(event){
      event.stopPropagation();
    });
    
    // kill popupfullimg 
    function cancelPopup() {
      $('.conoverlay .popupbox > img').remove();
      $('.conoverlay .popupbox, .conoverlay .search').hide();
      $(".conoverlay").fadeOut(300).removeClass('active');
      $('.sresult').empty();
      cancelExpand();
      //alert('?');
      //scrollhorizontal();
    }
    $(document).keypress(function(e) {
      if(e.which == 27) {
      alert('You pressed esc!');
      cancelPopup();
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
      $('.sresult').load('http://matheusdesain.com/blog/?s='+searchQuery);
    }
    $('input.searchinput').keypress( function () {
      clearTimeout(this.id);
      this.id = setTimeout(loadSearch, 500);
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
      var toggle_expands = $('.expanded'),
          target_height = toggle_expands.height('168px').height(),
          target_width = toggle_expands.width('288px').width();
      
      toggle_expands.height('366px');
      toggle_expands.width('605px');
      
      // animate width
      toggle_expands.animate({
        height: target_height + 'px',
        width: target_width + 'px',
      }, 300 );
      
      toggle_expands.find('.description').hide();
      toggle_expands.find('.blurb').show();
      
      toggle_expands.css({'z-index': '25'});
      setTimeout(function(){
        toggle_expands.css({'z-index': '1'})
      },300);
      
      toggle_expands.removeClass('expanded');
      
      return false;
    }
  });
</script>
</head>

<body>
<div class="conoverlay">
  <div class="search" style="display:none;">
    <div>
      <img src="<?php bloginfo( 'template_directory' ); ?>/old/images/close-search.png" class="popupclose searchclose">
      <h1>Start typing:</h1>
      <input type="text" class="searchinput"/>
      <div class="sresult">
        <!-- magic -->
      </div>
    </div>
  </div>
  <div class="popupbox" style="display:none;">
    <div class="icos">
      <img src="../images/ico-close.png" class="popupclose">
      <img src="../images/ico-scroll.png" />
    </div>
  </div>
  <div class="contactnow" style="">
    <h1>Leave me a <span style="text-decoration: line-through;">message</span> massage.</h1>
    <p>Oh yesh. That's nice. I'll get back to you shortly.</p>
    <?php echo do_shortcode('[contact_form toemail="mathiouchio@gmail.com"]'); ?>
  </div>
</div>
<div class="wrapper bottom">
  <nav> 
    <div style="padding: 0 40px;">
      <a href="<?php echo get_site_url(); ?>"><img src="../images/logo.png" /></a>
      <ul>
        <li class="popsearch">Search</li> 
      </ul>
    </div>
   </nav>
</div>
<content>
  <div class="subnav">
    <ul>
      <a href="#home" class="travelingpants"><li class="back">Back to Black</li></a>
      <a href="#intro" class="travelingpants"><li class="intro">Introduction</li></a>
      <a href="#freelance" class="travelingpants"><li class="freelance">Freelance</li></a>
      <a href="#recent" class="travelingpants"><li class="recent">Recent</li></a>
    </ul>
  </div>
  <div class="vignette">
    <div class="top left"></div>
    <div class="top right"></div>
    <div class="bottom left"></div>
    <div class="bottom right"></div>
  </div>
    
    <ul class="big cfix">
      <li class="active moneyshtcontainer checkpoint" id="home">
      <img src="../images/hire.png" alt="Available to Hire!" class="contactbtn badge"/>
</div>
      <img src="../images/moneyshot2.png" class="moneyshot" style="left:0px;" />
      </li>
      <li style="margin-left:90px;" class="checkpoint" id="intro">
      <div class="single about">
          <h1>O hai. Name is Matheus.<br>
          I design stuff.
          </h1>
          <p>follow me on:</p>
          <ul class="socialico">
            <li><a href="http://www.linkedin.com/in/mathiouchio" target="_blank"><img src="../images/linkedin-ico.png" /></a></li>
            <li><a href="https://www.facebook.com/pages/MatheusDesain/177957308894747" target="_blank"><img src="../images/facebook.png" /></a></li>
            <li><a href="https://twitter.com/mathiouchio" target="_blank"><img src="../images/twitter.png" /></a></li>
            <li><a href="http://matheusdesain.com/blog/articles" target="_blank"><img src="../images/wp.png" /></a></li>
          </ul>
        </div>
        <div class="single tweet">
          <h1>I Tweet. Profanities..<br> You’ve been warned.</h1>
          <p><?php echo do_shortcode('[twitter-widget username="mathiouchio" before_widget="" after_widget="" before_title="" after_title="" errmsg="Uh oh! Twitter is doing something stupid!" hiderss="true" hidereplies="true" targetBlank="true" avatar="0" showXavisysLink="1" items="1" title="" ]'); ?></p>
        </div>
      </li>
      <li>
      <div class="double blog noshad white">
        <h1>My Blog Entries</h1>
    <?php
       // Get the last 4 posts in the special_cat category.
       $args = array(
      'posts_per_page' => 4,
      'order'  => 'DESC'
       );
       query_posts($args);
       
       while (have_posts()) : the_post(); ?>
      <p class="blogtitle"><?php the_title(); ?></p>
      <div class="excerpt"><?php the_excerpt(); ?></div>
      <p><a href="http://matheusdesain.com/blog/articles" target="_blank">Read more</a></p>
       <?php endwhile;
       
       // Reset Query
       wp_reset_query();
         ?>
      </div>
      </li> 
      <li>
      <div class="double whatido noshad white">
        <h1>What I really really do. Really.</h1>
        <img src="../images/amahzung_03.png" style="float:left; margin: 8px 18px;"/>
        <p style="margin-top:10px;">20% Print<br>
       70% Front end web<br/>
        10% Continuous learning</p>
    
        <span class="clear"></span>
        <p>Arsenal of fancy icons that I put in my dock</p>
        <img style="margin: -3px 20px 11px 25px;" src="../images/amahzung_06.png" />
        <p>Major brands I have work with</p>
        <img style="margin: -3px 20px 11px 25px;" src="../images/amahzung_09.png" />
        <p>Download my <a href="http://matheusdesain.com/blog/image2/RESUME-2013.pdf" target="_blank">resume</a>!</p>
        
      </div>
      </li>

      <li id="freelance" class="checkpoint">
        <img src="../images/freelance.png" style="margin: 105px 0 0 190px; position:relative; z-index:100;" />
      </li>
      
      <li>
        <div class="single jq-trans top expand" id="redfish">
          <div class="description" style="display:none; background-image:url('../images/redfish-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/redfish-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/redfish-slide3.jpg" />
               </div>
               <div class="slide">
                <img src="../images/redfish-slide1.jpg" />
               </div>
               <div class="slide">
                <img src="../images/redfish-slide2.jpg" />
               </div>
            </div>
           </div>
           <p>Although I'm morally opposed to eating fish, here's the web project that I built for a restaurant on College St.</p>
          </div><!-- slide end -->
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/redfish-thumb-grey.jpg" class="grey" alt="Redfish Restaurant" /> 
           <img src="../images/redfish-thumb.jpg" alt="Redfish Restaurant" />
           <div class="zoomOverlay">
            <h1>Redfish Restaurant</h1>
           </div>
           </a>
          </div><!-- hover end -->
        </div>
        <div class="single jq-trans bottom expand" id="euclid"><!-- bottom -->
          <div class="description" style="display:none; background-image:url('../images/euclid-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/euclid-full3.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/euclid-slide3.jpg" />
               </div>
               <div class="slide">
                <img src="../images/euclid-slide1.jpg" />
               </div>
            </div>
           </div>
           <p style="text-shadow: 0px 0px 18px white, 0px 0px 18px white;">As Paul Rand always say, "you don't have to be polite with your design." Sometime, it's not about the final design, but it's how it gets there. You know what Paul Rand is always right. I won't give a single design revision in the future at all.</p>
          </div><!-- slide end -->
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
             <img src="../images/euclid-thumb-grey.jpg" class="grey" alt="Euclid431" />
             <img src="../images/euclid-thumb.jpg" alt="Euclid431" />
             <div class="zoomOverlay">
              <h1>Euclid431 (Citizen Gangster) Website</h1>
             </div>
           </a>
          </div><!-- hover end -->
        </div><!-- bottom end-->
      </li>
      <li>
        <div class="single jq-trans top expand" id="pricemetrix">
          <div class="description" style="display:none; background-image:url('../images/pricemetrix-book-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="http://matheusdesain.com/blog/wp-content/uploads/2013/03/clientsummit-handbook.pdf" target="_blank"><img src="../images/ico_pdf.png" /></a>
            <a href="../images/pricemetrix-bookmark-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/pricemetrix-book-slide1.jpg" />
               </div>
               <div class="slide">
                <img src="../images/pricemetrix-book-slide2.jpg" />
               </div>
               <div class="slide">
                <img src="../images/pricemetrix-book-slide3.jpg" />
               </div>
            </div>
           </div>
           <p>In 2011, Amrita Mathur approached Matheus to work for Pricemetrix's first-time-ever Annual Client Summit. The challenge was to come up with a design concept that follows a-decade-old corporate's brand guideline, while still maintaining a striking visual appeal.</p>
          </div><!-- slide end -->
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/pricemetrix-thumb-grey.png" class="grey" alt="Pricemetrix" />
           <img src="../images/pricemetrix-thumb.jpg" alt="Pricemetrix" />
           <div class="zoomOverlay">
            <h1>Pricemetrix<br> 2011 Client Summit Handbook</h1>
           </div>
           </a>
          </div><!-- hover end -->
        </div>
        <div class="single jq-trans bottom expand" id="pricemetrix2"><!-- bottom -->
          <div class="description" style="display:none; background-image:url('../images/pricemetrix-book-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/pricemetrix-WEB-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/pricemetrix-WEB-slide1.jpg" />
               </div>
               <div class="slide">
                <img src="../images/pricemetrix-WEB-slide2.jpg" />
               </div>
               <div class="slide">
                <img src="../images/pricemetrix-WEB-slide3.jpg" />
               </div>
            </div>
           </div>
           <p>In 2011, Amrita Mathur approached Matheus to work for her Pricemetrix's first-time-ever Annual Client Summit. The challenge was to get a site up in a short period of time where clients can see the information about the summit and RSVP to the event.</p>
          </div><!-- slide end -->
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/pricemetrix-WEB-thumb-grey.jpg" class="grey" alt="Pricemetrix" />
           <img src="../images/pricemetrix-WEB-thumb.jpg" alt="Pricemetrix" />
           <div class="zoomOverlay">
            <h1>Pricemetrix<br> 2011 Client Summit Web RSVP</h1>
           </div>
           </a>
          </div><!-- hover end -->
        </div><!-- bottom end-->
      </li>
      
      <li id="recent" class="checkpoint">
        <img src="../images/fb.png" style="margin: 105px 0 0 180px; position: relative; z-index: 100;" />
      </li>
      
      <li>
        <div class="single jq-trans top expand" id="ford">
          <div class="description dark" style="display:none; background-image:url('../images/ford-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/ford-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/ford-slide1.jpg" />
               </div>
               <div class="slide">
                <img src="../images/ford-slide2.jpg" />
               </div>
               <div class="slide">
                <img src="../images/ford-slide3.jpg" />
               </div>
            </div>
           </div>
           <p>Ford wanted young designers' expertises to design and submit a Ford-Fusion-themed Facebook cover photo. The challenge was to really learn the Ford's one-hundred-page of brand identity manual and come up with a concept mockup in 8 hours. Tick tock.</p>
          </div><!-- slide end -->
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/ford-thumb-grey.jpg" class="grey" alt="Ford" />
           <img src="../images/ford-thumb.jpg" alt="Ford" />
           <div class="zoomOverlay">
            <h1>Ford Fusion Design Challenge<br> Facebook Contest</h1>
           </div>
            </a>
          </div><!-- hover end -->
        </div>
        <div class="single jq-trans bottom expand" id="kinder"><!-- bottom -->
          <div class="description dark noshad" style="display:none; background:url(../images/kinder-bg.jpg);"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/madagascar-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/madagascar-slide1.jpg" />
               </div>
               <div class="slide">
                 <img src="../images/madagascar-slide2.jpg" />
               </div>
               <div class="slide">
                 <img src="../images/madagascar-slide3.jpg" />
               </div>
            </div>
           </div>
           <p>Dreamworks was teaming up with KINDER to promote the Madagascar 3 movie release. The design challenge for this project was to merge brandings of two different products and create a graphic imagery that doesn't infringe any of the rules from both sides.</p>
          </div><!-- slide end -->
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/kinder-madagascar-thumb-grey.jpg" class="grey" alt="thumbnail" />
           <img src="../images/kinder-madagascar-thumb.jpg" alt="thumbnail" />
           <div class="zoomOverlay">
            <h1>Kinder - Madagascar 3<br> Facebook Contest</h1>
           </div>
            </a>
          </div><!-- hover end -->
        </div><!-- bottom end-->
      </li>
      <li>
        <div class="single jq-trans top expand" id="momcentral"><!-- bottom -->
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/momcentral-thumb-grey.jpg" class="grey" alt="Mom Central" />
           <img src="../images/momcentral-thumb.jpg" alt="Mom Central" />
           <div class="zoomOverlay">
            <h1>Mom Central Canada<br> Monthly Reports and Surveys</h1>
           </div>
            </a>
          </div><!-- hover end -->
          <div class="description" style="display:none; background-image: url('../images/momcentral-report-bg.jpg');"><!-- slide -->
          <div class="icos" style="height:55px;">
            <img src="../images/ico-close.png" class="close">
            <a href="http://momcentralconsulting.ca/mccwp/wp-content/uploads/2013/05/canadiandigitalmoms2012-FINAL.pdf" target="_blank"><img src="../images/ico_pdf.png"></a>
      </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/momcentral-report-slide1.jpg" />
               </div>
               <div class="slide">
                <img src="../images/momcentral-report-slide3.jpg" />
               </div>
               <div class="slide">
                <img src="../images/momcentral-report-slide4.jpg" />
               </div>
               <div class="slide">
                <img src="../images/momcentral-report-slide5.jpg" />
               </div>
               <div class="slide">
                <img src="../images/momcentral-report-slide6.jpg" />
               </div>
            </div>
           </div>
           <p>Mom Central Canada helps connect brands to moms and vice versa. Every once in a while the Moms publishes reports about how consumers behave towards brand products and technologies. These are the reports.</p>
          </div><!-- slide end -->
        </div><!-- bottom end-->
        <div class="single jq-trans bottom expand" id="oxy"><!-- bottom -->
          <div class="description" style="display:none; background:url('../images/oxy-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/oxy-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/oxy-slide1.jpg" />
               </div>
               <div class="slide">
                <img src="../images/oxy-slide2.jpg" />
               </div>
               <div class="slide">
                <img src="../images/oxy-slide3.jpg" />
               </div>
            </div>
           </div>
           <p>Oxy tried to start a Facebook account. It, although was a good product, had a zero Facebook social media existence. The design challenge for this project was to create a Facebook campaign for a fully loved and established product, but also has no branding guidelines.</p>
          </div><!-- slide end -->
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/oxy-thumb-grey.jpg" class="grey" alt="Oxy" />
           <img src="../images/oxy-thumb.jpg" alt="oxy" />
           <div class="zoomOverlay">
            <h1>OXY Clear It Up<br/> Facebook Sweepstakes</h1>
           </div>
            </a>
          </div><!-- hover end -->
        </div><!-- bottom end-->
      </li>
      
      <li>
        <div class="single jq-trans top expand" id="hilroy">
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/hilroy-unity-thumb-grey.jpg" class="grey" alt="Hilroy" />
           <img src="../images/hilroy-unity-thumb.jpg" alt="Hilroy" />
           <div class="zoomOverlay">
            <h1>Hilroy Unity</h1>
           </div>
            </a>
          </div><!-- hover end -->
          <div class="description dark" style="display:none; background-image:url('../images/hilroy-unity-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/hilroy-unity-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/hilroy-unity-slide1.jpg" />
               </div>
               <div class="slide">
                <img src="../images/hilroy-unity-slide2.jpg" />
               </div>
               <div class="slide">
                <img src="../images/hilroy-unity-slide3.jpg" />
               </div>
            </div>
           </div>
           <p>Hilroy Unity wanted to donate $1 for every Facebook share of the campaign on facebook. The challenge of this project was to build an automated, self-updated Facebook-like meter that was built with a jQuery script.</p>
          </div><!-- slide end -->
        </div>
        <div class="single jq-trans bottom expand" id="hilroy2"><!-- bottom -->
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/hilroy-spreadtw-thumb-grey.jpg" class="grey" alt="Hilroy" />
           <img src="../images/hilroy-spreadtw-thumb.jpg" alt="Hilroy" />
           <div class="zoomOverlay">
            <h1>Hilroy<br> Spread the Word</h1>
           </div>
            </a>
          </div><!-- hover end -->
          <div class="description" style="display:none; background-image:url('../images/hilroy-spreadtw-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/hilroy-spreadtw-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
           <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/hilroy-spreadtw-slide1.jpg" />
               </div>
               <div class="slide">
                <img src="../images/hilroy-spreadtw-slide2.jpg" />
               </div>
               <div class="slide">
                <img src="../images/hilroy-spreadtw-slide3.jpg" />
               </div>
               <div class="slide">
                <img src="../images/hilroy-spreadtw-slide4.jpg" />
               </div>
            </div>
           </div>
           <p>Hilroy Spread the Word wanted parents to nominate students who made a tremendous effort in saving the environment. The challenge to this project was to really pay attention to the layering and z-indexing of html elements.</p>
          </div><!-- slide end -->
        </div><!-- bottom end-->
      </li>
      
      <li>
        <div class="single jq-trans top expand" id="natrel">
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/natrel-baboo-thumb-grey.jpg" class="grey" alt="Natrel" />
           <img src="../images/natrel-baboo-thumb.jpg" alt="Natrel" />
           <div class="zoomOverlay">
            <h1>Natrel Baboo<br> $5000 Giveaway towards RESP</h1>
           </div>
            </a>
          </div><!-- hover end -->
          <div class="description dark noshad" style="display:none; background-image:url('../images/natrel-baboo-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/natrel-baboo-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
          <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/natrel-baboo-slide1.png" />
               </div>
               <div class="slide">
                <img src="../images/natrel-baboo-slide2.png" />
               </div>
               <div class="slide">
                <img src="../images/natrel-baboo-slide3.jpg" />
               </div>
            </div>
          </div>
          <p>Natrel gaveaway their products to Canadian product testers via Mom Central Canada and wanted some feedbacks in return. The objective of the design was to find the right model of a child that fits the right target demographic. Not too old. Never too young. From an iStock photography website.</p>
          </div><!-- slide end -->
          
        </div>
        <div class="single jq-trans bottom expand" id="maam">
          <div class="block blurb"><!-- hover -->
           <a class="zoom hover-eff">
           <img src="../images/maam-thumb-grey.jpg" class="grey" alt="MAAM" />
           <img src="../images/maam-thumb.jpg" alt="MAAM" />
           <div class="zoomOverlay">
            <h1>Musée d’Art et<br> d’Affaires Métropolitain</h1>
           </div>
           </a>
          </div><!-- hover end -->
          <div class="description" style="display:none; background-image:url('../images/maam-bg.jpg');"><!-- slide -->
          <div class="icos">
            <img src="../images/ico-close.png" class="close">
            <a href="../images/maam-full.jpg" class="popup"><img src="../images/ico-fullscreen.png"></a>
          </div>
          <div class="jq-slider">
            <div class="slides_container">
               <div class="slide">
                <img src="../images/maam-slide3.png" />
               </div>
               <div class="slide">
                <img src="../images/maam-slide2.png" />
               </div>
               <div class="slide">
                <img src="../images/maam-slide1.png" />
               </div>
            </div>
          </div>
          <p>Dans le monde des affaires, il y a tellement de richesses, qu'il suffit de puiser dans la richesse des concepts pour trouver une idée directrice pour la réalisation d'une exposition en mouvement « Business'Art ».</p> <p>Exactly. I had no idea what I was doing.</p>
          </div><!-- slide end -->
          
        </div>
        
      </li>
      <li>
      <a href="http://matheusdesain.com/blog/twentyten.html"><img src="../images/badge-3.png" style="margin: 100px 0px 0 155px; position:relative; z-index:100;" /></a>
      </li>
      <li style="margin-right:110px;">
      <div class="double contact noshad white">
        <h1>This page is just<br> half of the entire story</h1>
        <p>Please check my <a href="http://matheusdesain.com/blog/twentyten.html" target="_blank">past works</a>.</p>
        <p>This site is made possible because<br> of family and friends:<br>
        Kamal, Amos, Amrita, Mom-Dad, jQuery plugins authors, really awesome Wordpress community, past clients(good and bad).
        </p>
        <p>Do not hesitate to <a href="#" class="contactbtn">contact</a> me for an interview.</p>
      </div>
      </li>

    </ul>
    
  </content>
</body>
</html>