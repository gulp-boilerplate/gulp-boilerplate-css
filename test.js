var gulp = require ('gulp'),
    css = require('./'),
    task = {
        src : ['test.less'],
        dest : './',
        options: {}
    };
gulp.reset();
gulp.task('css', css(task));
gulp.run('css');
gulp.reset();
task = {
    src : ['test.scss'],
    dest : './',
    options: {}
};
gulp.task('css', css(task));
gulp.run('css');
