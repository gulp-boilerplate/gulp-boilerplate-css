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
    assign = require('object-assign'),
    debug = require('gulp-debug');

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

        var stream, optimizers;

        stream = lazypipe()
            .pipe(function () {
                console.log(precompiler);
                return gulpif(precompiler, precompiler());
            })
            .pipe(function () {
                return remember('styles');
            })
            .pipe(function () {
                return concat('site.css');
            });

        optimizers = lazypipe()
            .pipe(function () {
                var files = ['index.html'],
                    stripcss = false;

                if (config.options.uncss) {
                    stripcss = true;
                    files = config.options.uncss.files;
                }
                return gulpif(stripcss, uncss({
                    html: files
                }));
            })
            .pipe(function () {
                return autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                });
            })
            .pipe(csso);

        gulp.src(config.src)
            .pipe(cached('styles'))
            .pipe(precompiler())
            .pipe(optimizers())
            .pipe(print(function (filepath) {
                return gutil.colors.green(success) + ' ' + filepath;
            }))
            .on('error', gutil.log.bind(this, error + ' CSS Error '))

            .pipe(gulp.dest(config.dest));

        return gulp;
    };
};
