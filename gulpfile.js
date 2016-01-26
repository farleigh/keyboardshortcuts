var gulp   = require("gulp");
var jshint = require("gulp-jshint");
var rimraf = require("rimraf");
var concat = require('gulp-concat');
var Server = require('karma').Server;

var paths = {
    out: 'dist',
    src: 'src',
    lib: 'lib'
};

gulp.task("clean", function (cb) {
    rimraf(paths.out, cb);
});

gulp.task("lint", function () {
    return gulp.src(paths.src + "/**/*.js")
             .pipe(jshint())
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
    gulp.src(["css/*.css", "images/**/*", "popup.html", "manifest.json"], {
        base: "."
    }).pipe(gulp.dest(paths.out));

    // copy js source
    gulp.src([paths.src + '/config/**/*.js']).pipe(gulp.dest(paths.out + '/js'));
    gulp.src([paths.src + '/share/**/*.js']).pipe(gulp.dest(paths.out + '/js'));
    gulp.src([paths.src + '/*.js']).pipe(gulp.dest(paths.out + '/js'));

    // concatenate js source for shortcuts
    gulp.src([paths.src + '/shortcuts/**/*.js', paths.src + '/share/**/*.js'])
        .pipe(concat('keyboard_shortcuts.js'))
        .pipe(gulp.dest(paths.out + '/js'));

    // copy js lib
    gulp.src([paths.lib + "/**/*.js"]).pipe(gulp.dest(paths.out + "/js/3p"));

});

gulp.task("default", ["clean"], function () {
    gulp.start("lint", "test", "copy");
});
