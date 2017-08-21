const babel   = require('gulp-babel'),
      concat  = require('gulp-concat'),
      del     = require('del'),
      gulp    = require('gulp'),
      gutil   = require('gulp-util'),
      jshint  = require('gulp-jshint'),
      livereload = require('gulp-livereload'),
      minify  = require('gulp-minify'),
      rename  = require("gulp-rename"),
      sass    = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      stylish = require('jshint-stylish'),
      ts      = require('gulp-typescript'),
      uglify = require('gulp-uglify');

var paths = {
  node:     './node_modules/',
  php:      ['../*.php', '../**/*.php'],
  jsx:      'js/jsx/*.jsx',
  ts:      'js/ts/*.ts',
  js:       '../js',
  css:      'css',
  sass:     'scss/*.scss',
  jsConcat: ['js/libs/*.js',
    'js/main.js',
    'js/rekt.js',
    'js/wipeskript.js']
}

gulp.task('copy-assets', ['clean-dist'], function(){
  var libs = ['react','react-dom', 'snapsvg', 'plyr', 'jquery'];
  libs.map( function(a){
    gulp.src([paths.node+a+'/dist/*.js',
      '!'+paths.node+a+'/dist/*min.js',
      '!'+paths.node+a+'/dist/*with-addons.js',
      '!'+paths.node+a+'/dist/*-server.js',
      '!'+paths.node+a+'/dist/*slim.js',
      '!'+paths.node+'jquery/dist/core.js'])
        .pipe(a == "react-dom" ? rename({basename: 'reactdom'}) : gutil.noop())
        .pipe(gulp.dest('js/libs'));

    gulp.src([paths.node+a+'/dist/*.css',
      '!'+paths.node+a+'/dist/*min.css'])
        .pipe(gulp.dest('css/libs'));
  });
});

gulp.task('clean-dist', function(){
  return del(['js/libs','css/libs']);
});

gulp.task('concat', function(){
  // var stream = gulp.src(paths.jsConcat)
  //   .pipe( gutil.env.prod ? gutil.noop() : sourcemaps.init())
  //   .pipe( concat('scripts.js'))
  //   .pipe( uglify({ preserveComments: 'license' }))
  //   .pipe( rename({ extname: '.min.js' }))
  //   .pipe( gutil.env.prod ? gutil.noop() : sourcemaps.write())
  //   .pipe( gulp.dest(paths.js))
  //   .pipe( livereload());

  var stream = gulp.src(paths.jsConcat)
    .pipe( gutil.env.prod ? gutil.noop() : sourcemaps.init()) // @TODO: doesn't work
    .pipe(concat('scripts.js'))
    .pipe(minify({
      ext:{
        min: '.min.js'
      },
      output: {
        beautify: gutil.env.prod ? false : true,
        comments: gutil.env.prod ? false : true,
      }
    }))
    .pipe( gutil.env.prod ? gutil.noop() : sourcemaps.write()) // @TODO: doesn't work
    .pipe(gulp.dest(paths.js))
    .pipe(livereload());

  stream.on('end', function() {
    del('../js/scripts.js', {force: true});
  });
  return stream;
});

gulp.task('babel', function() {
  gulp.src(paths.jsx)
      .pipe(babel({
          plugins: ['transform-react-jsx'],
          presets: ['es2015','react']
      }))
      .pipe(gulp.dest('js'));
});

gulp.task('ts', function(){
  gulp.src(paths.ts)
      .pipe(ts({
        noImplicitAny: true
      }))
      .pipe(gulp.dest('js'));
});

gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe( gutil.env.prod ? gutil.noop() : sourcemaps.init())
    .pipe( sass({
        outputStyle: gutil.env.prod ? 'compressed' : 'expanded',
        sourceComments: 'map'
      }).on('error', sass.logError))
    .pipe( gutil.env.prod ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest(paths.css))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();

  // detect php change
  gulp.watch(paths.php)
      .on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type);
        gulp.src(event.path)
            .pipe(livereload());
      });

  // detect when to babel
  gulp.watch(paths.jsx, ['babel']);
  // detect when to transpile ts
  gulp.watch(paths.ts, ['ts']);
  // detect when to concat
  gulp.watch(paths.jsConcat, ['concat']);
  // detect when to sass
  gulp.watch(['scss/*.scss','scss/partials/*.scss'], ['sass']);
});

gulp.task('default', ['babel','sass','watch']);