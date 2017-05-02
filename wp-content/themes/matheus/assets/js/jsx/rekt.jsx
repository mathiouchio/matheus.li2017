/*! react you wot */
if(window.location.hostname != 'localhost') {
  wplocal.basePathURL = window.location.origin;
}

// global vars
var $body    = jQuery('body'),
    $section = $body.find('section'),
    $nav     = $body.find('nav'),
    $blog    = $body.find('#blog'),
    $project = $body.find('#projects'),
    $thumbs  = $body.find('.thumb'),
    $popup;  // = $body.find('#popup'); // hasn't been built by popup Class

var scrollspy = {
  sectionOffsets : [],
  index: 0,
  init: function() {
    var $section = jQuery(document).find('section');
    $section.each( function(i){
      scrollspy.sectionOffsets[i] = this.offsetTop;
    });
    this.bind(); 
  },
  bind: function(){
    window.addEventListener('scroll', function() {
      var yPos            = this.pageYOffset,
          yOffsets        = scrollspy.sectionOffsets,
          index = 0;
      // console.log(yPos);
      
      for (var i in yOffsets) {
        if (yPos >= yOffsets[i]){
          index = i;
        }
      }
      
      /* Only apply rules and styles in between sections:
       * value of positions changed
       */
      if(index != scrollspy.index) {
        scrollspy.index = index;
        scrollspy.nav(scrollspy.index);
        scrollspy.brand(scrollspy.index);
      }
    });
  },
  nav: function(i){
    i--;
    $nav.find('li').removeClass('active')
    if (i >= 0) // only do it if needed
      $nav.find('li').eq(i).addClass('active');
  },
  brand: function(i){
    ohSnap.go('#branding', i);
  }
};

var REST = {
  json: {},
  get: function(restURL){
    return jQuery.ajax({
      url: restURL,
      context: document.body,
      dataType: 'json'
    });
  },
  store: function(data, type) {
    REST.json[type] = [];
    if(data.constructor === Array) {
      data.map( function(currentValue, index){
        // push data to parent object
        REST.json[type].push(currentValue);
      });
    } else {
      REST.json[type] = data;
    }
  }
};

var rekt = {
  render: function(id, url){
    var Component = this.component[id](url);
    ReactDOM.render(<Component />, document.getElementById(id));
  },
  component: {
    danger: function(raw){
      return {__html: raw};
    },
    projects: function(url){
      return React.createClass({
        getInitialState: function(){ return null },
        componentWillMount: function(){
          // console.log('will mount');
          var that = this;
          REST.get(url)
              .success( function(data){
                // console.log(data);
                that.setState({ posts: data });
              });
        },
        componentDidUpdate: function(){
          // adding gallery
          if(this.state.posts.length) {
            this.state.posts.map(this.gallery);
            scrollspy.init();
          }
          nav.travelOnRdy();
        },
        gallery: function(v, i){
          var that = this;
          if (!v.gallery){
            // console.log(v);
            // console.log(i);
            var gallery_path = wplocal.basePathURL+'/wp-json/wp/v2/media?parent='+v.id; 
            
            // console.log(gallery_path);
            REST.get(gallery_path).success( function(data){
              // console.log(data);
              that.state.posts[i].gallery = data;
            });
          }
        },
        handleClick: function(i,e){
          /* Preventing preventDefault on new tab click */
          if (e.ctrlKey || e.shiftKey || e.metaKey || (e.button && e.button == 1)){
            
          } else {
            // console.log(this.state.posts[i]); 
            var galleryJSON = this.state.posts[i].gallery;
            // console.log(this);
            popup.run(this, i);
            // popup.populate(this.state.posts[i].gallery, this.state.posts[i].format);

            e.preventDefault();
            e.stopPropagation();
          }
        },
        render: function(){
          var that = this;
          var slide = function(v,i){
            var boundClick = that.handleClick.bind(that, i);
            return (
              <div className="slide" key={'project-'+i}>
                <div className="wrapper">
                  <h1>{v.title.rendered}</h1>
                  <div className="copy" dangerouslySetInnerHTML={rekt.component.danger(v.content.rendered)} />
                  <div className="expand">
                    <a href={v.link} onClick={boundClick}>
                    <svg x="0px" y="0px" viewBox="0 0 40 40">
                      <line stroke="#484848" strokeWidth="1.8" strokeLinecap="round" x1="25.3" y1="20" x2="14.7" y2="20"></line>
                      <line stroke="#484848" strokeWidth="1.8" strokeLinecap="round" x1="20" y1="14.7" x2="20" y2="25.3"></line>
                      <circle fill="none" stroke="#484848" strokeWidth="1.8" strokeLinecap="round" cx="20" cy="20" r="12"></circle>
                    </svg>
                    <span className="hero smler">Learn more</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          };

          if (this.state) {
            return (
              <div className="slider noslide">
                <div className="slides">
                  {this.state.posts.map(slide)}
                </div>
              </div>
            );
          } else {
            return null;
          }
        }
      });
    },
    blog: function(url){
      return React.createClass({
        getInitialState: function(){ return null },
        componentWillMount: function(){
          var that = this;
          REST.get(url)
              .success( function(data){
                that.setState({ posts: data, currentslide: 0 });
              });
        },
        remoteActivate: function(){
          this.setState({ remote: '' });
        },
        remoteDeactivate: function(){
          this.setState({ remote: null });
        },
        handleClick: function(i,e){
          /* Preventing preventDefault on new tab click */
          if (e.ctrlKey || e.shiftKey || e.metaKey || (e.button && e.button == 1)){
            
          } else {
            popup.run(this, i);
            e.preventDefault();
            e.stopPropagation();
          }
        },
        handleHover: {
          enter: function(e){
            ohSnap.go(e.currentTarget, 1);
          },
          leave: function(e){
            ohSnap.go(e.currentTarget, 0);
          }
        },
        componentDidMount: function(){
          // console.log('did mount');
          nav.travelOnRdy();
          // this.handleResponsive();
        },
        nextSlide: function(){
          // console.log('this.state.totalslide'+this.state.totalslide);
          // console.log('this.state.currentslide'+this.state.currentslide);
          var num = this.state.currentslide;
          num++;
          if(this.state.totalslide > num) {
            this.state.currentslide++;
          }
        },
        prevSlide: function(){
          if(this.state.currentslide > 0) {
            this.state.currentslide--;
          }
        },
        metas: {
          counter: 0
        },
        render: function(){
          var output      = [],
              posts       = [],
              uid_svg     = 0,
              uid_svg_off = 1,
              that        = this;

          this.metas.counter = 0;

          var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          
          var slide = function(v,i){
            // console.log(v);
            // console.log(i);
            var one_base = i;
                one_base++;
            // console.log(one_base);
            var date   = new Date(v.date),
                month  = date.getMonth(),
                year   = date.getFullYear();
                year  -= 2000;


            var thumbnail = '';
            if(v.better_featured_image) {
              if (v.better_featured_image.media_details.sizes.thumbnail){
                thumbnail = v.better_featured_image.media_details.sizes.thumbnail.source_url;
              }
            }

            var boundClick = that.handleClick.bind(that, i);
            var post = (
              <div className="post" key={"blog"+i}>
                <a href={v.link} onClick={boundClick}>
                  <div className="thumb" onMouseEnter={that.handleHover.enter} onMouseLeave={that.handleHover.leave}><svg x="0px" y="0px" viewBox="0 0 180 200">
                    <g fillRule="evenodd" clipRule="evenodd">
                      <defs>
                        <polygon id={'SVGID_14'+uid_svg+'_'} points="57,199,1,72,113,1,163,30,161,113"></polygon>
                      </defs> 
                      <clipPath id={'SVGID_14'+uid_svg_off+'_'}>
                        <use xlinkHref={'#SVGID_14'+uid_svg+'_'} overflow="visible"></use>
                      }
                      </clipPath>
                      <g clipPath={'url(#SVGID_14'+uid_svg_off+'_)'}>
                        <image overflow="visible" width="300" height="300" xlinkHref={thumbnail} transform="matrix(0.6666666666666666,0,0,0.6666666666666666,-10,0)"></image>
                      </g>
                    </g>
                    </svg>
                  </div>
                  <div className="excerpt"><h2>{monthNames[month]} {year}<span>{v.title.rendered}</span></h2></div>
                </a>
              </div>
            );
            posts.push(post);
            uid_svg     += 2;
            uid_svg_off += 2;

            if(one_base%3==0) {
              // console.log('divisible');
              output.push(
                  <div className="slide" data-show={that.metas.counter==that.state.currentslide ? "": null } key={"divider"+that.metas.counter}>
                    <div className="wrapper">{posts}</div>
                  </div>
                );
              posts = [];
              that.metas.counter++;
            }
            that.state.totalslide = that.metas.counter; 
            // console.log("that.state.totalslide: "+that.state.totalslide);
          };

          if (this.state) {
            // console.log(this.state);
            // console.log('render stuff');
            this.state.posts.map(slide);
            var print = (
              <div className="slider">
                <div className="slides" ref="blogDOM">
                  {output}
                </div>

                <div className="wrapper controller" data-control={this.state.remote}>
                  <div className="expand" onClick={this.remoteActivate} onMouseLeave={this.remoteDeactivate}>
                    <a>
                    <svg x="0px" y="0px" viewBox="0 0 40 40">
                      <line stroke="#484848" strokeWidth="1.8" strokeLinecap="round" x1="25.3" y1="20" x2="14.7" y2="20"/>
                      <line stroke="#484848" strokeWidth="1.8" strokeLinecap="round" x1="20" y1="14.7" x2="20" y2="25.3"/>
                      <circle fill="none" stroke="#484848" strokeWidth="1.8" strokeLinecap="round" cx="20" cy="20" r="12"/>
                    </svg>
                    <span className="hero smler">Navigate</span>
                    </a>
                    <div className="extend">
                      <a onClick={this.prevSlide}>
                        <svg className="navigate prev" version="1.1" x="0px" y="0px" viewBox="0 0 40 40" xmlSpace="preserve">
                          <polyline className="round" points="21.6,25.3 16.4,20 21.6,14.7"/>
                          <circle className="round" cx="20" cy="20" r="12"/>
                        </svg>
                        <span className="hero smler">Prev</span>
                      </a>
                      <a onClick={this.nextSlide}>
                        <svg version="1.1" className="navigate next" x="0px" y="0px" viewBox="0 0 40 40" xmlSpace="preserve">
                          <polyline className="round" points="18.4,14.7 23.6,20 18.4,25.3"/>
                          <circle className="round" cx="20" cy="20" r="12"/>
                        </svg>
                        <span className="hero smler">Next</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
            // console.log(output);
            return print;
          } else {
            // console.log('render null');
            return null;
          }
        }
      });
    }
  }
};

// var responsive = {
//   init: function(){
//     console.log('initted');
//     window.onresize = function(event) {
//       console.log('hey');
//       popup.plyr.mathematics();
//     };
//   },
//   uninit: function(){
//     window.onresize = null;
//   }
// };

var popup = {
  plyr: {
    obj: null,
    rektObj: null,
    init: function(rektObj){
      this.obj     = plyr.setup();
      this.rektObj = rektObj;
      this.responsive();
    },
    destroy: function(){
      this.obj.map( function(target){ target.destroy() });
    },
    mathematics: function(target){
      console.log('calculating');
      var vHeight = (target.height) ? target.height : target.videoHeight,
          vWidth  = (target.width) ? target.width : target.videoWidth,
          vRatio  = vWidth/vHeight,

          realHeight = window.innerHeight;
          realWidth  = realHeight * vRatio;

      $(target).css('width', realWidth);
    },
    responsive: function(){
      var slidePos = this.rektObj.state.currentslide,
          currentTarget = this.obj[slidePos];

      currentTarget.on('ready', function(event) {
        var plyrObj  = (currentTarget.getEmbed()) ? currentTarget.getEmbed().a : currentTarget.getMedia();
        if(plyrObj.tagName == 'VIDEO') {
          // waiting for all the metadatas load to determine height x width
          plyrObj.addEventListener('loadedmetadata', function(e){
            popup.plyr.mathematics(plyrObj);
          });
        } else {
            popup.plyr.mathematics(plyrObj);
        }
        
      });
    }
  },
  popupdom: document.createElement('div'),
  init: function(json_data){
    this.popupdom.id = "popup"; 
    
    document.body.appendChild(this.popupdom);
    $popup = document.getElementById('popup');
  },
  gallery: function(json_data, that){
    // console.log(json_data);
    // console.log(that);

    return React.createClass({
      getInitialState: function(){ return null },
      componentDidMount: function(){
        if(that.state.datatype == 'video') {
          popup.plyr.init(that);
        } 
      },
      componentWillUnmount: function() {
        popup.plyr.destroy();
      },
      slide: function(v,i){
        // console.log(v);
        // console.log(i);

        var slidenum = that.state.currentslide;

        if (v.media_details) { 
          var portrait = v.media_details.height > v.media_details.width; 

          return <li data-show={i==slidenum ? '' : null} data-transitioning={i==that.state.previouslide ? "" : null} className={portrait ? 'portrait' : null} key={'popup'+i}>
              <img src={v.source_url} width={v.media_details.width} height={v.media_details.height} />;
            </li>;
        } else if(v.youtube_id || v.vimeo_id){
          var youmeo = (v.youtube_id) ? 'youtube' : 'vimeo',
              vid    = (youmeo) ? v.youtube_id : v.vimeo_id;

          return <li data-show={i==slidenum ? '' : null} data-transitioning={i==that.state.previouslide ? "" : null} key={'popup'+i}>
              <div data-type={youmeo} data-video-id={vid} onResize={this.handleResize}></div>
            </li>;
        } else if(v.video_url){ 
          return <li data-show={i==slidenum ? '' : null} data-transitioning={i==that.state.previouslide ? "" : null} key={'popup'+i}>
                   <video controls>
                     <source src={v.video_url} type="video/mp4" />
                   </video>;
                 </li>
        }
      },
      render: function(){
        return <ul>{json_data.map(this.slide)}</ul>
      }
    });
  },
  depopulate: function(selector){
    ReactDOM.unmountComponentAtNode($popup);
    nav.fluid();
  },
  spinner: React.createClass({
    render: function(){
      return (
        <div className="spinner">
          <svg x="0px" y="0px" viewBox="0 0 50 50" enableBackground="new 0 0 50 50">
            <defs>
              <polygon id="spinner1" points="11.8,2.8 16,30.5 31.7,45.3 41,35.8 43,23.3"/>
            </defs>
            <clipPath id="spinner2">
            <use xlinkHref="#spinner1" overflow="visible"/>
            </clipPath>
            <g transform="matrix(1 0 0 1 0 0)" clipPath="url(#spinner2)">
              <image overflow="visible" width="2179" height="2967" xlinkHref={wplocal.templateURL+'/assets/images/wood.jpg'}></image>
            </g>
          </svg>
          <span>loading post</span>
        </div>
      );
    }
  }),
  run: function(rektComp, index){

    let that    = this,
        post    = rektComp.state.posts[index],
        format  = post.format;

    // Switching between postType
    if (format=='gallery'){
      var gallery_path = wplocal.basePathURL+'/wp-json/wp/v2/media?parent='+rektComp.state.posts[index].id;
      
      REST.get(gallery_path)
          .success( function(data){
            rektComp.state.posts[index].gallery = data;
            that.populate(data, 'gallery');
      });
    } else if (format=='video'){
      // console.log(rektComp.state.posts[index]);
      that.populate(rektComp.state.posts[index].fields, 'video');
    } else {
      // article 
      // that.populate(data, 'article');
    }
    
  },
  populate: function(obj, type){
    if(type=='video') obj = obj.videos;

    var that = this,
        Spinner = this.spinner;

    var Component = React.createClass({
      getInitialState: function(){
        return {
          currentslide: 0,
          previouslide: 0,
          fetching: null,
          totalslide: obj.length,
          datatype: type
        }
      },
      componentDidMount: function() {
        nav.static();
      },
      render: function(){
        var GalleryComponent = that.gallery(obj, this),
            Ctrldom = that.controller.dom(this);

        var popup = <div className="slider" data-fetching={this.state.fetching}>
          <div className="content">
            <GalleryComponent />
          </div>
          <Ctrldom />
          <Spinner />
        </div>;

        return popup;
      }
    });

    ReactDOM.render(<Component />, $popup);
    this.show();
  },
  show: function(){
    $popup.dataset.active = true;
  },
  close: function(){
    this.depopulate();
    $popup.dataset.active = false;
  },
  controller: {
    dom: function(that){
      return React.createClass({
        handleClick: function(e){
          var run = e.currentTarget.dataset.control;
          this.navigate[run]();
        },
        navigate: {
          prev: function(){
            // console.log(that);
            var i = that.state.currentslide;
            if (i > 0) {
              i--;
              that.setState({currentslide: i, previouslide: that.state.currentslide});
            }
          },
          next: function(){
            var i     = that.state.currentslide,
                total = that.state.totalslide;
                total--;
            // console.log(this);
            // console.log(ReactDOM.findDOMNode(that));

            if (i < total) {
              i++;
              that.setState({currentslide: i, previouslide: that.state.currentslide});
            }
          },
          close: function(){
            popup.close();
          }
        },
        render: function(){
          var currentslide = that.state.currentslide;
          currentslide++;
          return <div className="controller" data-single={that.state.totalslide == 1 ? '' : null}>
                    <span data-control="close" onClick={this.handleClick} >close</span>
                    <i>{currentslide}</i>
                    <divider> / </divider>
                    <c>{that.state.totalslide}</c>
                    <t>{that.state.datatype}</t>
                    <span data-control="prev" onClick={this.handleClick} >prev</span>
                    <span data-control="next" onClick={this.handleClick} >next</span>
                 </div>          
        }
      });
    }
  }
};
 
var contact = {
  init: function(){
    var that = this;
    var contact = document.getElementById('contact');

    var Thanks = React.createClass({
      getInitialState: function(){
        return { sent: "" }
      },
      render: function(){
        return <div className="thanks">
              <h2>I receive your message</h2>
              <p>Will get back to you shortly.</p>
            </div>
      }
    });

    var Online = React.createClass({
      render: function(){
        return <div>
            <label>Online</label>
            <span><a href="https://www.facebook.com/pages/matheusli/177957308894747" target="_blank">facebook</a></span>
            <span><a href="https://instagram.com/mathiouchio/" target="_blank">instagram</a></span>
            <span><a href="https://dribbble.com/mathiouchio" target="_blank">dribbble</a></span>
          </div>
      }
    });

    var Submission = React.createClass({
      render: function(){
        return <div className="expand" onClick={this.props.onSubmission}>
            <a id="formsubmit">
              <svg x="0px" y="0px" viewBox="0 0 40 40">
                <line stroke="#484848" strokeWidth="1.8" strokeLinecap="round" x1="25.3" y1="20" x2="14.7" y2="20"/>
                <line stroke="#484848" strokeWidth="1.8" strokeLinecap="round" x1="20" y1="14.7" x2="20" y2="25.3"/>
                <circle fill="none" stroke="#484848" strokeWidth="1.8" strokeLinecap="round" cx="20" cy="20" r="12"/>
              </svg>
              <span className="hero smler">Send</span>
            </a>  
          </div>
      }
    });

    var Forms = React.createClass({
      handleChange: function() {
        this.props.onUserInput(
          this.refs.emailInput.value,
          this.refs.messageInput.value
        );
      },
      checker: [false, false],
      validate: function(e){
        var obj = e.currentTarget,
            email_reg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i; 
        
        if (obj.type=="email" && email_reg.test($.trim(obj.value))) {
          this.checker[0] = true;
          delete obj.dataset.invalid;
        } else if (obj.type=="textarea" && $.trim(obj.value)){
          this.checker[1] = true;
          delete obj.dataset.invalid;
        } else {
          obj.dataset.invalid="";
        }

        // console.log(this.checker);

        this.props.onValidate(
          this.checker[0],
          this.checker[1]
        );
      },
      render: function(){
        return <div className="copy"> 
            <form id="contactform" action="http://matheus.li/blog/wp-content/themes/matheus/contact.php" method="post">
              <div>
                <label>email</label> 
                <input type="email" name="email" required ref="emailInput" onBlur={this.validate} value={this.props.email} placeholder="type your email" onChange={this.handleChange} />
              </div>
              <div>
                <label>message</label>
                <textarea type="text" name="message" onBlur={this.validate} required ref="messageInput" value={this.props.message} placeholder="type message ..." onChange={this.handleChange}></textarea>
              </div>
            </form>
          </div>
      }
    });

    var Email = React.createClass({
      getInitialState: function() {
        return {
          sent: null,
          message: '',
          email: '',
          validate: false,
          response: null
        };
      },
      handleValidate: function(validateEmail, validateMessage){
        // console.log(validateEmail, validateMessage); 
        if(validateEmail && validateMessage) {
          this.setState({validate: true});
        }
      },
      handleUserInput: function(email, message){
        this.setState({
          email: email,
          message: message
        });
      },
      handleSubmission: function(e){
        var that = this;
        // console.log('click');
        if(this.state.validate==true) {
          // var dataString = $(dom).find('form').serialize();
          // var dom = ReactDOM.findDOMNode(this),
          var encodedEmail = jQuery.trim(encodeURIComponent(this.state.email)),
              dataString = 'email='+encodedEmail+'&message='+this.state.message;
          
          // console.log(dataString);
          // console.log($(dom));
          // console.log('validet');

          jQuery.ajax({
            type: "POST",
            dataType: "text",
            url: "/matheus.li/wp-content/themes/matheus/contact.php",
            data: dataString
          }).success( function(data){
            // console.log('success!');
            // console.log(data);
            that.setState({ sent: "" });
          }).error( function(data){
            // console.log('error!');
            // console.log(data.status);
            that.setState({ response: data.status });
          });
        }
        return false;
      },
      render: function(){
        return (
          <div className="wrapper" data-sent={this.state.sent}>
            <Online />
            <Forms email={this.state.email} message={this.state.message} onValidate={this.handleValidate} onUserInput={this.handleUserInput} />
            <Thanks response={this.state.response} />
            <Submission onSubmission={this.handleSubmission} />
          </div>
        );
      }
    });
    ReactDOM.render(<Email/>, contact);
  }
};

(function(){
  popup.init();
  rekt.render('projects', wplocal.basePathURL+'/wp-json/wp/v2/portfolio');
  rekt.render('blog',     wplocal.basePathURL+'/wp-json/wp/v2/posts?per_page=100');
  contact.init();
})();