var gulp = require('gulp');
var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('serverTests', function() {
    gulp.src('spec/*.js')
        .pipe(mocha({
            reporter: 'spec'
        }));
});

gulp.task('clientTests', function() {
    gulp.src('spec/client/runner.html')
        .pipe(mochaPhantomJS());
});

gulp.task('test', ['serverTests', 'clientTests']);

gulp.task('dev', function() {
    gulp.watch('src/*.js', ['serverTests']);
    gulp.watch('src/static/js/*.js', ['clientTests']);
});

gulp.task('default', ['dev']);
