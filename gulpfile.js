var
  gulp = require('gulp'),
  connect = require('gulp-connect'),
  vulcanize = require('gulp-vulcanize'),
  rename = require('gulp-rename');

gulp.task('connect', function() {
  connect.server();
});

gulp.task('vulcanize', function() {
  return gulp.src('raw.html')
    .pipe(vulcanize({
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['connect']);