'use strict';

var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var del = require('del');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');

var jsFiles = [
  'bin/www',
  'config/**/*.js',
  'lib/**/*.js',
  'models/**/*.js',
  'routes/**/*.js',
  'tests/**/*.js'
];
var testFiles = ['tests/**/*.js'];
var sassFiles = ['public/style/**/*sass'];

gulp.task('nodemon', function () {
  nodemon({
    script: 'bin/www',
    /* https://github.com/remy/nodemon/issues/508 */
    delay: 500,
    ignore: ['node_modules', 'dist', 'public', 'views'],
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  })
  .on('crash', ['lint', 'test'])
  .on('exit', ['lint', 'test']);
});

gulp.task('lint', function () {
  return gulp.src(jsFiles)
    .pipe(jshint());
});

gulp.task('test', function () {
  return gulp.src(testFiles)
    .pipe(mocha())
    .once('error', function () {
      process.exit();
    })
    .once('end', function () {
      process.exit();
    });
});

gulp.task('clean-before', function () {
    del.sync('dist/');
});

gulp.task('sass', function () {
  return gulp.src(sassFiles)
    .pipe(sass({indentedSyntax: true}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['build'], function () {
  livereload.listen();
  gulp.watch(sassFiles, ['sass']);
});

gulp.task('default', ['nodemon']);
gulp.task('build', ['clean-before', 'sass']);
