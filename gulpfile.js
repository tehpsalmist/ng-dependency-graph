var gulp = require('gulp');

var concat = require('gulp-concat');
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var cache = require('gulp-cached');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var _ = require('lodash-node');
var browserSync = require('browser-sync');


var paths = {
  scripts: ['app/scripts/**/*.js'],
  appScripts: ['app/scripts/**/*.js', '!app/scripts/**/*.spec.js', '!app/scripts/inject/inject.js'],
  images: 'app/images/**/*',
  html: 'app/**/*.html',
  styles: {
    sass: 'app/styles/**/*.scss',
    css: 'app/styles/*.css'
  },
  notLinted: ['!app/scripts/templates.js']
};

var options = {
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  paths: paths
};

require('./gulp/release-tasks');
// require('./gulp/versioning');

require('./gulp/styles')(options);
require('./gulp/inject')(options);
require('./gulp/server')(options);
require('./gulp/unit-tests')(options);
require('./gulp/changelog')(options);
require('./gulp/unit-tests')(options);


/**
 * Development tasks
 */
var developTasks = ['preprocess', 'watch', 'serve', 'test:auto'];
gulp.task('develop', developTasks);

gulp.task('no-karma', function() {
  _.remove(developTasks, 'karma');
  gulp.start('develop');
});


gulp.task('scripts', ['preprocess', 'lint']);

gulp.task('preprocess', ['inject', 'sass']);

// The default task
gulp.task('default', ['develop']);


gulp.task('lint', function() {
  return gulp.src(paths.scripts.concat(paths.notLinted))
    .pipe(cache('lint'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {

  gulp.watch(paths.styles.sass, ['sass']);

  gulp.watch(paths.scripts).on('change', browserSync.reload);
  gulp.watch(paths.html).on('change', browserSync.reload);

  gulp.watch(paths.appScripts, function(event) {
    if (event.type === 'added' || event.type === 'deleted') {
      gulp.start('inject');
    }
  });
});
