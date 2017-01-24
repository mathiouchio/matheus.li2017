module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      css:{
        files: [
          'scss/contrib/*.scss',
          'scss/*.scss'
        ],
        tasks: ['compass:dev'],
        options: { livereload: true }
      },
      js:{
        files: [
          'js/libs/*.js',
          'js/*.js'
        ],
        tasks: ['jshint','uglify:dev'],
        options: { livereload: true }
      },
      babel: {
        files: [
          'React/contrib/*.js',
          'React/libs/*.js',
          'React/*.jsx'
        ],
        tasks: ['jshint','babel'],
        options: { livereload: true }
      },
      livereload:{
        options: { livereload: true },
        files: ['../*.php', '../*/*.php'],
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb',
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: 'scss',
          cssDir: '../css'
        }
      }
    },
    jshint: {
      all: ['js/main.js'],
      options: {
        force: true
      }
    },
    uglify: {
      dev: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          beautify: true,
          mangle: false,
          screwIE8: true,
        },
        files: {
          '../js/main.min.js': 
            [
              'js/contrib/*.js',
              'js/libs/*.js',
              'js/main.js'
            ]
        }
      },
      dist: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          beautify: false,
          mangle: {
            except: ['jQuery', 'Backbone', 'React', '_']
          },
          screwIE8: true,
        },
        files: {
          '../js/main.min.js': 
            [
              'js/contrib/*.js',
              'js/libs/*.js',
              'js/main.js',
              'js/jsx.js'
            ]
        }
      }
    },
    // modernizr: {
    //   dist: {
    //     "files" : {
    //       "src": ['js/modernizr/modernizr-dev-build.js']
    //     },
    //     "parseFiles": true,
    //     "customTests": [],
    //     "devFile": false,
    //     "outputFile": "js/libs/modernizr-output.js",
    //     "tests": [
    //       "emoji",
    //       "video",
    //       "svg",
    //       "touch",
    //       "svg/clippaths"
    //     ],
    //     "extensibility": [],
    //     "uglify": true
    //   }
    // },
    manifest: {
      generate: {
        options: {
          basePath: '../',
          cache: ['js/main.min.js', 'css/style.css'],
          network: ['http://*', 'https://*'],
          fallback: ['/ /offline.html'],
          exclude: ['js/jquery.min.js'],
          preferOnline: true,
          headcomment: " <%= pkg.name %> v<%= pkg.version %>",
          verbose: true,
          timestamp: true,
          hash: true,
          master: ['index.php'],
          process: function(path) {
            // return path.substring('build/'.length);
            // var prefix = "wp-content/themes/matheus/",
            //     output = prefix+path;

            // return output;
            return path;
          }
        },
        src: [
          // 'assets/fonts/*',
          // 'assets/images/*.jpg',
          // 'assets/images/*.png',
          // 'assets/images/svg/*.svg',
          // 'images/wood.jpg',
          // 'images/marble.jpg',
          // 'images/portfoliofifteen/*/*.jpg'
        ],
        dest: '../manifest.appcache'
      }
    },
    babel: {
      options: {
        // sourceMap: true,
        plugins: ['transform-react-jsx'],
        presets: ['es2015','react']
      },
      dist: {
        files: {
          '../js/react.js': 'React/*.jsx'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-manifest');

  grunt.loadNpmTasks('grunt-babel');

  // grunt.registerTask('default', ['modernizr','manifest','babel','uglify:dist','compass:dist']);
  grunt.registerTask('default', ['manifest','babel','uglify:dist','compass:dist']);
  grunt.registerTask('dev', ['babel','uglify:dev','compass:dev','jshint','watch']);

  // grunt.registerTask('default', ['modernizr','manifest','uglify:dist','compass:dist']);
  // grunt.registerTask('dev', ['uglify:dev','compass:dev','jshint','watch']);

};