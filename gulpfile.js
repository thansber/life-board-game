var gulp = require('gulp'),
  connect = require('gulp-connect'),
  vulcanize = require('gulp-vulcanize');

gulp.task('connect', function() {
  connect.server();
});

gulp.task('vulcanize', function() {
  return gulp.src('raw.html')
    .pipe(vulcanize({
    }))
    .pipe(gulp.dest('./index'));
});

gulp.task('default', ['connect']);