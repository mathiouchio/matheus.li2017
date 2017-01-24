'use strict';

/*! react you wot */

if (window.location.hostname != 'localhost') {
  wplocal.basePathURL = window.location.origin;
}

// global vars
var $body = jQuery('body'),
    $section = $body.find('section'),
    $nav = $body.find('nav'),
    $blog = $body.find('#blog'),
    $project = $body.find('#projects'),
    $thumbs = $body.find('.thumb'),
    $popup; // = $body.find('#popup'); // hasn't been built by popup Class

var scrollspy = {
  sectionOffsets: [],
  index: 0,
  init: function init() {
    var $section = jQuery(document).find('section');
    $section.each(function (i) {
      scrollspy.sectionOffsets[i] = this.offsetTop;
    });
    this.bind();
  },
  bind: function bind() {
    window.addEventListener('scroll', function () {
      var yPos = this.pageYOffset,
          yOffsets = scrollspy.sectionOffsets,
          index = 0;
      // console.log(yPos);

      for (var i in yOffsets) {
        if (yPos >= yOffsets[i]) {
          index = i;
        }
      }

      /* Only apply rules and styles in between sections:
       * value of positions changed
       */
      if (index != scrollspy.index) {
        // console.log('changed');
        scrollspy.index = index;
        scrollspy.nav(scrollspy.index);
        scrollspy.brand(scrollspy.index);
      }
    });
  },
  nav: function nav(i) {
    i--;
    $nav.find('li').removeClass('active');
    if (i >= 0) // only do it if needed
      $nav.find('li').eq(i).addClass('active');
  },
  brand: function brand(i) {
    ohSnap.go('#branding', i);
  }
};

var REST = {
  json: {},
  get: function get(restURL) {
    return jQuery.ajax({
      url: restURL,
      context: document.body,
      dataType: 'json'
    });
  },
  store: function store(data, type) {
    REST.json[type] = [];
    // console.log(data);
    if (data.constructor === Array) {
      data.map(function (currentValue, index) {
        // console.log(currentValue);
        // push data to parent object
        REST.json[type].push(currentValue);
      });
    } else {
      REST.json[type] = data;
    }
  }
};

var wp_REST = {
  init: function init() {
    this.category.fetch_and_store(wplocal.basePathURL + '/wp-json/wp/v2/categories');
  },
  category: {
    fetch_and_store: function fetch_and_store(url) {
      REST.get(url).success(function (data) {
        REST.json.category_slugs = data;
      });
    },
    loopcheck: function loopcheck(data) {
      for (var i = 0; i < REST.json.category_slugs.length; i++) {
        if (REST.json.category_slugs[i].id == data) {
          return REST.json.category_slugs[i].slug;
        }
      }
    },
    checker: function checker(ids) {
      if (ids.length > 1) {
        for (var b = 0; b < ids.length; b++) {
          if (this.loopcheck(ids[b])) return this.loopcheck(ids[b]);
        }
      } else {
        return this.loopcheck(ids);
      }
    }
  }
};

var rekt = {
  render: function render(id, url) {
    var Component = this.component[id](url);
    ReactDOM.render(React.createElement(Component, null), document.getElementById(id));
  },
  component: {
    danger: function danger(raw) {
      return { __html: raw };
    },
    projects: function projects(url) {
      return React.createClass({
        getInitialState: function getInitialState() {
          // console.log('init');
          return null;
        },
        componentWillMount: function componentWillMount() {
          // console.log('will mount');
          var that = this;
          REST.get(url).success(function (data) {
            that.setState({ posts: data });
          });
        },
        componentDidMount: function componentDidMount() {
          // console.log('did mount');
        },
        componentWillUpdate: function componentWillUpdate() {
          // console.log('will update');
          // console.log(this.state);
        },
        componentDidUpdate: function componentDidUpdate() {
          // console.log('did update');
          // adding gallery
          if (this.state.posts.length) {
            this.state.posts.map(this.gallery);
            scrollspy.init();
          }
          nav.travelOnRdy();
        },
        gallery: function gallery(v, i) {
          var that = this;
          if (!v.gallery) {
            console.log(v);
            console.log(i);
            var gallery_path = wplocal.basePathURL + '/wp-json/wp/v2/media?parent=' + v.id;

            console.log(gallery_path);

            REST.get(gallery_path).success(function (data) {
              // console.log(data);
              that.state.posts[i].gallery = data;
            });
          }
        },
        componentWillReceiveProps: function componentWillReceiveProps() {
          console.log('componentWillReceiveProps');
        },
        handleClick: function handleClick(i, e) {
          /* Preventing preventDefault on new tab click
           */
          if (e.ctrlKey || e.shiftKey || e.metaKey || e.button && e.button == 1) {} else {
            var galleryJSON = this.state.posts[i].gallery;
            popup.populate(this.state.posts[i].gallery, 'image');

            e.preventDefault();
            e.stopPropagation();
          }
        },
        render: function render() {
          // console.log(this.state);

          var that = this;
          var slide = function slide(v, i) {
            var boundClick = that.handleClick.bind(that, i);
            return React.createElement(
              'div',
              { className: 'slide', key: 'project-' + i },
              React.createElement(
                'div',
                { className: 'wrapper' },
                React.createElement(
                  'h1',
                  null,
                  v.title.rendered
                ),
                React.createElement('div', { className: 'copy', dangerouslySetInnerHTML: rekt.component.danger(v.content.rendered) }),
                React.createElement(
                  'div',
                  { className: 'expand' },
                  React.createElement(
                    'a',
                    { href: v.link, onClick: boundClick },
                    React.createElement(
                      'svg',
                      { x: '0px', y: '0px', viewBox: '0 0 40 40' },
                      React.createElement('line', { stroke: '#484848', strokeWidth: '1.8', strokeLinecap: 'round', x1: '25.3', y1: '20', x2: '14.7', y2: '20' }),
                      React.createElement('line', { stroke: '#484848', strokeWidth: '1.8', strokeLinecap: 'round', x1: '20', y1: '14.7', x2: '20', y2: '25.3' }),
                      React.createElement('circle', { fill: 'none', stroke: '#484848', strokeWidth: '1.8', strokeLinecap: 'round', cx: '20', cy: '20', r: '12' })
                    ),
                    React.createElement(
                      'span',
                      { className: 'hero smler' },
                      'Learn more'
                    )
                  )
                )
              )
            );
          };

          if (this.state) {
            // console.log('render stuff');
            return React.createElement(
              'div',
              { className: 'slider noslide' },
              React.createElement(
                'div',
                { className: 'slides' },
                this.state.posts.map(slide)
              )
            );
          } else {
            // console.log('render null');
            return null;
          }
        }
      });
    },
    blog: function blog(url) {
      return React.createClass({
        getInitialState: function getInitialState() {
          return null;
        },
        handleResponsive: function handleResponsive() {
          // console.log(window.width);
        },
        componentWillMount: function componentWillMount() {
          // console.log('will mount');
          var that = this;
          REST.get(url).success(function (data) {
            that.setState({ posts: data, currentslide: 0 });
          });
        },
        componentDidUpdate: function componentDidUpdate() {
          // console.log('did update blog');
          // console.log(this.metas.counter);
          // console.log(this.state.currentslide);

        },
        remoteActivate: function remoteActivate() {
          this.setState({ remote: '' });
        },
        remoteDeactivate: function remoteDeactivate() {
          this.setState({ remote: null });
        },
        handleClick: function handleClick(i, e) {
          /* Preventing preventDefault on new tab click
           */
          if (e.ctrlKey || e.shiftKey || e.metaKey || e.button && e.button == 1) {} else {
            var that = this;
            // console.log(i);
            // console.log(e);
            popup.run(this, i);

            e.preventDefault();
            e.stopPropagation();
          }
        },
        handleHover: {
          enter: function enter(e) {
            ohSnap.go(e.currentTarget, 1);
          },
          leave: function leave(e) {
            ohSnap.go(e.currentTarget, 0);
          }
        },
        componentDidMount: function componentDidMount() {
          // console.log('did mount');
          nav.travelOnRdy();
          // this.handleResponsive();
        },
        nextSlide: function nextSlide() {
          // console.log('this.state.totalslide'+this.state.totalslide);
          // console.log('this.state.currentslide'+this.state.currentslide);
          var num = this.state.currentslide;
          num++;
          if (this.state.totalslide > num) {
            this.state.currentslide++;
          }
        },
        prevSlide: function prevSlide() {
          if (this.state.currentslide > 0) {
            this.state.currentslide--;
          }
        },
        metas: {
          counter: 0
        },
        render: function render() {
          var output = [],
              posts = [],
              uid_svg = 0,
              uid_svg_off = 1,
              that = this;

          this.metas.counter = 0;

          var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          var slide = function slide(v, i) {
            // console.log(v);
            // console.log(i);
            var one_base = i;
            one_base++;
            // console.log(one_base);
            var date = new Date(v.date),
                month = date.getMonth(),
                year = date.getFullYear();
            year -= 2000;

            var thumbnail = '';
            if (v.better_featured_image) {
              if (v.better_featured_image.media_details.sizes.thumbnail) {
                thumbnail = v.better_featured_image.media_details.sizes.thumbnail.source_url;
              }
            }

            var boundClick = that.handleClick.bind(that, i);
            var post = React.createElement(
              'div',
              { className: 'post', key: "blog" + i },
              React.createElement(
                'a',
                { href: v.link, onClick: boundClick },
                React.createElement(
                  'div',
                  { className: 'thumb', onMouseEnter: that.handleHover.enter, onMouseLeave: that.handleHover.leave },
                  React.createElement(
                    'svg',
                    { x: '0px', y: '0px', viewBox: '0 0 180 200' },
                    React.createElement(
                      'g',
                      { fillRule: 'evenodd', clipRule: 'evenodd' },
                      React.createElement(
                        'defs',
                        null,
                        React.createElement('polygon', { id: 'SVGID_14' + uid_svg + '_', points: '57,199,1,72,113,1,163,30,161,113' })
                      ),
                      React.createElement(
                        'clipPath',
                        { id: 'SVGID_14' + uid_svg_off + '_' },
                        React.createElement('use', { xlinkHref: '#SVGID_14' + uid_svg + '_', overflow: 'visible' }),
                        '}'
                      ),
                      React.createElement(
                        'g',
                        { clipPath: 'url(#SVGID_14' + uid_svg_off + '_)' },
                        React.createElement('image', { overflow: 'visible', width: '300', height: '300', xlinkHref: thumbnail, transform: 'matrix(0.6666666666666666,0,0,0.6666666666666666,-10,0)' })
                      )
                    )
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'excerpt' },
                  React.createElement(
                    'h2',
                    null,
                    monthNames[month],
                    ' ',
                    year,
                    React.createElement(
                      'span',
                      null,
                      v.title.rendered
                    )
                  )
                )
              )
            );
            posts.push(post);
            uid_svg += 2;
            uid_svg_off += 2;

            if (one_base % 3 == 0) {
              // console.log('divisible');
              output.push(React.createElement(
                'div',
                { className: 'slide', 'data-show': that.metas.counter == that.state.currentslide ? "" : null, key: "divider" + that.metas.counter },
                React.createElement(
                  'div',
                  { className: 'wrapper' },
                  posts
                )
              ));
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
            var print = React.createElement(
              'div',
              { className: 'slider' },
              React.createElement(
                'div',
                { className: 'slides', ref: 'blogDOM' },
                output
              ),
              React.createElement(
                'div',
                { className: 'wrapper controller', 'data-control': this.state.remote },
                React.createElement(
                  'div',
                  { className: 'expand', onClick: this.remoteActivate, onMouseLeave: this.remoteDeactivate },
                  React.createElement(
                    'a',
                    null,
                    React.createElement(
                      'svg',
                      { x: '0px', y: '0px', viewBox: '0 0 40 40' },
                      React.createElement('line', { stroke: '#484848', strokeWidth: '1.8', strokeLinecap: 'round', x1: '25.3', y1: '20', x2: '14.7', y2: '20' }),
                      React.createElement('line', { stroke: '#484848', strokeWidth: '1.8', strokeLinecap: 'round', x1: '20', y1: '14.7', x2: '20', y2: '25.3' }),
                      React.createElement('circle', { fill: 'none', stroke: '#484848', strokeWidth: '1.8', strokeLinecap: 'round', cx: '20', cy: '20', r: '12' })
                    ),
                    React.createElement(
                      'span',
                      { className: 'hero smler' },
                      'Navigate'
                    )
                  ),
                  React.createElement(
                    'div',
                    { className: 'extend' },
                    React.createElement(
                      'a',
                      { onClick: this.prevSlide },
                      React.createElement(
                        'svg',
                        { className: 'navigate prev', version: '1.1', x: '0px', y: '0px', viewBox: '0 0 40 40', xmlSpace: 'preserve' },
                        React.createElement('polyline', { className: 'round', points: '21.6,25.3 16.4,20 21.6,14.7' }),
                        React.createElement('circle', { className: 'round', cx: '20', cy: '20', r: '12' })
                      ),
                      React.createElement(
                        'span',
                        { className: 'hero smler' },
                        'Prev'
                      )
                    ),
                    React.createElement(
                      'a',
                      { onClick: this.nextSlide },
                      React.createElement(
                        'svg',
                        { version: '1.1', className: 'navigate next', x: '0px', y: '0px', viewBox: '0 0 40 40', xmlSpace: 'preserve' },
                        React.createElement('polyline', { className: 'round', points: '18.4,14.7 23.6,20 18.4,25.3' }),
                        React.createElement('circle', { className: 'round', cx: '20', cy: '20', r: '12' })
                      ),
                      React.createElement(
                        'span',
                        { className: 'hero smler' },
                        'Next'
                      )
                    )
                  )
                )
              )
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

var popup = {
  popupdom: document.createElement('div'),
  init: function init(json_data) {
    // console.log('popup init');
    this.popupdom.id = "popup";
    // this.popupdom.innerHTML =  '<div class="content"></div>';
    // this.popupdom.innerHTML += '<div class="controller"></div>';

    document.body.appendChild(this.popupdom);
    $popup = document.getElementById('popup');
  },
  run: function run(rektComp, index) {
    // console.log(index);
    // console.log(rektComp);
    var that = this;
    // console.log(this);
    // console.log(rektComp.state.posts[index].categories);

    var data = rektComp.state.posts[index],
        catName = wp_REST.category.checker(data.categories);

    // alias
    var postType = void 0;
    switch (catName) {
      case 'photoblog':
        postType = 'image';
        break;
      case 'gallery':
        postType = 'image';
        break;
      case 'article':
        postType = catName;
        break;
      case 'video':
        postType = catName;
    }
    // console.log(postType);

    that.populate();

    // Switching between postType
    if (postType == 'image') {
      // gallery

      var gallery_path = wplocal.basePathURL + '/wp-json/wp/v2/media?parent=' + rektComp.state.posts[index].id;

      REST.get(gallery_path).success(function (data) {
        // console.log(data);
        rektComp.state.posts[index].gallery = data;
        // console.log(rektComp.state.posts[index].gallery);
        that.populate(data, 'image');
      });
    } else if (postType == 'video') {
      // video
    } else {
        // article 
        // that.populate(data, 'article');
      }
  },
  article: function article(content, that) {
    // console.log(json_data);
    // console.log(that);

    return React.createClass({
      render: function render() {
        return React.createElement(
          'div',
          null,
          'hello article'
        );
      }
    });
    that.show();
  },
  gallery: function gallery(json_data, that) {
    // console.log(json_data);
    return React.createClass({
      getInitialState: function getInitialState() {
        return null;
      },
      handleResponsive: function handleResponsive() {
        // console.log('responsiveness');
      },
      handleResize: function handleResize(e) {
        // console.log('resize');
        // var responsiveness = this.handleResponsive,
        //     delayedResponsive; 

        // window.addEventListener('resize', function(){
        //   clearTimeout(delayedResponsive); 
        //   delayedResponsive = setTimeout(responsiveness, 200); 
        //   console.log(window.innerWidth);
        // });
      },
      componentDidMount: function componentDidMount() {
        // console.log('gallery did mount');
        // this.handleResponsive();
        // this.handleResize();
      },
      componentWillMount: function componentWillMount() {
        // console.log('will mount');
        // console.log(this);
      },
      slide: function slide(v, i) {
        // console.log(v);
        // console.log(i);
        if (v.media_details) {
          var portrait = v.media_details.height > v.media_details.width,
              slidenum = that.state.currentslide;

          return React.createElement(
            'li',
            { 'data-show': i == slidenum ? '' : null, 'data-transitioning': i == that.state.previouslide ? "" : null, className: portrait ? 'portrait' : null, key: 'popup' + i },
            React.createElement('img', { src: v.source_url, width: v.media_details.width, height: v.media_details.height })
          );
        }
      },
      render: function render() {
        return React.createElement(
          'ul',
          null,
          json_data.map(this.slide)
        );
      }
    });
  },
  depopulate: function depopulate(selector) {
    ReactDOM.unmountComponentAtNode($popup);
    nav.fluid();
  },
  spinner: React.createClass({
    displayName: 'spinner',

    render: function render() {
      return React.createElement(
        'div',
        { className: 'spinner' },
        React.createElement(
          'svg',
          { x: '0px', y: '0px', viewBox: '0 0 50 50', enableBackground: 'new 0 0 50 50' },
          React.createElement(
            'defs',
            null,
            React.createElement('polygon', { id: 'spinner1', points: '11.8,2.8 16,30.5 31.7,45.3 41,35.8 43,23.3' })
          ),
          React.createElement(
            'clipPath',
            { id: 'spinner2' },
            React.createElement('use', { xlinkHref: '#spinner1', overflow: 'visible' })
          ),
          React.createElement(
            'g',
            { transform: 'matrix(1 0 0 1 0 0)', clipPath: 'url(#spinner2)' },
            React.createElement('image', { overflow: 'visible', width: '2179', height: '2967', xlinkHref: wplocal.templateURL + '/assets/images/wood.jpg' })
          )
        ),
        React.createElement(
          'span',
          null,
          'loading post'
        )
      );
    }
  }),
  populate: function populate(obj, type) {
    console.log(obj);
    type = type || 'fill this';
    var that = this,
        Spinner = this.spinner;

    var Component = React.createClass({
      displayName: 'Component',

      getInitialState: function getInitialState() {
        // console.log(obj.length);
        return {
          currentslide: 0,
          previouslide: 0,
          fetching: null,
          totalslide: obj.length,
          datatype: type
        };
      },
      componentDidMount: function componentDidMount() {
        // console.log('populate did mount');
        nav.static();
      },
      render: function render() {
        // console.log(this);
        // if(React.isValidElement(obj)){
        var GalleryComponent = that.gallery(obj, this),
            Article = that.article('hello article', this),
            Ctrldom = that.controller.dom(this);
        // console.log(Ctrldom);

        var popup = React.createElement(
          'div',
          { className: 'slider', 'data-fetching': this.state.fetching },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(Article, null),
            React.createElement(GalleryComponent, null)
          ),
          React.createElement(Ctrldom, null),
          React.createElement(Spinner, null)
        );

        return popup;
      }
    });

    ReactDOM.render(React.createElement(Component, null), $popup);
    this.show();
  },
  show: function show() {
    $popup.dataset.active = true;
  },
  close: function close() {
    this.depopulate();
    $popup.dataset.active = false;
  },
  controller: {
    dom: function dom(that) {
      return React.createClass({
        handleClick: function handleClick(e) {
          var run = e.currentTarget.dataset.control;
          this.navigate[run]();
        },
        navigate: {
          prev: function prev() {
            // console.log(that);
            var i = that.state.currentslide;
            if (i > 0) {
              i--;
              that.setState({ currentslide: i, previouslide: that.state.currentslide });
            }
          },
          next: function next() {
            var i = that.state.currentslide,
                total = that.state.totalslide;
            total--;
            // console.log(this);
            // console.log(ReactDOM.findDOMNode(that));
            // var dom = ReactDOM.findDOMNode($popup),
            //     $slides = $(dom).find('.content li');
            if (i < total) {
              i++;
              that.setState({ currentslide: i, previouslide: that.state.currentslide });
            }
          },
          close: function close() {
            popup.close();
          }
        },
        render: function render() {
          var currentslide = that.state.currentslide;
          currentslide++;
          return React.createElement(
            'div',
            { className: 'controller', 'data-single': that.state.totalslide == 1 ? '' : null },
            React.createElement(
              'span',
              { 'data-control': 'close', onClick: this.handleClick },
              'close'
            ),
            React.createElement(
              'i',
              null,
              currentslide
            ),
            React.createElement(
              'divider',
              null,
              ' / '
            ),
            React.createElement(
              'c',
              null,
              that.state.totalslide
            ),
            React.createElement(
              't',
              null,
              that.state.datatype
            ),
            React.createElement(
              'span',
              { 'data-control': 'prev', onClick: this.handleClick },
              'prev'
            ),
            React.createElement(
              'span',
              { 'data-control': 'next', onClick: this.handleClick },
              'next'
            )
          );
        }
      });
    }
  }
};

var contact = {
  init: function init() {
    var that = this;
    var contact = document.getElementById('contact');

    var Thanks = React.createClass({
      displayName: 'Thanks',

      getInitialState: function getInitialState() {
        return { sent: "" };
      },
      render: function render() {
        return React.createElement(
          'div',
          { className: 'thanks' },
          React.createElement(
            'h2',
            null,
            'I receive your message'
          ),
          React.createElement(
            'p',
            null,
            'Will get back to you shortly.'
          )
        );
      }
    });

    var Online = React.createClass({
      displayName: 'Online',

      render: function render() {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            null,
            'Online'
          ),
          React.createElement(
            'span',
            null,
            React.createElement(
              'a',
              { href: 'https://www.facebook.com/pages/matheusli/177957308894747', target: '_blank' },
              'facebook'
            )
          ),
          React.createElement(
            'span',
            null,
            React.createElement(
              'a',
              { href: 'https://instagram.com/mathiouchio/', target: '_blank' },
              'instagram'
            )
          ),
          React.createElement(
            'span',
            null,
            React.createElement(
              'a',
              { href: 'https://dribbble.com/mathiouchio', target: '_blank' },
              'dribbble'
            )
          )
        );
      }
    });

    var Submission = React.createClass({
      displayName: 'Submission',

      render: function render() {
        return React.createElement(
          'div',
          { className: 'expand', onClick: this.props.onSubmission },
          React.createElement(
            'a',
            { id: 'formsubmit' },
            React.createElement(
              'svg',
              { x: '0px', y: '0px', viewBox: '0 0 40 40' },
              React.createElement('line', { stroke: '#484848', strokeWidth: '1.8', strokeLinecap: 'round', x1: '25.3', y1: '20', x2: '14.7', y2: '20' }),
              React.createElement('line', { stroke: '#484848', strokeWidth: '1.8', strokeLinecap: 'round', x1: '20', y1: '14.7', x2: '20', y2: '25.3' }),
              React.createElement('circle', { fill: 'none', stroke: '#484848', strokeWidth: '1.8', strokeLinecap: 'round', cx: '20', cy: '20', r: '12' })
            ),
            React.createElement(
              'span',
              { className: 'hero smler' },
              'Send'
            )
          )
        );
      }
    });

    var Forms = React.createClass({
      displayName: 'Forms',

      handleChange: function handleChange() {
        this.props.onUserInput(this.refs.emailInput.value, this.refs.messageInput.value);
      },
      checker: [false, false],
      validate: function validate(e) {
        var obj = e.currentTarget,
            email_reg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (obj.type == "email" && email_reg.test($.trim(obj.value))) {
          this.checker[0] = true;
          delete obj.dataset.invalid;
        } else if (obj.type == "textarea" && $.trim(obj.value)) {
          this.checker[1] = true;
          delete obj.dataset.invalid;
        } else {
          obj.dataset.invalid = "";
        }

        // console.log(this.checker);

        this.props.onValidate(this.checker[0], this.checker[1]);
      },
      render: function render() {
        return React.createElement(
          'div',
          { className: 'copy' },
          React.createElement(
            'form',
            { id: 'contactform', action: 'http://matheus.li/blog/wp-content/themes/matheus/contact.php', method: 'post' },
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                null,
                'email'
              ),
              React.createElement('input', { type: 'email', name: 'email', required: true, ref: 'emailInput', onBlur: this.validate, value: this.props.email, placeholder: 'type your email', onChange: this.handleChange })
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                null,
                'message'
              ),
              React.createElement('textarea', { type: 'text', name: 'message', onBlur: this.validate, required: true, ref: 'messageInput', value: this.props.message, placeholder: 'type message ...', onChange: this.handleChange })
            )
          )
        );
      }
    });

    var Email = React.createClass({
      displayName: 'Email',

      getInitialState: function getInitialState() {
        return {
          sent: null,
          message: '',
          email: '',
          validate: false,
          response: null
        };
      },
      handleValidate: function handleValidate(validateEmail, validateMessage) {
        // console.log(validateEmail, validateMessage); 
        if (validateEmail && validateMessage) {
          this.setState({ validate: true });
        }
      },
      handleUserInput: function handleUserInput(email, message) {
        this.setState({
          email: email,
          message: message
        });
      },
      handleSubmission: function handleSubmission(e) {
        var that = this;
        // console.log('click');
        if (this.state.validate == true) {
          // var dataString = $(dom).find('form').serialize();
          // var dom = ReactDOM.findDOMNode(this),
          var encodedEmail = jQuery.trim(encodeURIComponent(this.state.email)),
              dataString = 'email=' + encodedEmail + '&message=' + this.state.message;

          // console.log(dataString);
          // console.log($(dom));
          // console.log('validet');

          jQuery.ajax({
            type: "POST",
            dataType: "text",
            url: "/matheus.li/wp-content/themes/matheus/contact.php",
            data: dataString
          }).success(function (data) {
            // console.log('success!');
            // console.log(data);
            that.setState({ sent: "" });
          }).error(function (data) {
            // console.log('error!');
            // console.log(data.status);
            that.setState({ response: data.status });
          });
        }
        return false;
      },
      render: function render() {
        return React.createElement(
          'div',
          { className: 'wrapper', 'data-sent': this.state.sent },
          React.createElement(Online, null),
          React.createElement(Forms, { email: this.state.email, message: this.state.message, onValidate: this.handleValidate, onUserInput: this.handleUserInput }),
          React.createElement(Thanks, { response: this.state.response }),
          React.createElement(Submission, { onSubmission: this.handleSubmission })
        );
      }
    });
    ReactDOM.render(React.createElement(Email, null), contact);
  }
};

(function () {
  wp_REST.init();
  popup.init();
  rekt.render('projects', wplocal.basePathURL + '/wp-json/wp/v2/portfolio');
  rekt.render('blog', wplocal.basePathURL + '/wp-json/wp/v2/posts?per_page=100');
  contact.init();
})();