var route = {
  init: function(){
    this.bind();
    this.detect();
  },
  go: function(url){
    history.pushState(null, null, `${wplocal.basePathURL}/${url}/`);
  },
  detect: function(){
    let path = window.location.href.replace(wplocal.basePathURL,'');
    path     = path.split('/').filter(function(e) {
      return String(e).trim();
    });
    if(path[0]=='blog')
      path[0] = 'posts';
    restPath = `${wplocal.basePathURL}/wp-json/wp/v2/${path[0]}?slug=${path[1]}`;

    if(document.location.href != wplocal.basePathURL+'/') {
      REST.get(restPath)
          .done( function(json_data){
            let data = json_data[0];

            // Switching between postType
            if (data.format=='gallery'){
              var gallery_path = wplocal.basePathURL+'/wp-json/wp/v2/media?parent='+data.id;
              
              REST.get(gallery_path) // @TODO: yikes
                  .done( function(galleryData){
                    popup.populate(galleryData, 'gallery');
              });
            } else if (data.format=='video'){
              popup.populate(data.fields, 'video');
            } else { // article
              popup.populate([data], 'article');
            }
          });
    }
  },
  bind: function(){
    window.onpopstate = function(e) {
      if(document.location.href == wplocal.basePathURL+'/') {
        popup.close();
      } else {
        route.detect();
      }
    };
  }
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
    this.calcPositions();
    this.bind(); 
  },
  calcPositions: function(){
    var $section = jQuery(document).find('section');
    $section.each( function(i){
      scrollspy.sectionOffsets[i] = this.offsetTop;
    });
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

var app = {
  requests: {
    Projects: 'https://matheus.li/wp-json/wp/v2/portfolio',
    Blogs: 'https://matheus.li/wp-json/wp/v2/posts',
  },
  popup: {
    el: null,
    init: function() {
      this.el = document.createElement('div');
      this.el.id = 'popup';
      document.body.appendChild(this.el);
    }
  },
  init: function(){
    this.popup.init();
    for (var key in this.requests) {
      if (this.requests.hasOwnProperty(key)) {
        let temp = key;
        app.fetch(this.requests[key])
           .then( data => {
             let Component = this.component[temp];
             ReactDOM.render(
               <Component data={data}/>,
               document.getElementById(temp.toLowerCase())
             );
           });
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
        let slideAttr = (props.data[0] && props.data[0].media_details) ? props.data[0].media_details : null,
            initFormat = (slideAttr) ? slideAttr.height>slideAttr.width : null;

        this.state = {
          portrait: (initFormat) ? !initFormat : true,
          currentslide: 1,
          previouslide: 1,
          fetching: false,
          totalslide: props.data.length,
          muted: true,
          datatype: props.data.format
        };

        this.actions = {
          close: () => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
          },
          next: () => {
            let nextSlide = this.state.currentslide;
                nextSlide++;
            if(this.state.currentslide < this.state.totalslide) {
              this.setState({
                previouslide: this.state.currentslide,
                currentslide: nextSlide
              });
            }
          },
          prev: () => {
            let nextSlide = this.state.currentslide;
                nextSlide--;
            if(this.state.currentslide > 1) {
              this.setState({
                previouslide: this.state.currentslide,
                currentslide: nextSlide
              });
            }
          },
          mute: () => {

          },
          fullscreen: () => {

          }
        }

        this.markups = {
          gallery: () => {
            let Slides = [];
            this.props.data.map( (attr, index) => {
              let currentOffset = this.state.currentslide,
                  previousOffset = this.state.previouslide,
                  slideClassName = 'slide',
                  srcsetSizes = this.imgAttr(attr.media_details),
                  imgSizes    = srcsetSizes.sizes.join(', '),
                  imgSrcset   = srcsetSizes.srcset.join(', ');
                  currentOffset--;
                  previousOffset--;
                  slideClassName += attr.media_details.height>attr.media_details.width ? ' portrait' : '';

              Slides.push(
                <li className={slideClassName}
                    key={attr.id}
                    ref={attr.id}
                    data-show={index==currentOffset ? '' : null}
                    data-transitioning={index==previousOffset ? "" : null}>
                  <img src={attr.source_url}
                       width={attr.media_details.width}
                       height={attr.media_details.height}
                       srcSet={imgSrcset}
                       sizes={imgSizes} />
                </li>
              );
            });
            return Slides;
          },
          video: () => {
            return (
              <li className="article portrait">
                <div className="wrapper">
                  Hello, world!
                </div>
              </li>
            );
          },
          standard: () => {
            return (
              <li className="article portrait">
                <div className="wrapper" dangerouslySetInnerHTML={this.danger(this.props.data.content.rendered)} />
              </li>
            );
          }
        }
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
      danger(raw) {
        return {__html: raw};
      };
      componentDidMount() {
        app.popup.el.dataset.active = '';
      }
      componentWillUnmount() {
        delete app.popup.el.dataset.active;
      }
      shouldComponentUpdate(nextProps, nextState) {
        let offsetSlidePosition = nextState.currentslide;
            offsetSlidePosition--;
        let nextSlideDetail = this.props.data[offsetSlidePosition].media_details;;
        nextState.portrait = !(nextSlideDetail.height>nextSlideDetail.width);
        return true;
      }
      handleClick(e) {
        let action = e.target.dataset.control;
        if (action)
          this.actions[action]();
      }
      Controller() {
        let currentOffset = this.state.currentslide;
            currentOffset++;
        return (
          <div className="controller" data-video={this.state.datatype=='video' ? '' : null} data-single={this.state.totalslide < 2 ? '' : null} onClick={(e) => this.handleClick(e)}>
            <span data-control="close">close</span>
            <i>{this.state.currentslide}</i>
            <divider> / </divider>
            <c>{this.state.totalslide}</c>
            <t>{this.state.datatype}</t>
            <span data-control="prev">prev</span>
            <span data-control="next">next</span>
            <mute data-control="mute">{(this.state.muted)?'unmute':'mute'}</mute>
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
      }
      handleClick(e, target) {
        app.summon.init(target);
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
      render() {
        return (
          <div className="slides">
            <div className="slide">
              <div className="wrapper">
                <ul>{this.loop(this.handleClick)}</ul>
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
      render() {
        return <ul className="slides">{this.loop(this.handleClick)}</ul>;
      };
    },
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
      let Project = React.createClass({
        getInitialState: function(){ return null },
        componentWillMount: function(){
          var that = this;
          REST.get(url)
              .done( function(data){
                that.setState({ posts: data });
              });
        },
        componentDidUpdate: function(){
          // adding gallery
          if(this.state.posts.length) {
            this.state.posts.map(this.gallery);
            scrollspy.calcPositions();
          }
          nav.travelOnRdy();
        },
        gallery: function(v, i){
          var that = this;
          if (!v.gallery){
            var gallery_path = wplocal.basePathURL+'/wp-json/wp/v2/media?parent='+v.id; 
            
            REST.get(gallery_path).done( function(data){
              that.state.posts[i].gallery = data;
            });
          }
        },
        handleClick: function(i,v,e){
          /* Preventing preventDefault on new tab click */
          if (!e.ctrlKey || !e.shiftKey || !e.metaKey || (e.button && e.button != 1)){
            let galleryJSON = this.state.posts[i].gallery,
                pathSlug    = `${v.type}/${v.slug}`;
            
            popup.run(this, i);
            route.go(pathSlug);

            e.preventDefault();
            e.stopPropagation();
          }
        },
        render: function(){
          var that = this;
          var slide = function(v,i){
            var boundClick = that.handleClick.bind(that, i, v);
            return (
              <div className="slide" key={'project-'+i}>
                <div className="wrapper">
                  <h1>{v.title.rendered}</h1>
                  <div className="copy" dangerouslySetInnerHTML={rekt.component.danger(v.content.rendered)} />
                  <div className="expand">
                    <a href={v.link} onClick={boundClick}>
                    <svg x="0px" y="0px" viewBox="0 0 40 40">
                      <line x1="25.3" y1="20" x2="14.7" y2="20"></line>
                      <line x1="20" y1="14.7" x2="20" y2="25.3"></line>
                      <circle fill="none" cx="20" cy="20" r="12"></circle>
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
      return Project;
    },
    blog: function(url){
      let Blog = React.createClass({
        getInitialState: function(){
          return null;
        },
        componentWillMount: function(){
          var that = this;
          REST.get(url)
              .done( function(data){
                that.setState({
                  posts: data,
                  expanded: null
                });
              });
        },
        handleClick: function(i,v,e){
          /* Preventing preventDefault on new tab click */
          if (!e.ctrlKey || !e.shiftKey || !e.metaKey || (e.button && e.button != 1)){
            popup.run(this, i);
            pathSlug    = `blog/${v.slug}`;
            route.go(pathSlug);
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
          nav.travelOnRdy();
          scrollspy.calcPositions();
        },
        metas: {
          counter: 0
        },
        expandSection: function(){
          this.setState({ expanded: (this.state.expanded) ? false : true });
          setTimeout( function(){
            scrollspy.calcPositions();
          }, 350);
        },
        render: function(){
          var output      = [],
              posts       = [],
              uid_svg     = 0,
              uid_svg_off = uid_svg++,
              that        = this;

          this.metas.counter = 0;

          var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          
          var slide = function(v,i){
            var date   = new Date(v.date),
                month  = date.getMonth(),
                year   = date.getFullYear();
                year  -= 2000,
                thumbnail = '';

            if(v.better_featured_image) {
              if (v.better_featured_image.media_details.sizes.thumbnail){
                thumbnail = v.better_featured_image.media_details.sizes.thumbnail.source_url;
              }
            }

            var boundClick = that.handleClick.bind(that, i, v),
                post = (
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

            output.push(<li key={"divider"+that.metas.counter}>{posts}</li>);
            posts = [];
            that.metas.counter++;
          };

          if (this.state) {
            this.state.posts.map(slide);
            if(this.state.expanded) {
              expandButton = (
                <a>
                  <svg x="0px" y="0px" viewBox="0 0 40 40">
                    <circle fill="none" cx="20" cy="20" r="12"></circle>
                    <line x1="25.3" y1="20" x2="14.7" y2="20"></line>
                  </svg>
                  <span className="hero smler">Hide posts</span>
                </a>
              );
            } else {
              expandButton = (
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
            
            return (
              <div className="slider noslide" data-expanded={(this.state.expanded)}>
                <div className="slides" ref="blogDOM">
                  <div className="slide">
                    <div className="wrapper">
                      <ul>
                        {output}
                      </ul>
                      <div className="expand" onClick={this.expandSection}>
                        {expandButton}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        }
      });
      return Blog;
    }
  }
};

var popup = {
  plyr: {
    obj: null,
    rektObj: null,
    init: function(rektObj){
      this.obj     = plyr.setup();
      this.rektObj = rektObj;
      this.responsive();

      var targetslide = this.rektObj.state.currentslide,
          targetplyr  = this.obj[targetslide];

      targetplyr.on('ready', function(e){
        // console.log(targetplyr);
        if(!targetplyr.isMuted())
          targetplyr.toggleMute();
          targetplyr.play();
      });
    },
    destroy: function(){
      this.obj.map( function(target){ target.destroy() });
    },
    mathematics: function(target){
      // console.log('calculating');
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
    return React.createClass({
      getInitialState: function(){
        return { loading: null }
      },
      componentWillMount: function() {
        let states = [];
        // calculating how many data-loaded states
        json_data.map(function(){
          states.push(false);
        });
        this.state.loading = states;
      },
      componentDidMount: function(){
        if(that.state.datatype == 'video')
          popup.plyr.init(that);
        // toggle for data-loading attr
        this.toggleDataLoaded();
      },
      toggleDataLoaded: function(){
        for (let i in this.refs) {
          if(this.refs[i].childNodes[0].tagName == 'IMG') {
            /* Check if img is loaded:
             * Not all mount requires data-loading
             * because next and previous image sliding requires re-mounting
             */
            if(!this.refs[i].childNodes[0].complete) {
              $(this.refs[i].childNodes[0]).attr('data-loading', ''); // inject attr if image is loading
              $(this.refs[i].childNodes[0]).on('load', function(){ // remove attr if image is done loading
                $(this).removeAttr('data-loading');
              });
            }

          }
        }
      },
      componentWillUnmount: function() {
        if(that.state.datatype == 'video')
          popup.plyr.destroy();
      },
      imgAttr: function(obj){
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
          // console.log(key);
          // if matches, index is >= 0
          let index = imagesets.sizes.indexOf(key);
          if (index>=0){
            let srcsetOut = `${obj.sizes[key].source_url} ${obj.sizes[key].width}w`;
                // sizesOut  = `(min-width: ${imagesets.breakpoints[index]}px) ${obj.sizes[key].width}px`;
            
            // determine the biggest size
            if(obj.sizes.full.width > obj.sizes[key].width && once == true){
              var biggestSrcset = `${obj.sizes.full.source_url} ${obj.sizes.full.width}w`;
                  // biggestSize   = `${obj.sizes.full.width}px`;
              once = false;
            }

            // populate
            output['srcset'].push(srcsetOut);
            // output['sizes'].push(sizesOut);
          }
        }
        // populate the biggest srcset attr
        output['srcset'].push(biggestSrcset);
        output.srcset.reverse();
        // output.sizes.reverse();
        // output['sizes'].push(biggestSize);
        // output['sizes'].push('100vw');
        output.sizes = ['100vw'];
        return output;
      },
      truthCheck: function(el){
        return el === true;
      },
      setStatus: function(a,b){
        // console.log(this.state);
        // console.log(a);
        // console.log(b);
        // console.log(this.refs[a]);
        this.state.loading[a] = true;
        // this.setState({ loading: this.state.loading });

        if(this.state.loading.every(this.truthCheck)) {
          // unbind/remove looping spinner animation 
          ohSnap.loop.destroy();
        }
      },
      slide: function(v,i){
        if (v.media_details) { 
          const srcsetSizes = this.imgAttr(v.media_details),
                imgSizes    = srcsetSizes.sizes.join(', '),
                imgSrcset   = srcsetSizes.srcset.join(', ');
          // console.log(srcsetSizes);
          return <li data-show={i==that.state.currentslide ? '' : null}
                      data-transitioning={i==that.state.previouslide ? "" : null}
                      className={v.media_details.height > v.media_details.width ? 'portrait' : null}
                      key={'popup'+i}
                      ref={'slide'+i}>
                    <img src={v.source_url}
                         width={v.media_details.width}
                         height={v.media_details.height}
                         srcSet={imgSrcset}
                         sizes={imgSizes}
                         onLoad={this.setStatus.bind(this, i)} />
                  </li>
        } else if (v.youtube_id || v.vimeo_id){
          var youmeo = (v.youtube_id) ? 'youtube' : 'vimeo',
              vid    = (youmeo) ? v.youtube_id : v.vimeo_id;

          return <li data-show={i==that.state.currentslide ? '' : null}
                      data-transitioning={i==that.state.previouslide ? "" : null}
                      key={'popup'+i} ref={'slide'+i}>
                    <div data-type={youmeo} data-video-id={vid}></div>
                 </li>
        } else if (v.video_url){ 
          return <li data-show={i==that.state.currentslide ? '' : null}
                     data-transitioning={i==that.state.previouslide ? "" : null}
                     key={'popup'+i} ref={'slide'+i}>
                   <video controls>
                     <source src={v.video_url} type="video/mp4" />
                   </video>
                 </li>
        } else if (v.format=='standard'){
          return <li className='article portrait' data-show key={'popup'+i} ref={'slide'+i}>
                   <div className='wrapper' dangerouslySetInnerHTML={rekt.component.danger(v.content.rendered)} />
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
  Spinner: React.createClass({
    render: function(){
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
  }),
  run: function(rektComp, index){
    let that    = this,
        post    = rektComp.state.posts[index],
        format  = post.format;

    // Switching between postType
    if (format=='gallery'){
      var gallery_path = wplocal.basePathURL+'/wp-json/wp/v2/media?parent='+rektComp.state.posts[index].id;
      
      // Getting gallery datas for attached images in a post
      REST.get(gallery_path)
          .done( function(data){
            rektComp.state.posts[index].gallery = data;
            that.populate(data, 'gallery');
      });
    } else if (format=='video'){
      that.populate(rektComp.state.posts[index].fields, 'video');
    } else { // article
      let data    = [];
          data[0] = rektComp.state.posts[index];
      that.populate(data, 'article');
    }
  },
  populate: function(data, type){
    if(type=='video')
      data = data.videos;

    var that      = this,
        Spinner   = this.Spinner;
    var Popup = React.createClass({
      getInitialState: function(){
        return {
          portrait: null,
          currentslide: 0,
          previouslide: 0,
          fetching: null,
          totalslide: data.length,
          datatype: type
        }
      },
      componentWillMount: function() {
        let portraitCheck = this.portraitvslandscape(this.state.currentslide);
        this.setState({ portrait: portraitCheck });
      },
      componentDidMount: function(){
        nav.static();
        ohSnap.loop.run('#spinner');
      },
      portraitvslandscape: function(i){
        if (type=='gallery') {
          return (data[i].media_details.height > data[i].media_details.width) ? true : false;
        } else {
          return true;
        }
      },
      render: function(){
        var GalleryComponent = that.gallery(data, this),
            Ctrldom = that.controller.dom(this);

        var popup = <div className="slider" data-fetching={this.state.fetching} data-type={this.state.datatype}>
          <div className="content">
            <GalleryComponent />
          </div>
          <Ctrldom />
          <Spinner />
        </div>;

        return popup;
      }
    });

    ReactDOM.render(<Popup />, $popup);
    this.show();
  },
  show: function(){
    $popup.dataset.active = true;
  },
  close: function(){
    this.depopulate();
    $popup.dataset.active = false;
    if(document.location.href != wplocal.basePathURL+'/') 
      history.pushState(null, null, wplocal.basePathURL+'/');
  },
  controller: {
    dom: function(that){
      var PopupNav = React.createClass({
        getInitialState: function(){
          return {
            muted: true
          }
        },
        handleClick: function(e){
          var run = e.currentTarget.dataset.control;
          this.navigate[run](this);
        },
        navigate: {
          mute: function(popnavRoot){
            if (popup.plyr.obj.length)
              popup.plyr.obj[that.state.currentslide].toggleMute();
              popnavRoot.setState({muted: (popup.plyr.obj[that.state.currentslide].isMuted()) ? true : false });
          },
          fullscreen: function(){
            popup.plyr.obj[that.state.currentslide].toggleFullscreen();
          },
          prev: function(){
            var i = that.state.currentslide;
            if (i > 0) {
              i--;
              let portraitCheck = that.portraitvslandscape(i);
              that.setState({currentslide: i, previouslide: that.state.currentslide, portrait: portraitCheck});
            }
          },
          next: function(){
            var i     = that.state.currentslide,
                total = that.state.totalslide;
                total--;
            if (i < total) {
              i++;
              let portraitCheck = that.portraitvslandscape(i);
              that.setState({currentslide: i, previouslide: that.state.currentslide, portrait: portraitCheck});
            }
          },
          close: function(){
            popup.close();
          }
        },
        render: function(){
          var currentslide = that.state.currentslide;
          currentslide++;
          return <div className="controller" data-video={that.state.datatype=='video' ? '' : null} data-single={that.state.totalslide == 1 ? '' : null}>
            <span data-control="close" onClick={this.handleClick} >close</span>
            <i>{currentslide}</i>
            <divider> / </divider>
            <c>{that.state.totalslide}</c>
            <t>{that.state.datatype}</t>
            <span data-control="prev" onClick={this.handleClick} >prev</span>
            <span data-control="next" onClick={this.handleClick} >next</span>
            <mute data-control="mute" onClick={this.handleClick}>{(this.state.muted)?'unmute':'mute'}</mute>
            <fs data-control="fullscreen" onClick={this.handleClick}>fullscreen</fs>
            <scroll data-hidden={that.state.portrait==false ? '' : null}>scroll</scroll>
          </div>
        }
      });
      return PopupNav;
    }
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
              dataString = 'email='+encodedEmail+'&message='+this.state.message;

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
  route.init();
  scrollspy.init();
  contact.init();
  app.init();
})();


