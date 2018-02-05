const autoprefixer = require('gulp-autoprefixer'),
      babel        = require('gulp-babel'),
      browserSync  = require('browser-sync').create(),
      concat       = require('gulp-concat'),
      del          = require('del'),
      es           = require('event-stream'),
      fs           = require('fs'),
      exec         = require('gulp-exec'),
      gulp         = require('gulp'),
      gutil        = require('gulp-util'),
      jshint       = require('gulp-jshint'),
      livereload   = require('gulp-livereload'),
      minify       = require('gulp-minify'),
      rename       = require('gulp-rename'),
      runSequence  = require('run-sequence'),
      sass         = require('gulp-sass'),
      sourcemaps   = require('gulp-sourcemaps'),
      stylish      = require('jshint-stylish'),
      ts           = require('gulp-typescript'),
      tscConfig    = require('./tsconfig.json'),
      prompt       = require('gulp-prompt'),
      uglify       = require('gulp-uglify');

const paths = {
        node:     './node_modules/',
        php:      ['../*.php', '../**/*.php'],
        jsx:      'js/jsx/*.jsx',
        ts:       'js/ts/*.ts',
        jsMin:    '../js',
        cssMin:   '../css',
        sass:     'scss/*.scss',
        jsConcat: ['js/libs/*.js',
          'js/main.js',
          'js/rekt.js',
          'js/wipeskript.js'],
        angularLibraries: [
          '@angular/**/bundles/**',
          'angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
          'core-js/client/shim.min.js',
          'reflect-metadata/Reflect.js',
          'systemjs/dist/system.src.js',
          'rxjs/**/*.js',
          'zone.js/dist/**'
        ],
        libs: ['react','react-dom', 'snapsvg', 'plyr', 'jquery'],
        old: '../old'
      },
      options = {
        exec: {
          options : {
            continueOnError: false,  // default = false, true means don't emit error event
            pipeStdout:      false,  // default = false, true means stdout is written to file.contents
          },
          reportOptions : {
            err:             true,   // default = true, false means don't write err
            stderr:          true,   // default = true, false means don't write stderr
            stdout:          true    // default = true, false means don't write stdout
          }
        }
      };


const browserSyncProps = (function(){
  return {
    bsPort: gutil.env.port ? gutil.env.port : 8080,
    get options(){
      return {
        injectChanges: true,
        proxy: 'localhost:'+this.bsPort+'/matheus.li',
        port: 3000,
        notify: false,
        ui: false,
        ghost: false,
        open: 'local'
      }
    }
  }
})();

gulp.task('browser-sync', function() {
  browserSync.init([
      paths.jsMin+'*.js',
      paths.cssMin+'*.css',
      paths.php
    ],browserSyncProps.options);
});

gulp.task('copy-assets', ['clean-dist'], function(){
  // angular
  gulp.src(paths.angularLibraries, {cwd: "node_modules/**"})
      .pipe(gulp.dest('angular'));
  // everything else
  paths.libs.map( function(a){
    gulp.src([paths.node+a+'/dist/*.js',
      '!'+paths.node+a+'/dist/*min.js',
      '!'+paths.node+a+'/dist/*with-addons.js',
      '!'+paths.node+a+'/dist/*-server.js',
      '!'+paths.node+a+'/dist/*slim.js',
      '!'+paths.node+a+'/dist/core.js'])
        .pipe(a == "react-dom" ? rename({basename: 'reactdom'}) : gutil.noop())
        .pipe(gulp.dest('js/libs'));

    gulp.src([paths.node+a+'/dist/*.css',
      '!'+paths.node+a+'/dist/*min.css'])
        .pipe(gulp.dest(paths.cssMin+'/libs'));
  });
});

gulp.task('clean-dist', function(cb){
  return del(['js/libs',
    'angular/**/*',
    '!angular/systemJSConfig',
    '!angular/systemJSConfig/systemjs.config.js',
    'js/angular',
    '../css/libs'
  ], {force: true});
});

gulp.task('git-reset', function(){
  return gulp.src('commitmsg')
    .pipe(exec('git reset', options.exec.options))
    .pipe(exec.reporter(options.exec.reportOptions));
});

gulp.task('git-status', function(){
  return gulp.src('commitmsg')
    .pipe(exec('git status', options.exec.options))
    .pipe(exec.reporter(options.exec.reportOptions));
});

gulp.task('git-add', function(){
  return gulp.src('commitmsg')
    .pipe(exec('git add .', options.exec.options));
});

gulp.task('git-commit', function(){
  return gulp.src('commitmsg')
    .pipe(prompt.prompt({
        type:    'input',
        name:    'commit',
        message: 'Enter commit message ...'
    }, function(res){
      console.log(res.commit);
      exec('git commit -m "test with prompt"', options.exec.options);
    }))
    // .pipe(exec('git commit -m "automation"', options.exec.options))
    .pipe(exec.reporter(options.exec.reportOptions));
});

gulp.task('git', function (cb) {
  runSequence('git-reset', 'git-status', 'git-add', 'git-commit');
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
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.init()) // @TODO: doesn't work
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
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.write()) // @TODO: doesn't work
    .pipe(gulp.dest(paths.jsMin))
    .pipe(!gutil.env.bs ? livereload() : gutil.noop())
    .pipe(gutil.env.bs ? browserSync.stream() : gutil.noop());

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
      .pipe(ts(tscConfig.compilerOptions))
      .pipe(gulp.dest('angular/main'));
});

gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.init())
    .pipe(sass({
        outputStyle: gutil.env.prod ? 'compressed' : 'expanded',
        sourceComments: 'map'
      }).on('error', sass.logError))
    .pipe(autoprefixer({remove: true}))
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest(paths.cssMin))
    .pipe(!gutil.env.bs ? livereload() : gutil.noop())
    .pipe(gutil.env.bs ? browserSync.stream() : gutil.noop());
});

gulp.task('twentythirteen', function(){
  return gulp.src(paths.old+'/scss/*.scss')
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.init())
    .pipe(sass({
        outputStyle: gutil.env.prod ? 'compressed' : 'expanded',
        sourceComments: 'map'
      }).on('error', sass.logError))
    .pipe(autoprefixer({remove: true}))
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest(paths.old+'/css'))
    .pipe(!gutil.env.bs ? livereload() : gutil.noop());
});

gulp.task('watch-old', function() {
  if (!gutil.env.bs)
    livereload.listen();
  gulp.watch(paths.old+'/scss/*', ['twentythirteen']);
});

gulp.task('watch', function() {
  if (!gutil.env.bs) livereload.listen();

  // detect php change
  gulp.watch(paths.php)
      .on('change', function(event){
        gulp.src(event.path)
            .pipe(!gutil.env.bs ? livereload() : gutil.noop())
            .pipe(gutil.env.bs ? browserSync.stream() : gutil.noop());
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

gulp.task('compile', ['babel','ts','sass']);
gulp.task('default', ['browser-sync','babel','ts','sass','watch']);
