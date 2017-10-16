/*! wot */
if(window.location.hostname != 'localhost')
  wplocal.basePathURL = window.location.origin;

// interaction
var nav = {
  init: function(){
    this.anchor.init();
    this.travelOnRdy();
  },
  static: function(){
    $body.attr('static','');
  },
  fluid: function(){
    $body.attr('static', null);
  },
  travelOnRdy: function(){
    var cleanBaseURL = window.location.href.replace(wplocal.basePathURL,''),
        paths        = cleanBaseURL.slice(1).split('/'),
        thePants;

    if(paths[0] && paths[0] !== '') {
      switch (paths[0]) {
        case "portfolio":
          thePants = "projects";
          break;
        case "connect":
          thePants = "contact";
          break;
        default:
          thePants = paths[0];
      }
      nav.anchor.travelingpants('#'+thePants);
    }
  },
  anchor: {
    init: function(){
      $a = document.getElementsByTagName('a');
      this.loop($a);
    },
    loop: function(arr){
      for (var n = 0; n < arr.length; ++n) {
        if (arr[n].hash !== "")
          nav.anchor.bind(arr[n]);
      }
    },
    travelingpants: function(target){
      target = document.getElementById(target.substring(1));
      $('body, html').animate({scrollTop: target.offsetTop}, 400);
    },
    bind: function(el){
      el.onclick = function(){
        nav.anchor.travelingpants(this.hash);
        if (popup)
          popup.close();
        return false;
      }; 
    }
  },
  intervalwcount: {
    interval: [],
    loop: function(time, loopit){
      this.interval = setInterval(loopit, time);
    },
    clear: function(){
      clearInterval(nav.intervalwcount.interval);
    }
  },
  slidetoSection: function(target){
    target = target || 0;
    // where to scroll
    sectionYOffset = $sections.eq(target).offset().top;
    // class name toggle  
    $sections.removeClass('current-slide');
    $sections.eq(target).addClass('current-slide');
  },
  lazyload: function(){
    // pull wordpress post
  },
};

var ohSnap = {
  loop: {
    interval: [],
    counter: 0,
    run: function(identifier){
      this.interval = window.setInterval( function(){
        // back to 0 on last loop
        ohSnap.loop.counter = (ohSnap.loop.counter >= Object.keys(ohSnap.vectorPoints[id]).length) ? 0 : ohSnap.loop.counter;
        // animate
        ohSnap.go('#spinner', ohSnap.loop.counter);
        // counter++
        ohSnap.loop.counter++;
        // speed
      }, ohSnap.settings.speed[id]);
    },
    destroy: function(){
      clearInterval(this.interval);
    }
  },
  go: function(identifier, target){
    if (typeof identifier ===  'string') {
      id = identifier.substring(1);
    } else {
      id = identifier.className || identifier.id;
    }

    // count objects length
    // check if has multiple polygons
    var points = jQuery(identifier).find('polygon'),
        speed  = this.settings.speed[id],
        easing = this.settings.easing[id],
        point, vp, $el;

    if(points.length > 1) {
      // preparing loops
      for(i=0; i<points.length; i++){
        point  = jQuery(identifier).find('polygon').get(i);
        vp     = this.vectorPoints[id][target][i];

        $el    = Snap(point);
        $el.stop().animate({'points': vp}, speed, easing);
      }
    } else {
      point    = jQuery(identifier).find('polygon').get(0);
      vp       = this.vectorPoints[id][target];
      
      $el      = Snap(point);
      $el.stop().animate({'points': vp}, speed, easing);
    }
  },
  settings: {
    speed : {
      branding : 800,
      logo     : 10000,
      spinner   : 800,
      thumb    : 200
    },
    easing : {
      branding: mina.easout,
      logo: mina.easout,
      spinner: mina.easein,
      thumb: mina.easeout
    }
  },
  vectorPoints : {
    branding: {
      // splash
      0: ['0,0 189.3,0 39.4,69.4 0,152.5 60.6,360.5 119.3,649.8 133.2,725.4 71.8,899.8 0,899.8', '167.4,629.6 128.9,459.2 52.9,130 180.9,59.2 348.8,0 189.3,0 39.4,69.4 0,152.5 60.6,360.5 119.3,649.8 133.2,725.4 71.8,899.8 97.6,899.8 149.9,815.2', '516.1,0 189.3,122.7 100.9,165.4 140.9,389.8 167.4,629.6 149.9,815.2 97.6,899.8 97.6,899.8 149.9,815.2 167.4,629.6 128.9,459.2 52.9,130 180.9,59.2 348.8,0'],
      // about
      4: ['0,0 124.3,0 86.2,114.9 21.3,203.7 36.5,480.1 65.6,538.7 89.7,660.2 11.7,899.8 0,899.8', '106,555.2 100.7,547.3 50.8,228.2 118.8,134 140.9,0 113,0 75,114.9 10.1,203.7 25.2,480.1 54.3,538.7 78.5,660.2 0.5,899.8 25.3,899.8 133.6,644', '140.9,0 125.2,95.2 122.7,160 84.6,255.8 148.9,518.7 185.1,570.6 40,899.8 25.3,899.8 133.6,644 106,555.2 100.7,547.3 50.9,228.2 118.8,134 140.9,0'],
      // projects
      2: ['0,0 63.4,0 36.6,87.3 0,131.8 52.9,394.9 134.3,639.1 156.1,789.1 176,899.8 0,899.8', '163.4,513.4 90.1,382.6 52.9,130 71.1,71.8 89.7,0 63.4,0 36.6,87.3 0,131.8 52.9,394.9 134.3,639.1 156.1,789.1 176,899.8 201.8,899.8 183.4,744.2',  '112.8,0 104.9,53.4 88,153.4 140.9,389.8 215.7,482.6 215.7,625.7 201.8,899.8 201.8,899.8 183.4,744.2 163.4,513.4 90.1,382.6 52.9,130 71.1,71.8 89.7,0'],
      // blog
      3: ['0,0 0,0 62.1,217.6 62.1,307.6 12.3,545.7 58,678.2 66.4,817 212.7,899.8 0,899.8', '110.7,755.6 73.3,559.3 103.2,324.3 92.5,153 12.3,0 0,0 62.1,217.6 62.1,307.6 12.3,545.7 58,678.2 66.4,817 212.7,899.8 242.5,899.8 112.6,780.2', '12.3,0 127.4,188.1 160.7,319 126.8,540.6 130,765.6 170.1,829.6 242.5,899.8 242.5,900 112.6,780.2 110.7,755.6 73.3,559.3 103.2,324.3 92.5,153 12.3,0'],
      // contact
      1: ['0,0 54.9,0 16.5,226.2 53.2,293.8 123.5,464.1 153.5,549 142.7,674.6 60.8,899.8 0,899.8', '186.7,496.4 176,469 103,269.3 44.5,196 65.4,0 54.9,0 16.5,226.2 53.2,293.8 123.5,464.1 153.5,549 142.7,674.6 60.8,899.8 67.6,899.8 164.4,701', '79.6,0 75.8,148.7 201.7,373.9 240,478.6 185.9,702.5 124.7,798.4 67.6,899.8 67.6,899.8 164.4,701 186.7,496.4 176,469 103,269.3 44.5,196 65.4,0'],
      5: ['0,0 202,0 116.1,111.8 26.1,129.1 32.9,480.4 75.6,566.1 18.6,723.6 254.2,899.8 0,899.8', '85,617 93.1,547.6 58.6,133.6 136,134 219.3,0 202,0 116.1,111.8 26.1,129.1 32.9,480.4 75.6,566.1 18.6,723.6 254.2,899.8 270.6,899.8 72.8,705.8', '219.3,0 151.3,166.1 104.5,170.3 104.5,548.1 126,711.6 194.1,805.4 309.6,899.8 270.6,899.8 72.8,705.8 85,617 93.1,547.6 58.7,133.6 136,134 219.3,0']
    },
    logo: {
      0: ['115.75,122.5 167.5,132 180,127.7 79.3,69 27.8,70.3 27.8,51.7 0,69.9 12.9,100.6 101.5,96', '170.7,32 81.5,0 73.2,24.4 27.8,51.7 27.8,70.3 79.3,69 180,127.7', '167.5,132 115.75,122.5 101.5,96 12.9,100.6 54.5,200'],
      1: ['117,122 167.5,132 180,127.7 103.9,76.5 46.4,81.7 27.8,51.7 0,69.9 12.9,100.6 64.5,125.2', '170.7,32 81.5,0 73.2,24.4 27.8,51.7 46.4,81.7 103.9,76.5 180,127.7', '167.5,132 117,122 64.5,125.2 12.9,100.6 54.5,200'],
      2: ['122.26,71.85 167.5,132 180,127.7 163,77 82.85,48.25 27.8,51.7 0,69.9 12.9,100.6 67,74', '170.7,32 81.5,0 73.2,24.4 27.8,51.7 82.85,48.25 163,77 180,127.7', '167.5,132 122.26,71.85 67,74 12.9,100.6 54.5,200']
    },
    spinner: {
      0: '7.4,44 40.8,48.2 42.3,21.9 34.6,2.8 23.2,36.5',
      1: '17.9,43.8 24.8,30.2 42.3,21.9 34.6,2.8 7.2,18.5',
      2: '26.3,45.3 45,13.5 29.2,15.1 23,1.2 9.4,19.9'
    },
    thumb: {
      0: '57,199 1,72 113,1 163,30 161,113',
      1: '105.8,188.8 32.3,147.5 51.4,13 90,3.9 171.1,92.8 105.8,188.8'
    }
  }
};

jQuery(function(){
  nav.init();
});