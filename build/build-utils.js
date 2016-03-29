var gutil = require('gulp-util');

module.exports = function prettyError(error) {
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