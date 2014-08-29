/*jslint node: true */
'use strict';

var lib = {
  fs: require('fs')
};
var _ = require('lodash');

exports.initConfig = function (grunt, config, options) {
  config = config || {};
  options = options || {};

  if (options.noMocha === undefined) {
    options.noMocha = !lib.fs.existsSync('test');
  }

  var defaults = {
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'index.js',
        'Gruntfile.js',
        'lib/**/*.js',
        'test/**/*.js',
        'bin/**/*.js',
        'cli/**/*.js'
      ],
      options: { jshintrc: '.jshintrc' }
    },
    lintspaces: {
      files: ['<%= jshint.files %>'],
      options: { editorconfig: '.editorconfig' }
    },
    watch: {
      jshint : {
        files: [
          '<%= lintspaces.files %>',
          'test/**/*'
        ],
        tasks: ['test']
      }
    }
  };

  if (!options.noMocha) {
    defaults.mocha_istanbul = {
      options: {
        ui: 'tdd'
      },
      basic: {
        src: 'test'
      },
    };
  }

  _.defaults(config, defaults);
  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var testTasks = ['lintspaces', 'jshint'];
  if (!options.noMocha) {
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    testTasks.push('mocha_istanbul:basic');
  }

  grunt.registerTask('test', testTasks);
  grunt.registerTask('default', 'test');
};
