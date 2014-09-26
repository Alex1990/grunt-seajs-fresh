/*
 * grunt-seajs-fresh
 * https://github.com/Alex1990/grunt-seajs-fresh
 *
 * Copyright (c) 2014 Alex Chao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    seajs_fresh: {
      basic: {
        options: {
          configFile: 'test/fixtures/basic/config.js',
          base: 'test/fixtures/basic/dest',
          debug: true
        },
        files: [
          {
            expand: true,
            cwd: 'test/fixtures/basic/src',
            src: '**/*.js',
            dest: 'test/fixtures/basic/dest'
          }
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'seajs_fresh']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
