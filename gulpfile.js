var gulp   = require("gulp");
var jshint = require("gulp-jshint");
var rimraf = require("rimraf");
var concat = require('gulp-concat');
var Server = require('karma').Server;
var flatten = require('gulp-flatten');
var minify = require('gulp-minify');
var packageJSON  = require('./package');

var paths = {
  out: 'dist',
  src: 'src',
  libs: [ 'node_modules/almond/almond.js',
          'node_modules/angular/angular.js',
          'node_modules/jquery/dist/jquery.js',
          'node_modules/mousetrap/mousetrap.js',
          'node_modules/ng-group/src/ngGroup.js' ]
};

gulp.task("clean", function (cb) {
  rimraf(paths.out, cb);
});

gulp.task("lint", function () {
  var jshintConfig = packageJSON.jshintConfig;
  return gulp.src(paths.src + "/**/*.js")
           .pipe(jshint(jshintConfig))
           .pipe(jshint.reporter("fail"));
});

gulp.task("test", function(done) {
  Server.start({
      configFile: __dirname + "/karma.conf.js",
      singleRun: true
  }, done);
});

gulp.task("copy", function () {
  // copy things that don't need to change location
  gulp.src(["css/**/*", "images/**/*"], {
      base: "."
  }).pipe(gulp.dest(paths.out));

  // copy things that must go to the root
  gulp.src(["html/**/*", "config/**/*"])
    .pipe(flatten())
    .pipe(gulp.dest(paths.out));

  // copy js source for config
  gulp.src([paths.src + '/config/**/*.js', paths.src + '/share/**/*.js', paths.src + '/*.js'])
      .pipe(concat('config-bundle.js'))
      .pipe(minify())
      .pipe(gulp.dest(paths.out + '/js'));

  // concatenate js source for shortcuts
  gulp.src([paths.src + '/shortcuts/**/*.js', paths.src + '/share/**/*.js'])
      .pipe(concat('keyboard-shortcuts-bundle.js'))
      .pipe(minify())
      .pipe(gulp.dest(paths.out + '/js'));

  // copy js lib
  gulp.src(paths.libs)
      .pipe(minify())
      .pipe(gulp.dest(paths.out + "/js/3p"));
});

gulp.task("default", ["clean"], function () {
  gulp.start("lint", "test", "copy");
});
