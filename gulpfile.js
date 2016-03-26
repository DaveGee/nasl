var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();

var prettyError = function(error) {
  var msg = error;
  if (error.codeFrame)
    msg = error.codeFrame.replace(/\n/g, '\n    ');

  gutil.log('|- ' + gutil.colors.bgRed.bold('Build Error in ' + error.plugin));
  gutil.log('|- ' + gutil.colors.bgRed.bold(error.message));
  gutil.log('|- ' + gutil.colors.bgRed('>>>'));
  gutil.log('|\n    ' + msg + '\n           |');
  gutil.log('|- ' + gutil.colors.bgRed('<<<'));

  this.emit('end');
};

gulp.task('build', function() {
  return browserify({
    entries: './src/app.jsx',
    extensions: ['.jsx'],
    debug: true
  })
    .transform('babelify', { presets: ['es2015', 'react'] })
    .bundle()
    .on('error', prettyError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('less', function() {
  return gulp.src('./src/less/main.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .on('error', prettyError)
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['build', 'less'], function() {

  browserSync.init({
    server: "./dist"
  });

  gulp.watch('./src/app/**/*.js*', ['build']);
  gulp.watch('./src/less/**/*.less', ['less']);
});

//gulp.task('jsx-watch', ['build'], browserSync.reload);

gulp.task('default', ['serve']);