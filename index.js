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
    success = symbols.success,
    error = symbols.error,
    autoprefixer = require('gulp-autoprefixer'),
    assign = require('object-assign');

module.exports = function (config) {
    var precompiler;

    config.options = assign({}, config.options);
    config.src.each(function (item) {
        if (/^.*(sass)+?/.test(item)) {
            precompiler = sass;
        } else if (/^.*(less)+?/.test(item)) {
            precompiler = less;
        }
    });

    return function () {

        var stream;

        stream.gulp.src(config.src)
            .pipe(cached('styles'))
            .on('error', gutil.log.bind(this, error + ' CSS Error '));

        if (precompiler) {
            stream.pipe(precompiler());
        }

        stream.pipe(print(function (filepath) {
                return gutil.colors.green(success) + ' ' + filepath;
            }))
            .pipe(remember('styles'))
            .pipe(concat('site.css'));

        if (config.options.uncss) {
            stream.pipe(uncss({
                html: config.options.uncss.files || ['index.html']
            }));
        }

        stream.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
            .pipe(csso())
            .pipe(gulp.dest(config.dest));
        return gulp;
    };
};
