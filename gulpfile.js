var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var gutil = require('gulp-util');

var prettyError = function(error) {
  var msg = error.codeFrame.replace(/\n/g, '\n    ');

  gutil.log('|- ' + gutil.colors.bgRed.bold('Build Error in ' + error.plugin));
  gutil.log('|- ' + gutil.colors.bgRed.bold(error.message));
  gutil.log('|- ' + gutil.colors.bgRed('>>>'));
  gutil.log('|\n    ' + msg + '\n           |');
  gutil.log('|- ' + gutil.colors.bgRed('<<<'));

  this.emit('end');
}


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
    .pipe(gulp.dest('dist'));
});

gulp.task('less', function() {
  return gulp.src('./src/less/main.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build', 'less'], function() {
  gulp.watch('./src/**/*.jsx', ['build']);
  gulp.watch('./src/less/**/*.less', ['less']);
});

gulp.task('default', ['watch']);