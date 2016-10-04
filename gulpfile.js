'use strict';

const Dotenv = require('dotenv');
const Path = require('path');
const gulp = require('gulp');
const nodemon = require('nodemon');
const ENV_VARS = Dotenv.config({ path: Path.resolve(__dirname, '.env') });

gulp.task('start', function () {
    nodemon({
        script: 'server.js',
        ext: 'js',
        env: ENV_VARS
    })
})
