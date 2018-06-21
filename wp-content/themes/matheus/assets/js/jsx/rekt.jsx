var app = {
  init: function(){
    this.scrollspy.init();
    this.route.init();
    this.popup.init();
    this.requests = {
      Projects: wplocal.basePathURL+'/wp-json/wp/v2/portfolio',
      Blogs: wplocal.basePathURL+'/wp-json/wp/v2/posts?per_page=100',
    };
    for (var key in this.requests) {
      if (this.requests.hasOwnProperty(key)) {
        let tempKey = key;
        app.fetch(this.requests[key])
           .then( data => {
             let Component = this.component[tempKey];
             ReactDOM.render(
               <Component data={data}/>,
               document.getElementById(tempKey.toLowerCase())
             );
           });
      }
    }
  },
  scrollspy: {
    state: {
      triggerPos: 0,
      sectionPositions: []
    },
    init: function() {
      // Poor man React.js
      this.state.sections = (!this.state.sections) ? document.body.getElementsByTagName('SECTION') : this.state.sections;
      this.state.nav = (!this.state.navigations) ? document.body.getElementsByTagName('NAV') : this.state.nav;
      this.state.navigations = (!this.state.navigations) ? this.state.nav[0].getElementsByTagName('LI') : this.state.navigations;

      this.calcPositions();
      this.bind(); 
    },
    calcPositions: function(){
      let i = 0;
      for(el of this.state.sections) {
        this.state.sectionPositions[i] = el.offsetTop;
        i++;
      }
    },
    bind: function(){
      window.addEventListener('scroll', () => {
        let tempPos = 0;
        for (var i in this.state.sectionPositions) {
          if (window.pageYOffset >= this.state.sectionPositions[i]){
            tempPos = i;
          }
        }
        
        /* Only apply rules and styles in between sections:
         * value of positions changed
         */
        if(tempPos != this.state.triggerPos) {
          this.state.triggerPos = tempPos;
          this.nav(this.state.triggerPos);
          this.brand(this.state.triggerPos);
        }
      });
    },
    nav: function(pos){
      pos--;
      for(el of this.state.navigations) {
        el.classList.remove('active');
      }
      if(pos >= 0) // only do it if needed
        this.state.navigations[pos].className = 'active';
    },
    brand: function(i){
      ohSnap.go('#branding', i);
    }
  },
  route: {
    init: function(){
      this.bind();
      this.detect();
    },
    go: function(url=""){
      let path = (url) ? `${url}/` : "";
      history.pushState(null, null, `${wplocal.basePathURL}/${path}`);
    },
    detect: function(){
      let path = window.location.pathname; // get paths
          path = path.substring(1, path.length-1) // kill first and last char
                     .split('/'); // make an array
      if(path.length < 2)
          path = [...['posts'], ...path]; // add posts for first path
          path = path.filter( e => { // kill empty string
            return String(e).trim();
          });

      if(path.length) {
        app.fetch(`${wplocal.basePathURL}/wp-json/wp/v2/${path[0]}?slug=${path[1]}`)
           .then( data => {
             app.summon.init(data[0]);
           });
      }
    },
    bind: function(){
      window.onpopstate = (e) => {
        if(document.location.href == wplocal.basePathURL+'/') {
          app.popup.destroy();
        } else {
          this.detect();
        }
      };
    }
  },
  plyr: {
    state: {}, // poor man React.js 🤘🏻
    setup: function(position){
      if(!this.state.once) {
        this.state.obj = plyr.setup();
        this.state.once = true;
      }
      this.state.position = position;
    },
    init: function(target=0, reset=false){
      if(reset)
        this.state.once = false;
      this.setup(target);
      this.responsive(target);
      this.eventcheck('ready')
          .then( e => {
            if(!this.state.obj[target].isMuted()) {
              this.state.obj[target].toggleMute();
            }
            // @🐛: ready doesn't always trigger
            this.state.obj[target].play();
          });
      this.state.obj[target].play(); // @🐛: double tap
    },
    videoEl: function(){
      return (this.state.obj[this.state.position].getEmbed()) ? this.state.obj[this.state.position].getEmbed().a : this.state.obj[this.state.position].getMedia();
    },
    destroy: function(){
      this.state.obj.map( target => { target.destroy() });
    },
    fullscreen: function(){
      this.state.obj[this.state.position].toggleFullscreen();
    },
    pause: function(target = this.state.position){
      this.state.obj[target].pause();
    },
    unmute: function(){
      this.state.obj[this.state.position].toggleMute();
    },
    eventcheck: function(type){
      let target = this.videoEl();
      return new Promise( (resolve, reject) => {
        function handleEvents(e) {
          target.removeEventListener(type, handleEvents);
          resolve(e);
        }
        target.addEventListener(type, handleEvents);
      });
    },
    mathematics: function(target){
      if(target.tagName != 'IFRAME' && target.tagName != 'VIDEO')
        target = target.childNodes[0];

      let vHeight = (target.height) ? target.height : target.videoHeight,
          vWidth  = (target.width) ? target.width : target.videoWidth,
          vRatio  = vWidth/vHeight,
          realHeight = window.innerHeight;
          realWidth  = realHeight * vRatio;

      target.width = realWidth;
      target.style.width = realWidth+'px';
    },
    responsive: function(target){
      let targetVid = (this.state.obj[target].getEmbed()) ? this.state.obj[target].getEmbed().a : this.state.obj[target].getMedia();

      if(targetVid.tagName == 'VIDEO') {
        // waiting for all the metadatas load to determine height x width
        this.eventcheck('loadedmetadata')
            .then( e => {
              this.mathematics(targetVid);
              this.videoEl().style.display = 'block';
            });
      } else {
        this.mathematics(targetVid);
      }
    }
  },
  popup: {
    el: null,
    init: function() {
      this.el = document.createElement('div');
      this.el.id = 'popup';
      document.body.appendChild(this.el);
    },
    destroy: function(){
      if(this.el.hasChildNodes()) {
        ReactDOM.unmountComponentAtNode(document.getElementById('popup'));
        delete document.body.dataset.static;
      }
    }
  },
  fetch: (url) => {
    return fetch(url).then(response => response.json());
  },
  summon: {
    fetch: {
      gallery: (target, cb) => {
        app.fetch(wplocal.basePathURL+'/wp-json/wp/v2/media?parent='+target.id)
           .then( data => {
             data.format = target.format;
             cb(data);
           });
      },
      video: (target, cb) => {
        cb(target);
      },
      standard: (data, cb) => {
        cb(data);
      }
    },
    init: function(data){
      this.fetch[data.format](data, this.render);
    },
    render: (data) => {
      let Popup = app.component.Popup;
      ReactDOM.render(
        <Popup data={data} />,
        document.getElementById('popup')
      );
    }
  },
  component: {
    Popup: class Popup extends React.Component {
      constructor(props) {
        super(props);
        // console.log(props);
        let slideAttr = (props.data[0] && props.data[0].media_details) ? props.data[0].media_details : null,
            initFormat = (slideAttr) ? slideAttr.height>slideAttr.width : null,
            totalslide = 1;

        totalslide = (props.data.length) ? props.data.length : totalslide;
        totalslide = (props.data.format == 'video') ? props.data.fields.videos.length : totalslide;

        this.state = {
          portrait: (initFormat) ? !initFormat : true,
          currentslide: 0,
          previouslide: 0,
          loaded: {},
          totalslide: totalslide,
          muted: true,
          datatype: props.data.format
        };

        this.actions = {
          close: () => {
            this.destroy();
          },
          next: () => {
            let nextSlide = this.state.currentslide;
                nextSlide++,
                offsetTotal = this.state.totalslide;
                offsetTotal--;

            if(this.state.currentslide < offsetTotal) {
              this.setState({
                previouslide: this.state.currentslide,
                currentslide: nextSlide
              });
            }
          },
          prev: () => {
            let nextSlide = this.state.currentslide;
                nextSlide--;
            if(this.state.currentslide > 0) {
              this.setState({
                previouslide: this.state.currentslide,
                currentslide: nextSlide
              });
            }
          },
          mute: () => {
            app.plyr.unmute(this.state.currentslide);
          },
          fullscreen: () => {
            app.plyr.fullscreen(this.state.currentslide);
          }
        }

        this.markups = {
          gallery: () => {
            let Slides = [];
            this.props.data.map( (attr, index) => {
              let slideClassName = 'gallery',
                  srcsetSizes = this.imgAttr(attr.media_details),
                  imgSizes    = srcsetSizes.sizes.join(', '),
                  imgSrcset   = srcsetSizes.srcset.join(', ');
                  slideClassName += attr.media_details.height>attr.media_details.width ? ' portrait' : '';

              Slides.push(
                <li className={slideClassName}
                    key={attr.id}
                    ref={attr.id}
                    data-show={index==this.state.currentslide ? '' : null}
                    data-transitioning={index==this.state.previouslide ? "" : null}
                    data-loaded={this.state.loaded[index] ? '' : null}>
                  <img src={attr.source_url}
                       width={attr.media_details.width}
                       height={attr.media_details.height}
                       srcSet={imgSrcset}
                       sizes={imgSizes}
                       onLoad={this.loadedState.bind(this, index)} />
                </li>
              );
            });
            return Slides;
          },
          video: () => {
            let Videos = [];
            this.props.data.fields.videos.map( (video, index) => {
              let youmeo = (video.youtube_id) ? 'youtube' : 'vimeo',
                  vid = (youmeo) ? video.youtube_id : video.vimeo_id,
                  videoEl = video.video_url ? (
                    <video controls>
                      <source src={video.video_url} type="video/mp4" />
                    </video>
                  ) : (
                    <div data-type={youmeo} data-video-id={vid}></div>
                  );
              Videos.push(
                <li data-show={index==this.state.currentslide ? '' : null}
                    data-transitioning={index==this.state.previouslide ? "" : null}
                    key={vid || video.video_url}
                    ref={video.id}>
                  {videoEl}
                </li>
              );
            });
            return Videos;
          },
          standard: () => {
            return (
              <li className="article portrait" data-show>
                <div className="wrapper" dangerouslySetInnerHTML={this.danger(this.props.data.content.rendered)} />
              </li>
            );
          }
        }
      }
      loadedState(index) {
        let tempLoadedState = this.state.loaded;
        tempLoadedState[index] = true;
        this.setState({ loaded: tempLoadedState });
      }
      imgAttr(obj) {
        let imagesets = {
              sizes:       ['gallery-medium-large','gallery-medium','gallery-small'],
              breakpoints: [1440,768,320]
            },
            output = { srcset:[], sizes:[] },
            once   = true;

        /** Build srcset
         *  Collecting assets
         *  srcset="http://matheus.li/wp-content/uploads/2017/08/disney-jr-768x914.jpg 768w,
                    http://matheus.li/wp-content/uploads/2017/08/disney-jr-1400x1666.jpg 1400w"
         *
         ** Build sizes
         *  setting attribute for viewport sizes
         *  sizes="(min-width: 1400px) 2560px,
                   (min-width: 768px) 1400px,
                   (min-width: 320px) 768px, 100vw"
         *
         ** Saving sizes for later, @TODO: can't get it to work,
         *  Chrome is already smart enough to switch with 100vw
         */

        // looking for imagesets.sizes matched key strings
        for (var key in obj.sizes) {
          // if matches, index is >= 0
          let index = imagesets.sizes.indexOf(key);
          if (index>=0){
            let srcsetOut = `${obj.sizes[key].source_url} ${obj.sizes[key].width}w`;

            // determine the biggest size
            if(obj.sizes.full.width > obj.sizes[key].width && once == true){
              var biggestSrcset = `${obj.sizes.full.source_url} ${obj.sizes.full.width}w`;
              once = false;
            }

            // populate
            output['srcset'].push(srcsetOut);
          }
        }
        // populate the biggest srcset attr
        output['srcset'].push(biggestSrcset);
        output.srcset.reverse();
        output.sizes = ['100vw'];
        return output;
      }
      destroy() {
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
        delete document.body.dataset.static;
      }
      danger(raw) {
        return {__html: raw};
      };
      bindEscKey() {
        document.onkeydown = (e = window.event) => {
          if (e.keyCode == 27) {
            this.destroy();
            app.route.go();
          }
        };
      }
      staticWindow() {
        document.body.dataset.static = '';
      }
      componentDidMount() {
        // prevent scroll
        this.staticWindow();
        // give data-active to popup container
        app.popup.el.dataset.active = '';
        // unbind key
        document.onkeydown = null;
        // kill popup with esc key
        this.bindEscKey();
        // bind plyr
        if(this.state.datatype == 'video')
          app.plyr.init(0, true);
      }
      componentWillUnmount() {
        document.onkeydown = null;
        delete app.popup.el.dataset.active;
      }
      componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.datatype == 'video')
          app.plyr.init(this.state.currentslide);
      }
      shouldComponentUpdate(nextProps, nextState, index) {
        let nextImgSlide = this.props.data.length ? this.props.data[nextState.currentslide] : null,
            nextSlideDetail = nextImgSlide ? nextImgSlide.media_details : null;

        // get orientation
        nextState.portrait = nextSlideDetail ? !(nextSlideDetail.height>nextSlideDetail.width) : false;
        // pause current plyr slide
        if(this.state.datatype == 'video')
          app.plyr.pause(this.state.currentslide);

        return true;
      }
      handleClick(e) {
        let action = e.target.dataset.control;
        if (action)
          this.actions[action]();
      }
      Spinner() {
        return (
          <div id="spinner">
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
      Controller() {
        let offsetCurrent = this.state.currentslide;
        offsetCurrent++;
        return (
          <div className="controller" data-video={this.state.datatype=='video' ? '' : null} data-single={this.state.totalslide < 2 ? '' : null} onClick={(e) => this.handleClick(e)}>
            <span data-control="close">close</span>
            <i>{offsetCurrent}</i>
            <divider> / </divider>
            <c>{this.state.totalslide}</c>
            <t>{this.state.datatype}</t>
            <span data-control="prev">prev</span>
            <span data-control="next">next</span>
            <mute data-control="mute">{this.state.muted ?'unmute':'mute'}</mute>
            <fs data-control="fullscreen">fullscreen</fs>
            <scroll data-hidden={this.state.portrait ? '' : null}>scroll</scroll>
          </div>
        );
      }
      render() {
        let format = this.props.data.format,
            Slide  = this.markups[format](format);
        return (
          <div className="slider">
            <div className="content">
              <ul>
                {Slide}
                {this.Spinner()}
                {this.Controller()}
              </ul>
            </div>
          </div>
        );
      }
    },
    Blogs: class Blogs extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          expanded: false
        }
      }
      handleClick(e, target) {
        app.summon.init(target);
        app.route.go(`blog/${target.slug}`);
        e.stopPropagation();
        e.preventDefault();
      };
      loop() {
        let Blog = [],
            featured,
            thumb,
            thumbURL;
        this.props.data.map( (attr, index) => {
          featured = attr.better_featured_image
          if(featured) {
            thumb = featured.media_details.sizes.thumbnail;
            if(thumb) {
              thumbURL = thumb.source_url;
              Blog.push(
                <li key={attr.id}>
                  <div className="post">
                    <a href={attr.link} onClick={(e) => this.handleClick(e, attr)}>
                      <div className="thumb">
                        <svg x="0px" y="0px" viewBox="0 0 180 200">
                          <g fillRule="evenodd" clipRule="evenodd">
                            <defs>
                              <polygon id={'SVGID_thumb_'+attr.id+'_'} points="57,199,1,72,113,1,163,30,161,113"></polygon>
                            </defs>
                            <clipPath id={'SVGID_thumb_a_'+attr.id+'_'}>
                              <use xlinkHref={'#SVGID_thumb_'+attr.id+'_'} overflow="visible"></use>
                            </clipPath>
                            <g clipPath={'url(#SVGID_thumb_a_'+attr.id+'_)'}>
                              <image overflow="visible" width="300" height="300" xlinkHref={thumbURL} transform="matrix(0.6666666666666666,0,0,0.6666666666666666,-10,0)"></image>
                            </g>
                          </g>
                        </svg>
                      </div>
                    </a>
                  </div>
                </li>
              );
            }
          }
        });
        return Blog;
      };
      handleExpansion(e) {
        this.setState({expanded: !this.state.expanded});
      }
      expandButton() {
        return (
          <a>
            <svg x="0px" y="0px" viewBox="0 0 40 40">
              <line x1="25.3" y1="20" x2="14.7" y2="20"></line>
              <line x1="20" y1="14.7" x2="20" y2="25.3"></line>
              <circle fill="none" cx="20" cy="20" r="12"></circle>
            </svg>
            <span className="hero smler">Show posts</span>
          </a>
        );
      }
      componentDidMount() {
        app.scrollspy.calcPositions();
      }
      render() {
        return (
          <div className="slides" data-expanded={this.state.expanded ? '' : null}>
            <div className="slide">
              <div className="wrapper">
                <ul>{this.loop()}</ul>
                <div className="expand"
                     onClick={(e) => this.handleExpansion(e)}>
                  {this.expandButton()}
                </div>
              </div>
            </div>
          </div>
        );
      };
    },
    Projects: class Projects extends React.Component {
      constructor(props) {
        super(props);
      }
      handleClick(e, target) {
        app.summon.init(target);
        app.route.go(`${target.type}/${target.slug}`);
        e.stopPropagation();
        e.preventDefault();
      };
      danger(raw) {
        return {__html: raw};
      };
      link(url) {
        return (
          <a href={url}>
            <svg x="0px" y="0px" viewBox="0 0 40 40">
              <line x1="25.3" y1="20" x2="14.7" y2="20"></line>
              <line x1="20" y1="14.7" x2="20" y2="25.3"></line>
              <circle fill="none" cx="20" cy="20" r="12"></circle>
            </svg>
            <span className="hero smler">Learn more</span>
          </a>
        );
      };
      loop() {
        let Project = [];
        this.props.data.map( (attr, index) => {
          Project.push(
            <li className="slide" key={attr.id}>
              <div className="wrapper">
                <h1>{attr.title.rendered}</h1>
                <div className="copy" dangerouslySetInnerHTML={this.danger(attr.content.rendered)} />
                <div className="expand" onClick={(e) => this.handleClick(e, attr)}>{this.link(attr.link)}</div>
              </div>
            </li>
          );
        });
        return Project;
      };
      componentDidMount() {
        app.scrollspy.calcPositions();
      }
      render() {
        return <ul className="slides">{this.loop(this.handleClick)}</ul>;
      };
    },
  }
};
 
var contact = {
  init: function(){
    var that = this,
        contact = document.getElementById('contact');

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
            <label>Social</label>
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
                <line x1="25.3" y1="20" x2="14.7" y2="20"/>
                <line x1="20" y1="14.7" x2="20" y2="25.3"/>
                <circle fill="none" cx="20" cy="20" r="12"/>
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

        this.props.onValidate(
          this.checker[0],
          this.checker[1]
        );
      },
      render: function(){
        return <div className="copy"> 
            <form id="contactform" action={wplocal.templateURL+'/contact.php'} method="post">
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
        if(this.state.validate==true) {
          var encodedEmail = jQuery.trim(encodeURIComponent(this.state.email)),
              dataString = 'email='+encodedEmail+'&message='+this.state.message,
              jsonData = {
                email: encodedEmail,
                message: this.state.message
              };

          // fetch(wplocal.templateURL+'/contact.php', {
          //     body: JSON.stringify(jsonData),
          //     headers: {
          //       'Access-Control-Allow-Origin': '*',
          //       'content-type': 'text/plain'
          //     },
          //     method: 'POST',
          //     mode: 'no-cors',
          //   })
          //   .then(response => response.text())
          //   .then(data => console.log(data));

          jQuery.ajax({
            type: "POST",
            dataType: "text",
            url: "/blog/wp-content/themes/matheus/contact.php",
            data: dataString
          }).done( function(data){
            that.setState({ sent: "" });
          }).fail( function(data){
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
  contact.init();
  app.init();
})();


