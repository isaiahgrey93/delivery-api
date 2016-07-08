'use strict';

const gulp = require('gulp');
const nodemon = require('nodemon');

gulp.task('start', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  })
})