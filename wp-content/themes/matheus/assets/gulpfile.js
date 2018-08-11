const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const del = require("del");
// const fs = require("fs");
const exec = require("child_process").exec;
const execute = require("gulp-exec");
const gulp = require("gulp");
const gutil = require("gulp-util");
// const jshint = require("gulp-jshint");
// livereload   = require('gulp-livereload'),
// const minify = require("gulp-minify");
const rename = require("gulp-rename");
// const runSequence = require("run-sequence");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
// const stylish = require("jshint-stylish");
const ts = require("gulp-typescript");
const tscConfig = require("./tsconfig.json");
const prompt = require("gulp-prompt");
// const uglify = require("gulp-uglify");
const paths = {
  node: "./node_modules/",
  php: ["../*.php", "../**/*.php"],
  js: ["gulpfile.js", "js/**/*.js", "js/**/*.jsx", "js/**/*.ts", "!js/libs"],
  jsx: "js/jsx/*.jsx",
  ts: "js/ts/*.ts",
  jsMin: "../js",
  cssMin: "../css",
  sass: "scss/*.scss",
  jsConcat: ["js/settings.js", "js/libs/*.js", "js/main.js", "js/rekt.js"],
  angularLibraries: [
    "@angular/**/bundles/**",
    "angular-in-memory-web-api/bundles/in-memory-web-api.umd.js",
    "core-js/client/shim.min.js",
    "reflect-metadata/Reflect.js",
    "systemjs/dist/system.src.js",
    "rxjs/**/*.js",
    "zone.js/dist/**"
  ],
  libs: ["react", "react-dom", "prop-types", "snapsvg", "plyr", "jquery"],
  old: "../old"
};
const execOpts = {
  options: {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: true // default = false, true means stdout is written to file.contents
  },
  reportOptions: {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
  }
};
const browserSyncProps = (function() {
  return {
    bsPort: gutil.env.port ? gutil.env.port : 8087,
    get options() {
      return {
        injectChanges: true,
        proxy: "localhost:" + this.bsPort,
        port: 3000,
        notify: false,
        ui: false,
        ghost: false,
        open: "local"
      };
    }
  };
})();

gulp.task("browser-sync", function() {
  browserSync.init(
    [paths.jsMin + "*.js", paths.cssMin + "*.css", paths.php],
    browserSyncProps.options
  );
});
gulp.task("clean-dist", function(cb) {
  return del(
    [
      "js/libs",
      "angular/**/*",
      "!angular/systemJSConfig",
      "!angular/systemJSConfig/systemjs.config.js",
      "js/angular",
      "../css/libs"
    ],
    { force: true }
  );
});
gulp.task("copy-assets", ["clean-dist"], function() {
  // angular
  gulp
    .src(paths.angularLibraries, { cwd: "node_modules/**" })
    .pipe(gulp.dest("angular"));
  // everything else
  paths.libs.map(function(a) {
    gulp
      .src([
        paths.node + a + "/" + a + ".js",
        paths.node + a + "/dist/*.js",
        paths.node + a + "/umd/*.js",
        "!" + paths.node + a + "/umd/*min.js",
        "!" + paths.node + a + "/dist/*min.js",
        "!" + paths.node + a + "/dist/*with-addons.js",
        "!" + paths.node + a + "/dist/*-server.js",
        "!" + paths.node + a + "/dist/*slim.js",
        "!" + paths.node + a + "/dist/core.js"
      ])
      .pipe(a == "react-dom" ? rename({ basename: "reactdom" }) : gutil.noop())
      .pipe(gulp.dest("js/libs"));
    gulp
      .src([
        paths.node + a + "/dist/*.css",
        "!" + paths.node + a + "/dist/*min.css"
      ])
      .pipe(gulp.dest(paths.cssMin + "/libs"));
  });
});
gulp.task("git-reset", function() {
  return gulp
    .src("commitmsg")
    .pipe(execute("git reset"))
    .pipe(execute.reporter(execOpts.reportOptions));
});
gulp.task("git-status", function() {
  return gulp
    .src("commitmsg")
    .pipe(execute("git status", execOpts.options))
    .pipe(execute.reporter(execOpts.reportOptions));
});
gulp.task("git-branch", function() {
  return gulp
    .src("commitmsg")
    .pipe(execute("git rev-parse --abbrev-ref HEAD", execOpts.options))
    .pipe(execute.reporter(execOpts.reportOptions))
    .pipe(
      prompt.prompt(
        {
          type: "input",
          name: "branch",
          message: "Branch name ..."
        },
        function(res) {
          exec(`git checkout ${res.branch}`, function(err) {
            if (err) exec("git checkout -b " + res.branch);
          });
        }
      )
    );
});
gulp.task("git-add", function() {
  return gulp.src("commitmsg").pipe(execute("git add ."));
});
gulp.task("git-push", function(cb) {
  return gulp.src("commitmsg").pipe(execute.reporter(execOpts.reportOptions));
});
gulp.task("git-commit", function() {
  return gulp.src("commitmsg").pipe(
    prompt.prompt(
      {
        type: "input",
        name: "commit",
        message: "Enter commit message ..."
      },
      function(res) {
        exec(`git commit -m ${res.commit}`, function(err, stdout, stderr) {
          console.log(stdout);
          console.error(stderr);
        });
      }
    )
  );
});
// gulp.task('git', function (cb) {
//   runSequence('git-reset', 'git-status', 'git-branch', 'git-add', 'git-commit');
// });
gulp.task("git", [
  "git-reset",
  "git-branch",
  "git-status",
  "git-add",
  "git-commit"
]);
gulp.task("concat", function() {
  // const processEnv = `process.env.NODE_ENV = "development"`;
  const stream = gulp
    .src(paths.jsConcat)
    // .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.init()) // @TODO: doesn't work
    .pipe(concat("scripts.min.js"))
    // .pipe(sourcemaps.write())
    // .pipe(minify({
    //   ext:{
    //     min: '.min.js'
    //   },
    //   output: {
    //     beautify: gutil.env.prod ? false : true,
    //     comments: gutil.env.prod ? false : true,
    //   }
    // }))
    // .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.write()) // @TODO: doesn't work
    .pipe(gulp.dest(paths.jsMin))
    // .pipe(!gutil.env.bs ? livereload() : gutil.noop())
    .pipe(browserSync.stream());
  stream.on("end", function() {
    del("../js/scripts.js", { force: true });
  });
  return stream;
});
gulp.task("eslint", () => {
  return gulp
    .src(paths.jsx)
    .pipe(
      execute("eslint js/jsx/* --fix", {
        continueOnError: true
      })
    )
    .pipe(execute.reporter(execOpts.reportOptions));
});
gulp.task("babel", ["eslint"], function() {
  gulp
    .src(paths.jsx)
    .pipe(execute.reporter(execOpts.reportOptions))
    .pipe(
      babel({
        plugins: ["transform-react-jsx", "transform-class-properties"],
        presets: ["env", "react"]
      })
    )
    .pipe(gulp.dest("js"));
});
gulp.task("ts", function() {
  gulp
    .src(paths.ts)
    .pipe(ts(tscConfig.compilerOptions))
    .pipe(gulp.dest("angular/main"));
});

gulp.task("stylelint", function() {
  return gulp
    .src(paths.sass)
    .pipe(
      execute("stylelint scss/*.scss --fix", {
        continueOnError: true
      })
    )
    .pipe(execute.reporter(execOpts.reportOptions));
});
gulp.task("sass", function() {
  return gulp
    .src(paths.sass)
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.init())
    .pipe(
      sass({
        outputStyle: gutil.env.prod ? "compressed" : "expanded",
        sourceComments: "map"
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer({ remove: true }))
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest(paths.cssMin))
    .pipe(browserSync.stream());
});
gulp.task("twentythirteen", function() {
  return gulp
    .src(paths.old + "/scss/*.scss")
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.init())
    .pipe(
      sass({
        outputStyle: gutil.env.prod ? "compressed" : "expanded",
        sourceComments: "map"
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer({ remove: true }))
    .pipe(gutil.env.prod ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest(paths.old + "/css"));
  // .pipe(!gutil.env.bs ? livereload() : gutil.noop());
});
gulp.task("watch-old", function() {
  // if (!gutil.env.bs)
  //   livereload.listen();
  gulp.watch(paths.old + "/scss/*", ["twentythirteen"]);
});
gulp.task("watch", function() {
  // if (!gutil.env.bs) livereload.listen();
  // detect php change
  gulp.watch(paths.php).on("change", function(event) {
    gulp
      .src(event.path)
      // .pipe(!gutil.env.bs ? livereload() : gutil.noop())
      .pipe(browserSync.stream());
  });
  // detect when to babel
  gulp.watch(paths.jsx, ["babel"]);
  // detect when to transpile ts
  gulp.watch(paths.ts, ["ts"]);
  // detect when to concat
  gulp.watch(paths.jsConcat, ["concat"]);
  // detect when to sass
  gulp.watch(["scss/*.scss", "scss/partials/*.scss"], ["sass"]);
});
gulp.task("compile", ["babel", "ts", "sass"]);
gulp.task("default", ["browser-sync", "babel", "sass", "watch"]);
