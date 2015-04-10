var gulp = require('gulp'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    gutil = require('gulp-util'),
    uncss = require('gulp-uncss'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    symbols = require('symbols'),
    remember = require('remember'),
    cached = require('gulp-cached'),
    success = symbols.success,
    error = symbols.error,
    autoprefixer = require('gulp-autoprefixer');

module.exports = function (config) {
    return function () {
        return gulp.src(config.src)
            .pipe(cached('styles'))
            .on('error', gutil.log.bind(this, error + ' CSS Error '))
            .pipe(less())
            .pipe(print(function (filepath) {
                return gutil.colors.green(success) + ' ' + filepath;
            }))
            .pipe(remember('styles'))
            .pipe(concat('site.css'))
            .pipe(uncss({
                html: ['index.html']
            }))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(csso())
            .pipe(gulp.dest(config.dest));
    };
};
