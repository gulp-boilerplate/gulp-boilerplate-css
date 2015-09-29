var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    gutil = require('gulp-util'),
    uncss = require('gulp-uncss'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    symbols = require('symbols'),
    remember = require('gulp-remember'),
    cached = require('gulp-cached'),
    lazypipe = require('lazypipe'),
    gulpif = require('gulp-if'),
    success = symbols.success,
    error = symbols.error,
    autoprefixer = require('gulp-autoprefixer'),
    assign = require('object-assign');

module.exports = function (config) {
    var precompiler;

    config.options = assign({}, config.options);
    config.src.forEach(function (item) {
        if (/^.*\.(sass|scss)+?$/.test(item)) {
            precompiler = sass;
        } else if (/^.*\.(less)+?$/.test(item)) {
            precompiler = less;
        }
    });

    return function () {

        var stream;

        stream = lazypipe()
        .pipe(cached('styles'))
            .on('error', gutil.log.bind(this, error + ' CSS Error '))
        .pipe(gulpif(precompiler, precompiler()))
        .pipe(print(function (filepath) {
            return gutil.colors.green(success) + ' ' + filepath;
        }))
        .pipe(remember('styles'))
        .pipe(concat('site.css'))
        .pipe(gulpif(config.options.uncss, uncss({
            html: config.options.uncss.files || ['index.html']
        })))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(csso());

        gulp.src(config.src)
        .pipe(stream())
        .pipe(gulp.dest(config.dest));
        return gulp;
    };
};
