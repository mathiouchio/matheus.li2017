const app = {
  init: function() {
    this.scrollspy.init();
    this.route.init();
    this.popup.init();
    this.contact.init();
    this.nav.init();
    this.requests = {
      Portfolio: wplocal.basePathURL + "/wp-json/wp/v2/portfolio",
      Blogs: wplocal.basePathURL + "/wp-json/wp/v2/posts?per_page=100"
    };
    for (const key in this.requests) {
      if (this.requests.hasOwnProperty(key)) {
        const tempKey = key;
        app.fetch(this.requests[key]).then(data => {
          const Component = this.component[tempKey];
          ReactDOM.render(
            <Component data={data} />,
            document.getElementById(tempKey.toLowerCase())
          );
        });
      }
    }
  },
  nav: {
    init: function() {
      this.anchor.init();
      this.travelOnRdy();
    },
    travelOnRdy: function() {
      const cleanBaseURL = window.location.href.replace(
        wplocal.basePathURL,
        ""
      );

      const paths = cleanBaseURL.slice(1).split("/");

      const thePants = paths.length > 2 ? paths[0] : "blogs";

      if (paths[0] && paths[0] !== "")
        app.nav.anchor.travelingpants("#" + thePants);
    },
    anchor: {
      init: function() {
        const $a = document.getElementsByTagName("a");
        this.loop($a);
      },
      loop: function(arr) {
        for (let n = arr.length - 1; n >= 0; n--) {
          if (arr[n].hash !== "") app.nav.anchor.bind(arr[n]);
        }
      },
      travelingpants: function(target) {
        target = document.getElementById(target.substring(1));
        window.scrollTo(0, target.offsetTop);
      },
      bind: function(el) {
        el.onclick = function(e) {
          app.nav.anchor.travelingpants(this.hash);
          app.popup.destroy();
          e.stopPropagation();
          e.preventDefault();
        };
      }
    }
  },
  ohSnap: {
    loop: {
      interval: [],
      counter: 0,
      run: function(identifier) {
        const id = identifier.substring(1);
        this.interval = window.setInterval(() => {
          // back to 0 on last loop
          this.loop.counter =
            this.loop.counter >= Object.keys(this.vectorPoints[id]).length
              ? 0
              : this.loop.counter;
          // animate
          this.go(identifier, this.loop.counter);
          // counter++
          this.loop.counter++;
          // speed
        }, this.settings.speed[id]);
      },
      destroy: function() {
        clearInterval(this.interval);
      }
    },
    go: function(identifier, target) {
      let id;
      if (typeof identifier === "string") {
        id = identifier.substring(1);
      } else {
        id = identifier.className || identifier.id;
      }

      // count objects length
      // check if has multiple polygons
      const points = jQuery(identifier).find("polygon");
      const speed = this.settings.speed[id];
      const easing = this.settings.easing[id];
      let point;
      let vp;
      let $el = null;

      if (points.length > 1) {
        // preparing loops
        for (let i = 0; i < points.length; i++) {
          point = jQuery(identifier)
            .find("polygon")
            .get(i);
          vp = this.vectorPoints[id][target][i];

          $el = new Snap(point);
          $el.stop().animate({ points: vp }, speed, easing);
        }
      } else {
        point = jQuery(identifier)
          .find("polygon")
          .get(0);
        vp = this.vectorPoints[id][target];

        $el = new Snap(point);
        $el.stop().animate({ points: vp }, speed, easing);
      }
    },
    settings: {
      speed: {
        branding: 800,
        logo: 10000,
        spinner: 800,
        thumb: 200
      },
      easing: {
        branding: mina.easout,
        logo: mina.easout,
        spinner: mina.easein,
        thumb: mina.easeout
      }
    },
    vectorPoints: {
      branding: [
        // splash
        [
          "0,0 189.3,0 39.4,69.4 0,152.5 60.6,360.5 119.3,649.8 133.2,725.4 71.8,899.8 0,899.8",
          "167.4,629.6 128.9,459.2 52.9,130 180.9,59.2 348.8,0 189.3,0 39.4,69.4 0,152.5 60.6,360.5 119.3,649.8 133.2,725.4 71.8,899.8 97.6,899.8 149.9,815.2",
          "516.1,0 189.3,122.7 100.9,165.4 140.9,389.8 167.4,629.6 149.9,815.2 97.6,899.8 97.6,899.8 149.9,815.2 167.4,629.6 128.9,459.2 52.9,130 180.9,59.2 348.8,0"
        ],
        // about
        [
          "0,0 124.3,0 86.2,114.9 21.3,203.7 36.5,480.1 65.6,538.7 89.7,660.2 11.7,899.8 0,899.8",
          "106,555.2 100.7,547.3 50.8,228.2 118.8,134 140.9,0 113,0 75,114.9 10.1,203.7 25.2,480.1 54.3,538.7 78.5,660.2 0.5,899.8 25.3,899.8 133.6,644",
          "140.9,0 125.2,95.2 122.7,160 84.6,255.8 148.9,518.7 185.1,570.6 40,899.8 25.3,899.8 133.6,644 106,555.2 100.7,547.3 50.9,228.2 118.8,134 140.9,0"
        ],
        // projects
        [
          "0,0 63.4,0 36.6,87.3 0,131.8 52.9,394.9 134.3,639.1 156.1,789.1 176,899.8 0,899.8",
          "163.4,513.4 90.1,382.6 52.9,130 71.1,71.8 89.7,0 63.4,0 36.6,87.3 0,131.8 52.9,394.9 134.3,639.1 156.1,789.1 176,899.8 201.8,899.8 183.4,744.2",
          "112.8,0 104.9,53.4 88,153.4 140.9,389.8 215.7,482.6 215.7,625.7 201.8,899.8 201.8,899.8 183.4,744.2 163.4,513.4 90.1,382.6 52.9,130 71.1,71.8 89.7,0"
        ],
        // blog
        [
          "0,0 0,0 62.1,217.6 62.1,307.6 12.3,545.7 58,678.2 66.4,817 212.7,899.8 0,899.8",
          "110.7,755.6 73.3,559.3 103.2,324.3 92.5,153 12.3,0 0,0 62.1,217.6 62.1,307.6 12.3,545.7 58,678.2 66.4,817 212.7,899.8 242.5,899.8 112.6,780.2",
          "12.3,0 127.4,188.1 160.7,319 126.8,540.6 130,765.6 170.1,829.6 242.5,899.8 242.5,900 112.6,780.2 110.7,755.6 73.3,559.3 103.2,324.3 92.5,153 12.3,0"
        ],
        // contact
        [
          "0,0 54.9,0 16.5,226.2 53.2,293.8 123.5,464.1 153.5,549 142.7,674.6 60.8,899.8 0,899.8",
          "186.7,496.4 176,469 103,269.3 44.5,196 65.4,0 54.9,0 16.5,226.2 53.2,293.8 123.5,464.1 153.5,549 142.7,674.6 60.8,899.8 67.6,899.8 164.4,701",
          "79.6,0 75.8,148.7 201.7,373.9 240,478.6 185.9,702.5 124.7,798.4 67.6,899.8 67.6,899.8 164.4,701 186.7,496.4 176,469 103,269.3 44.5,196 65.4,0"
        ],
        [
          "0,0 202,0 116.1,111.8 26.1,129.1 32.9,480.4 75.6,566.1 18.6,723.6 254.2,899.8 0,899.8",
          "85,617 93.1,547.6 58.6,133.6 136,134 219.3,0 202,0 116.1,111.8 26.1,129.1 32.9,480.4 75.6,566.1 18.6,723.6 254.2,899.8 270.6,899.8 72.8,705.8",
          "219.3,0 151.3,166.1 104.5,170.3 104.5,548.1 126,711.6 194.1,805.4 309.6,899.8 270.6,899.8 72.8,705.8 85,617 93.1,547.6 58.7,133.6 136,134 219.3,0"
        ]
      ],
      logo: [
        [
          "115.75,122.5 167.5,132 180,127.7 79.3,69 27.8,70.3 27.8,51.7 0,69.9 12.9,100.6 101.5,96",
          "170.7,32 81.5,0 73.2,24.4 27.8,51.7 27.8,70.3 79.3,69 180,127.7",
          "167.5,132 115.75,122.5 101.5,96 12.9,100.6 54.5,200"
        ],
        [
          "117,122 167.5,132 180,127.7 103.9,76.5 46.4,81.7 27.8,51.7 0,69.9 12.9,100.6 64.5,125.2",
          "170.7,32 81.5,0 73.2,24.4 27.8,51.7 46.4,81.7 103.9,76.5 180,127.7",
          "167.5,132 117,122 64.5,125.2 12.9,100.6 54.5,200"
        ],
        [
          "122.26,71.85 167.5,132 180,127.7 163,77 82.85,48.25 27.8,51.7 0,69.9 12.9,100.6 67,74",
          "170.7,32 81.5,0 73.2,24.4 27.8,51.7 82.85,48.25 163,77 180,127.7",
          "167.5,132 122.26,71.85 67,74 12.9,100.6 54.5,200"
        ]
      ],
      spinner: [
        "7.4,44 40.8,48.2 42.3,21.9 34.6,2.8 23.2,36.5",
        "17.9,43.8 24.8,30.2 42.3,21.9 34.6,2.8 7.2,18.5",
        "26.3,45.3 45,13.5 29.2,15.1 23,1.2 9.4,19.9"
      ],
      thumb: [
        "57,199 1,72 113,1 163,30 161,113",
        "105.8,188.8 32.3,147.5 51.4,13 90,3.9 171.1,92.8 105.8,188.8"
      ]
    }
  },
  scrollspy: {
    state: {
      triggerPos: 0,
      sectionPositions: []
    },
    init: function() {
      // Poor man React.js
      this.state.sections = !this.state.sections
        ? document.body.getElementsByTagName("SECTION")
        : this.state.sections;
      this.state.nav = !this.state.navigations
        ? document.body.getElementsByTagName("NAV")
        : this.state.nav;
      this.state.navigations = !this.state.navigations
        ? this.state.nav[0].getElementsByTagName("LI")
        : this.state.navigations;

      this.calcPositions();
      this.bind();
    },
    calcPositions: function() {
      let i = 0;
      for (const el of this.state.sections) {
        this.state.sectionPositions[i] = el.offsetTop;
        i++;
      }
    },
    bind: function() {
      window.addEventListener("scroll", () => {
        let tempPos = 0;
        for (let i in this.state.sectionPositions) {
          if (window.pageYOffset >= this.state.sectionPositions[i]) {
            tempPos = i;
          }
        }

        /* Only apply rules and styles in between sections:
         * value of positions changed
         */
        if (tempPos != this.state.triggerPos) {
          this.state.triggerPos = tempPos;
          this.nav(this.state.triggerPos);
          this.brand(this.state.triggerPos);
        }
      });
    },
    nav: function(pos) {
      pos--;
      for (const el of this.state.navigations) {
        el.classList.remove("active");
      }
      if (pos >= 0)
        // only do it if needed
        this.state.navigations[pos].className = "active";
    },
    brand: function(i) {
      app.ohSnap.go("#branding", i);
    }
  },
  contact: {
    component: {
      thanks: class Thanks extends React.PureComponent {
        constructor(props) {
          super(props);
        }
        render() {
          return (
            <div className="thanks">
              <h2>I receive your message</h2>
              <p>Will get back to you shortly.</p>
            </div>
          );
        }
      },
      response: class Response extends React.PureComponent {
        constructor(props) {
          super(props);
          this.messages = {
            200: "Will get back to you shortly.",
            400: "There was a problem with your submission, please try again.",
            500: "Something went wrong and we couldn't send your message.",
            403: "There was a problem with your submission. Please complete the form and try again."
          };
          this.headers = {
            200: "I receive your message",
            error: "Error"
          };
        }
        render() {
          return (
            <div
              className="thanks error"
              data-show={this.props.response ? "" : null}
            >
              <h2>
                {this.props.response == 200
                  ? this.headers[200]
                  : this.headers["error"]}
              </h2>
              <p>{this.messages[this.props.response]}</p>
            </div>
          );
        }
        static propTypes = {
          response: PropTypes.number
        };
        static defaultProps = {
          response: null
        };
      },
      online: class Online extends React.PureComponent {
        render() {
          return (
            <div>
              <label>Social</label>
              <span>
                <a
                  href="https://www.facebook.com/pages/matheusli/177957308894747"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  facebook
                </a>
              </span>
              <span>
                <a
                  href="https://instagram.com/mathiouchio/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  instagram
                </a>
              </span>
              <span>
                <a
                  href="https://dribbble.com/mathiouchio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dribbble
                </a>
              </span>
            </div>
          );
        }
      },
      submit: class Submission extends React.PureComponent {
        render() {
          return (
            <div
              className="expand"
              onClick={this.props.onSubmission}
              data-hidden={this.props.response ? "" : null}
            >
              <a id="formsubmit">
                <svg x="0px" y="0px" viewBox="0 0 40 40">
                  <line x1="25.3" y1="20" x2="14.7" y2="20" />
                  <line x1="20" y1="14.7" x2="20" y2="25.3" />
                  <circle fill="none" cx="20" cy="20" r="12" />
                </svg>
                <span className="hero smler">Send</span>
              </a>
            </div>
          );
        }
        static propTypes = {
          onSubmission: PropTypes.func.isRequired,
          response: PropTypes.number
        };
        static defaultProps = {
          response: null
        };
      },
      forms: class Forms extends React.Component {
        constructor(props) {
          super(props);
        }
        validate(e) {
          const emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

          if (
            e.currentTarget.name == "email" &&
            emailReg.test($.trim(e.currentTarget.value))
          ) {
            delete e.currentTarget.dataset.invalid;
            this.props.onValidated(e.currentTarget.name, true);
          } else if (
            e.currentTarget.name == "message" &&
            $.trim(e.currentTarget.value)
          ) {
            delete e.currentTarget.dataset.invalid;
            this.props.onValidated(e.currentTarget.name, true);
          } else {
            e.currentTarget.dataset.invalid = "";
            this.props.onValidated(e.currentTarget.name, false);
          }
        }
        render() {
          return (
            <div className="copy" data-hidden={this.props.response ? "" : null}>
              <form
                id="contactform"
                action={wplocal.templateURL + "/contact.php"}
                method="post"
              >
                <div>
                  <label>email</label>
                  <input
                    type="email"
                    name="email"
                    onBlur={this.validate.bind(this)}
                    value={this.props.email}
                    placeholder="type your email"
                    onChange={this.props.onUserInput.bind(this)}
                    required
                  />
                </div>
                <div>
                  <label>message</label>
                  <textarea
                    type="text"
                    name="message"
                    onBlur={this.validate.bind(this)}
                    value={this.props.message}
                    placeholder="type message ..."
                    onChange={this.props.onUserInput.bind(this)}
                    required
                  />
                </div>
              </form>
            </div>
          );
        }
        static propTypes = {
          onValidated: PropTypes.func.isRequired,
          onUserInput: PropTypes.func.isRequired,
          response: PropTypes.number,
          email: PropTypes.string,
          message: PropTypes.string
        };
        static defaultProps = {
          email: "",
          message: "",
          response: null
        };
      }
    },
    init: function() {
      const Email = class Email extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            message: "",
            email: "",
            validated: {
              email: false,
              message: false
            },
            response: null
          };
        }
        post(jsonData) {
          return fetch(wplocal.templateURL + "/contact.php", {
            body: JSON.stringify(jsonData),
            headers: {
              "Access-Control-Allow-Origin": "*",
              "content-type": "text/plain"
            },
            method: "POST",
            mode: "no-cors"
          }).then(response => response.text());
        }
        handleUserInput(e) {
          this.setState({
            [e.target.name]: e.target.value
          });
        }
        handleSubmission(e) {
          for (const val in this.state.validated) {
            if (!this.state.validated[val]) return false;
          }
          const jsonData = {
            email: this.state.email.trim(),
            message: this.state.message
          };
          this.post(jsonData).then(data => {
            const responseCode = data.substring(0, 3);
            this.setState({ response: responseCode });
          });

          return false;
        }
        handleValidation(stateName, checkValue) {
          let newState = this.state.validated;
          newState[stateName] = checkValue;

          this.setState({
            validated: newState
          });
        }
        render() {
          const contactComponent = app.contact.component;

          return (
            <div className="wrapper" data-sent={this.state.sent}>
              <contactComponent.online />
              <contactComponent.forms
                email={this.state.email}
                message={this.state.message}
                onUserInput={this.handleUserInput.bind(this)}
                onValidated={this.handleValidation.bind(this)}
                response={this.state.response}
              />
              <contactComponent.submit
                onSubmission={this.handleSubmission.bind(this)}
                response={this.state.response}
              />
              <contactComponent.response response={this.state.response} />
            </div>
          );
        }
      };
      ReactDOM.render(<Email />, document.getElementById("contact"));
    }
  },
  route: {
    init: function() {
      this.bind();
      this.detect();
    },
    go: function(url = "") {
      const path = url ? `${url}/` : "";

      const state = { state: path };
      history.pushState(state, null, `${wplocal.basePathURL}/${path}`);
    },
    detect: function() {
      let path = window.location.pathname; // get paths
      path = path
        .substring(1, path.length - 1) // kill first and last char
        .split("/"); // make an array
      if (path.length < 2) path = [...["posts"], ...path]; // add posts for first path
      path = path.filter(e => {
        // kill empty string
        return String(e).trim();
      });

      if (path.length) {
        app
          .fetch(
            `${wplocal.basePathURL}/wp-json/wp/v2/${path[0]}?slug=${path[1]}`
          )
          .then(data => {
            app.summon.init(data[0]);
          });
      }
    },
    bind: function() {
      window.onpopstate = e => {
        if (document.location.href == wplocal.basePathURL + "/") {
          app.popup.destroy();
        } else {
          this.detect();
        }
      };
    }
  },
  plyr: {
    state: {}, // poor man React.js 🤘🏻
    setup: function(position) {
      if (!this.state.once) {
        this.state.obj = plyr.setup();
        this.state.once = true;
      }
      this.state.position = position;
    },
    init: function(target = 0, reset = false) {
      if (reset) this.state.once = false;
      this.setup(target);
      this.responsive(target);
      this.eventcheck("ready").then(e => {
        if (!this.state.obj[target].isMuted()) {
          this.state.obj[target].toggleMute();
        }
        // @🐛: ready doesn't always trigger
        this.state.obj[target].play();
      });
      this.state.obj[target].play(); // @🐛: double tap
    },
    videoEl: function() {
      return this.state.obj[this.state.position].getEmbed()
        ? this.state.obj[this.state.position].getEmbed().a
        : this.state.obj[this.state.position].getMedia();
    },
    destroy: function() {
      this.state.obj.map(target => {
        target.destroy();
      });
    },
    fullscreen: function() {
      this.state.obj[this.state.position].toggleFullscreen();
    },
    pause: function(target = this.state.position) {
      this.state.obj[target].pause();
    },
    unmute: function() {
      this.state.obj[this.state.position].toggleMute();
    },
    eventcheck: function(type) {
      const target = this.videoEl();

      return new Promise((resolve, reject) => {
        /**
         * @eventhandler Metadata loaded.
         * @param {event} e - resolve and pass down event
         */
        function handleEvents(e) {
          target.removeEventListener(type, handleEvents);
          resolve(e);
        }
        target.addEventListener(type, handleEvents);
      });
    },
    mathematics: function(target) {
      if (target.tagName != "IFRAME" && target.tagName != "VIDEO")
        target = target.childNodes[0];

      const vHeight = target.height ? target.height : target.videoHeight;
      const vWidth = target.width ? target.width : target.videoWidth;
      const vRatio = vWidth / vHeight;
      const realHeight = window.innerHeight;
      const realWidth = realHeight * vRatio;

      target.width = realWidth;
      target.style.width = realWidth + "px";
    },
    responsive: function(target) {
      const targetVid = this.state.obj[target].getEmbed()
        ? this.state.obj[target].getEmbed().a
        : this.state.obj[target].getMedia();

      if (targetVid.tagName == "VIDEO") {
        // waiting for all the metadatas load to determine height x width
        this.eventcheck("loadedmetadata").then(e => {
          this.mathematics(targetVid);
          this.videoEl().style.display = "block";
        });
      } else {
        this.mathematics(targetVid);
      }
    }
  },
  popup: {
    el: null,
    init: function() {
      this.el = document.createElement("div");
      this.el.id = "popup";
      document.body.appendChild(this.el);
    },
    destroy: function() {
      if (this.el.hasChildNodes()) {
        ReactDOM.unmountComponentAtNode(document.getElementById("popup"));
        delete document.body.dataset.static;
        app.route.go();
      }
    }
  },
  fetch: url => {
    return fetch(url).then(response => response.json());
  },
  summon: {
    fetch: {
      gallery: (target, cb) => {
        app
          .fetch(
            wplocal.basePathURL + "/wp-json/wp/v2/media?parent=" + target.id
          )
          .then(data => {
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
    init: function(data) {
      this.fetch[data.format](data, this.render);
    },
    render: data => {
      const Popup = app.component.Popup;
      ReactDOM.render(<Popup data={data} />, document.getElementById("popup"));
    }
  },
  component: {
    Popup: class Popup extends React.Component {
      constructor(props) {
        super(props);
        const slideAttr =
          props.data[0] && props.data[0].media_details
            ? props.data[0].media_details
            : null;

        const initFormat = slideAttr
          ? slideAttr.height > slideAttr.width
          : null;
        let totalslide = 1;

        totalslide = props.data.length ? props.data.length : totalslide;
        totalslide =
          props.data.format == "video"
            ? props.data.fields.videos.length
            : totalslide;

        this.state = {
          portrait: initFormat ? !initFormat : true,
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
            let offsetTotal = this.state.totalslide;
            nextSlide++;
            offsetTotal--;

            if (this.state.currentslide < offsetTotal) {
              this.setState({
                previouslide: this.state.currentslide,
                currentslide: nextSlide
              });
            }
          },
          prev: () => {
            let nextSlide = this.state.currentslide;
            nextSlide--;
            if (this.state.currentslide > 0) {
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
        };

        this.markups = {
          gallery: () => {
            let Slides = [];
            this.props.data.map((attr, index) => {
              let slideClassName = "gallery";
              slideClassName +=
                attr.media_details.height > attr.media_details.width
                  ? " portrait"
                  : "";
              const srcsetSizes = this.imgAttr(attr.media_details);
              const imgSizes = srcsetSizes.sizes.join(", ");
              const imgSrcset = srcsetSizes.srcset.join(", ");

              Slides.push(
                <li
                  className={slideClassName}
                  key={attr.id}
                  ref={attr.id}
                  data-show={index == this.state.currentslide ? "" : null}
                  data-transitioning={
                    index == this.state.previouslide ? "" : null
                  }
                  data-loaded={this.state.loaded[index] ? "" : null}
                >
                  <img
                    src={attr.source_url}
                    width={attr.media_details.width}
                    height={attr.media_details.height}
                    srcSet={imgSrcset}
                    sizes={imgSizes}
                    onLoad={this.loadedState.bind(this, index)}
                  />
                </li>
              );
            });

            return Slides;
          },
          video: () => {
            let Videos = [];
            this.props.data.fields.videos.map((video, index) => {
              const youmeo = video.youtube_id ? "youtube" : "vimeo";

              const vid = youmeo ? video.youtube_id : video.vimeo_id;

              const videoEl = video.video_url ? (
                <video controls>
                  <source src={video.video_url} type="video/mp4" />
                </video>
              ) : (
                <div data-type={youmeo} data-video-id={vid} />
              );
              Videos.push(
                <li
                  data-show={index == this.state.currentslide ? "" : null}
                  data-transitioning={
                    index == this.state.previouslide ? "" : null
                  }
                  key={vid || video.video_url}
                  ref={video.id}
                >
                  {videoEl}
                </li>
              );
            });

            return Videos;
          },
          standard: () => {
            return (
              <li className="article portrait" data-show>
                <div
                  className="wrapper"
                  dangerouslySetInnerHTML={this.danger(
                    this.props.data.content.rendered
                  )}
                />
              </li>
            );
          }
        };
      }
      loadedState(index) {
        let tempLoadedState = this.state.loaded;
        tempLoadedState[index] = true;
        this.setState({ loaded: tempLoadedState });
      }
      imgAttr(data) {
        const imagesets = {
          sizes: [
            "full",
            "gallery-medium-large",
            "gallery-medium",
            "gallery-small"
          ]
        };
        let output = {
          srcset: [],
          sizes: ["100vw"]
        };

        // let once = true;

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
         */

        // looking for imagesets.sizes matched key strings
        Object.entries(data.sizes).forEach(value => {
          const key = value[0];
          const imgData = value[1];

          imagesets.sizes.includes(key) &&
            output["srcset"].push(`${imgData.source_url} ${imgData.width}w`);
        });

        output.srcset.reverse();

        return output;
      }
      destroy() {
        ReactDOM.unmountComponentAtNode(document.getElementById("popup"));
        delete document.body.dataset.static;
      }
      danger(raw) {
        return { __html: raw };
      }
      bindEscKey() {
        document.onkeydown = (e = window.event) => {
          if (e.keyCode == 27) {
            this.destroy();
            app.route.go();
          }
        };
      }
      staticWindow() {
        document.body.dataset.static = "";
      }
      componentDidMount() {
        // prevent scroll
        this.staticWindow();
        // give data-active to popup container
        app.popup.el.dataset.active = "";
        // unbind key
        document.onkeydown = null;
        // kill popup with esc key
        this.bindEscKey();
        // bind plyr
        if (this.state.datatype == "video") app.plyr.init(0, true);
      }
      componentWillUnmount() {
        document.onkeydown = null;
        delete app.popup.el.dataset.active;
      }
      componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.datatype == "video")
          app.plyr.init(this.state.currentslide);
      }
      shouldComponentUpdate(nextProps, nextState, index) {
        const nextImgSlide = this.props.data.length
          ? this.props.data[nextState.currentslide]
          : null;

        const nextSlideDetail = nextImgSlide
          ? nextImgSlide.media_details
          : null;

        // get orientation
        nextState.portrait = nextSlideDetail
          ? !(nextSlideDetail.height > nextSlideDetail.width)
          : false;
        // pause current plyr slide
        if (this.state.datatype == "video")
          app.plyr.pause(this.state.currentslide);

        return true;
      }
      handleClick(e) {
        const action = e.target.dataset.control;
        if (action) this.actions[action]();
      }
      spinner() {
        return (
          <div id="spinner">
            <svg
              x="0px"
              y="0px"
              viewBox="0 0 50 50"
              enableBackground="new 0 0 50 50"
            >
              <defs>
                <polygon
                  id="spinner1"
                  points="11.8,2.8 16,30.5 31.7,45.3 41,35.8 43,23.3"
                />
              </defs>
              <clipPath id="spinner2">
                <use xlinkHref="#spinner1" overflow="visible" />
              </clipPath>
              <g transform="matrix(1 0 0 1 0 0)" clipPath="url(#spinner2)">
                <image
                  overflow="visible"
                  width="2179"
                  height="2967"
                  xlinkHref={wplocal.templateURL + "/assets/images/wood.jpg"}
                />
              </g>
            </svg>
            <span>loading post</span>
          </div>
        );
      }
      controller() {
        let offsetCurrent = this.state.currentslide;
        offsetCurrent++;

        return (
          <div
            className="controller"
            data-video={this.state.datatype == "video" ? "" : null}
            data-single={this.state.totalslide < 2 ? "" : null}
            onClick={e => this.handleClick(e)}
          >
            <span data-control="close">close</span>
            <i>{offsetCurrent}</i>
            <divider> / </divider>
            <c>{this.state.totalslide}</c>
            <t>{this.state.datatype}</t>
            <span data-control="prev">prev</span>
            <span data-control="next">next</span>
            <mute data-control="mute">
              {this.state.muted ? "unmute" : "mute"}
            </mute>
            <fs data-control="fullscreen">fullscreen</fs>
            <scroll data-hidden={this.state.portrait ? "" : null}>
              scroll
            </scroll>
          </div>
        );
      }
      render() {
        let format = this.props.data.format;

        let Slide = this.markups[format](format);

        return (
          <div className="slider">
            <div className="content">
              <ul>
                {Slide}
                {this.spinner()}
                {this.controller()}
              </ul>
            </div>
          </div>
        );
      }
      static propTypes = {
        data: PropTypes.array
      };
      static defaultProps = {
        data: null
      };
    },
    Blogs: class Blogs extends React.Component {
      /**
       * React constructor
       * @param {data} props The first number.
       */
      constructor(props) {
        super(props);
        this.state = {
          expanded: false
        };
      }
      handleClick(e, target) {
        app.summon.init(target);
        app.route.go(`blog/${target.slug}`);
        e.stopPropagation();
        e.preventDefault();
      }
      handleHover(e) {
        if (e.type == "mouseenter") app.ohSnap.go(e.currentTarget, 1);
        else app.ohSnap.go(e.currentTarget, 0);
      }
      loop() {
        let Blog = [];
        this.props.data.map((attr, index) => {
          const featured = attr.better_featured_image;
          if (featured) {
            const thumb = featured.media_details.sizes.thumbnail;
            if (thumb) {
              const thumbURL = thumb.source_url;
              Blog.push(
                <li key={attr.id}>
                  <div className="post">
                    <a
                      href={attr.link}
                      onClick={e => this.handleClick(e, attr)}
                    >
                      <div
                        className="thumb"
                        onMouseEnter={this.handleHover.bind(this)}
                        onMouseLeave={this.handleHover.bind(this)}
                      >
                        <svg x="0px" y="0px" viewBox="0 0 180 200">
                          <g fillRule="evenodd" clipRule="evenodd">
                            <defs>
                              <polygon
                                id={"SVGID_thumb_" + attr.id + "_"}
                                points="57,199,1,72,113,1,163,30,161,113"
                              />
                            </defs>
                            <clipPath id={"SVGID_thumb_a_" + attr.id + "_"}>
                              <use
                                xlinkHref={"#SVGID_thumb_" + attr.id + "_"}
                                overflow="visible"
                              />
                            </clipPath>
                            <g
                              clipPath={"url(#SVGID_thumb_a_" + attr.id + "_)"}
                            >
                              <image
                                overflow="visible"
                                width="300"
                                height="300"
                                xlinkHref={thumbURL}
                                transform="matrix(0.6666666666666666,0,0,0.6666666666666666,-10,0)"
                              />
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
      }
      handleExpansion(e) {
        this.setState({ expanded: !this.state.expanded });
      }
      expandButton() {
        return (
          <a>
            <svg x="0px" y="0px" viewBox="0 0 40 40">
              <line x1="25.3" y1="20" x2="14.7" y2="20" />
              <line x1="20" y1="14.7" x2="20" y2="25.3" />
              <circle fill="none" cx="20" cy="20" r="12" />
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
          <div
            className="slides"
            data-expanded={this.state.expanded ? "" : null}
          >
            <div className="slide">
              <div className="wrapper">
                <ul>{this.loop()}</ul>
                <div className="expand" onClick={e => this.handleExpansion(e)}>
                  {this.expandButton()}
                </div>
              </div>
            </div>
          </div>
        );
      }
      static propTypes = {
        data: PropTypes.array
      };
      static defaultProps = {
        data: null
      };
    },
    Portfolio: class Portfolio extends React.Component {
      constructor(props) {
        super(props);
      }
      handleClick(e, target) {
        app.summon.init(target);
        app.route.go(`${target.type}/${target.slug}`);
        e.stopPropagation();
        e.preventDefault();
      }
      danger(raw) {
        return { __html: raw };
      }
      link(url) {
        return (
          <a href={url}>
            <svg x="0px" y="0px" viewBox="0 0 40 40">
              <line x1="25.3" y1="20" x2="14.7" y2="20" />
              <line x1="20" y1="14.7" x2="20" y2="25.3" />
              <circle fill="none" cx="20" cy="20" r="12" />
            </svg>
            <span className="hero smler">Learn more</span>
          </a>
        );
      }
      loop() {
        let Project = [];
        this.props.data.map((attr, index) => {
          Project.push(
            <li className="slide" key={attr.id}>
              <div className="wrapper">
                <h1>{attr.title.rendered}</h1>
                <div
                  className="copy"
                  dangerouslySetInnerHTML={this.danger(attr.content.rendered)}
                />
                <div
                  className="expand"
                  onClick={e => this.handleClick(e, attr)}
                >
                  {this.link(attr.link)}
                </div>
              </div>
            </li>
          );
        });

        return Project;
      }
      componentDidMount() {
        app.scrollspy.calcPositions();
      }
      render() {
        return <ul className="slides">{this.loop(this.handleClick)}</ul>;
      }
      static propTypes = {
        data: PropTypes.array
      };
      static defaultProps = {
        data: null
      };
    }
  }
};

(function() {
  app.init();
})();
