/* jslint node: true */
'use strict';

// Declare dependencies
var gulp = require('gulp');
var jshint = require('gulp-jshint');

// Task: linting for JS
// - JSHint (error checking)
gulp.task('lint', function() {
  gulp.src([
    'gulpfile.js',
    'app.js',
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Default: Watch
gulp.task('default', ['lint']);
