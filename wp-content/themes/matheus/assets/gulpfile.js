const gulp    = require('gulp'),
      sass    = require('gulp-sass'),
      minify  = require('gulp-minify'),
      jshint  = require('gulp-jshint'),
      stylish = require('jshint-stylish'),
      compass = require('gulp-compass'),
      livereload = require('gulp-livereload'),
      concat  = require('gulp-concat'),
      babel   = require('gulp-babel');

var paths = {
  php:      ['../*.php', '../**/*.php'],
  jsx:      'js/jsx/*.jsx',
  js:       '../js',
  jsMin:    '../js/min',
  css:      'css',
  sass:     'scss/*.scss',
  jsConcat: ['js/libs/*.js','js/contrib/*.js','js/*.js','js/jsx/*.js']
}

gulp.task('concat', function(){
  gulp.src(paths.jsConcat)
      .pipe(concat('scripts.js'))
      .pipe(minify({
        ext:{
          src: '-debug.js',
          min: '.min.js'
        },
        output: {
          beautify: false
        }
      }))
      .pipe(gulp.dest(paths.js))
      .pipe(livereload());
});

gulp.task('babel', function() {
  gulp.src(paths.jsx)
      .pipe(babel({
          plugins: ['transform-react-jsx'],
          presets: ['es2015','react']
      }))
      .pipe(gulp.dest('js/jsx'));
});

gulp.task('compass', function() {
  gulp.src(paths.sass)
      .pipe(compass({
        style: 'expanded',
        css: 'css',
        sass: 'scss',
        comments: true
      }))
      .on('error', function(error) {
        console.log(error);
        this.emit('end');
      })
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

  // detech when to babel
  gulp.watch(paths.jsx, ['babel']);
  // detect when to concat
  gulp.watch(paths.jsConcat, ['concat']);
  // detect when to minify
  // gulp.watch(paths.js+'/*.js', ['minify']);
  // detect when to compass
  gulp.watch(['scss/*.scss','scss/partials/*.scss'], ['compass']);
});

gulp.task('default', ['babel','compass','watch']);