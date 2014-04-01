var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

gulp.task('test', function() {
    gulp.src('spec/*.js')
        .pipe(jasmine());
});

gulp.task('dev', function() {
    gulp.watch('src/*.js', ['test']);
});

gulp.task('default', ['dev']);
