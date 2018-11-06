'use strict';
 
const gulp = require('gulp'),
      gulpLoadPlugins = require('gulp-load-plugins'),
      sass = require('gulp-sass'),
      concat = require('gulp-concat'),
      babel = require('gulp-babel');
 
sass.compiler = require('node-sass');
const $ = gulpLoadPlugins();
 
gulp.task('sass-Bootstrap', function () {
  return gulp.src('./src/scss/bootstrap-4/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('abt-Bootstrap-4.css'))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('sass-Main', function () {
    return gulp.src('./src/scss/abt/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('main.css'))
      .pipe(gulp.dest('./public/stylesheets'));
  });

gulp.task('sass-Animate', function () {
    return gulp.src('./src/scss/animate/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('animate.css'))
      .pipe(gulp.dest('./public/stylesheets'));
  });

gulp.task('js-typeahead', function () {
    return gulp.src('./src/js/typeahead/*.js')
      .pipe($.babel())
      .pipe(concat('typeahead.js'))
      .pipe(gulp.dest('./public/javascripts'));
  });

  gulp.task('js-autocomplete', function () {
    return gulp.src('./src/js/autocomplete.js')
      .pipe($.babel())
      .pipe(concat('abt-autocomplete.js'))
      .pipe(gulp.dest('./public/javascripts'));
  });

gulp.task('js-Bootstrap', function () {
    return gulp.src('./src/js/bootstrap-4/*.js')
      .pipe($.babel())
      .pipe(concat('abt-bootstrap-4.js'))
      .pipe(gulp.dest('./public/javascripts'));
  });

 
gulp.task('rebuild', ['sass-Bootstrap', 'sass-Animate', 'sass-Main', 'js-typeahead', 'js-autocomplete','js-Bootstrap']);

/* -- Proof of Concept. Not messing with these core vendor libraries.
gulp.task('js-jquery', function () {
    return gulp.src('./src/js/jQuery/*.js')
      .pipe(concat('jquery.js'))
      .pipe(gulp.dest('./public/javascripts'));
  });

  gulp.task('js-popper', function () {
    return gulp.src('./src/js/popperjs/*.js')
      .pipe(concat('popper.js'))
      .pipe(gulp.dest('./public/javascripts'));
  });
  */