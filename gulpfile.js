var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var less = require('gulp-less');
var path = require('path');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var prettyError = require('./build/build-utils');
var config = require('./build/config');
var uglify = require('gulp-uglify');
var htmlReplace = require('gulp-html-replace');
var autoprefixer = require('gulp-autoprefixer');
var cssBase64 = require('gulp-css-base64');
var envify = require('envify/custom');

gulp.task('libs', function() {
  var b = browserify({
    debug: false
  });
  
  config.polyfills.forEach(function(p) {
    b.add(p);
  });
  
  config.libs.forEach(function(lib) {
    b.require(lib);
  });

  return b.bundle()
    .on('error', prettyError)
    .pipe(source(config.libsDest))
    .pipe(buffer()) // mandatory for uglify..
    .pipe(uglify())
    .pipe(gulp.dest(config.rootDir));
});

gulp.task('build', function() {
  var build = browserify({
    entries: config.src.react,
    extensions: ['.jsx', '.js'],
    debug: process.env.NODE_ENV !== 'production'
  })
    .transform(envify({
        _: 'purge',
        NODE_ENV: process.env.NODE_ENV
    }))
    .transform('babelify', { presets: ['es2015', 'react'] })
    .bundle()
    .on('error', prettyError)
    .pipe(source(config.bundleDest))
  
  if(process.env.NODE_ENV === 'production')
    build = build
      .pipe(buffer())
      .pipe(uglify());
  
  return build
    .pipe(gulp.dest(config.rootDir))
    .pipe(browserSync.stream());
});

gulp.task('less', function() {
  return gulp.src(config.src.less)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .on('error', prettyError)
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(cssBase64({
      baseDir: "../../images",
      extensionsAllowed: ['.gif', '.png']
    }))
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(gulp.dest(config.rootDir))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src(config.src.html)
    .pipe(htmlReplace({
      'css': config.cssDest,
      'js': [config.libsDest, config.bundleDest]
    }))
    .pipe(gulp.dest(config.rootDir));
});

gulp.task('serve', ['libs', 'build', 'less', 'html'], function() {

  browserSync.init({
    server: config.rootDir
  });

  gulp.watch('./src/index.html', ['html']);
  gulp.watch('./src/**/*.js*', ['build']);
  gulp.watch('./src/less/**/*.less', ['less']);
});

gulp.task('default', ['serve']);