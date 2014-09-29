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
          base: 'test/fixtures/basic/src',
          debug: true
        },
        files: [
          {
            expand: true,
            cwd: 'test/fixtures/basic/src',
            src: '**/*.js'
          }
        ]
      },
      query_md5: {
        options: {
          configFile: 'test/fixtures/query_md5/config.js',
          base: 'test/fixtures/query_md5/src',
          type: 'md5',
          debug: true
        },
        files: [
          {
            expand: true,
            cwd: 'test/fixtures/query_md5/src',
            src: '**/*.js'
          }
        ]
      },
      append_md5: {
        options: {
          configFile: 'test/fixtures/append_md5/config.js',
          base: 'test/fixtures/append_md5/dest',
          type: 'md5',
          position: 'append',
          debug: true
        },
        files: [
          {
            expand: true,
            cwd: 'test/fixtures/append_md5/src',
            src: '**/*.js',
            dest: 'test/fixtures/append_md5/dest'
          }
        ]
      }
      // map_query: {
      //   options: {
      //     configFile: 'test/fixtures/map_query/config.js',
      //     base: 'test/fixtures/map_query/src',
      //     debug: true
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       cwd: 'test/fixtures/map_query/src',
      //       src: '**/*.js'
      //     }
      //   ]
      // },
      // map_append: {
      //   options: {
      //     configFile: 'test/fixtures/map_append/config.js',
      //     base: 'test/fixtures/map_append/dest',
      //     type: 'md5',
      //     position: 'append',
      //     debug: true
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       cwd: 'test/fixtures/map_append/src',
      //       src: '**/*.js',
      //       dest: 'test/fixtures/map_append/dest'
      //     }
      //   ]
      // },
      // paths_query: {
      //   options: {
      //     configFile: 'test/fixtures/paths_query/config.js',
      //     base: 'test/fixtures/paths_query/src',
      //     paths: {
      //       'gallery': 'test/fixtures/paths_query/src/libs'
      //     },
      //     debug: true
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       cwd: 'test/fixtures/paths_query/src',
      //       src: '**/*.js'
      //     }
      // },
      // paths_append: {
      //   options: {
      //     configFile: 'test/fixtures/paths_append/config.js',
      //     base: 'test/fixtures/paths_append/dest',
      //     paths: {
      //       'gallery': 'test/fixtures/paths_append/src/libs'
      //     },
      //     type: 'md5',
      //     position: 'append',
      //     debug: true
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       cwd: 'test/fixtures/paths_append/src',
      //       src: '**/*.js',
      //       dest: 'test/fixtures/paths_append/dest'
      //     }
      //   ]
      // },
      // vars_query: {
      //   options: {
      //     configFile: 'test/fixtures/vars_query/config.js',
      //     base: 'test/fixtures/vars_query/src',
      //     vars: {},
      //     debug: true
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       cwd: 'test/fixtures/vars_query/src',
      //       src: '**/*.js'
      //     }
      //   ]
      // },
      // vars_append: {
      //   options: {
      //     configFile: 'test/fixtures/vars_append/config.js'
      //     base: 'test/fixtures/vars_append/dest',
      //     vars: {},
      //     position: 'append',
      //     debug: true
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       cwd: 'test/fixtures/vars_append/src',
      //       src: '**/*.js',
      //       dest: 'test/fixtures/vars_append/dest'
      //     }
      //   ]
      // },
      // paths_vars_query: {
      //   options: {
      //     configFile: 'test/fixtures/paths_vars_query/config.js',
      //     base: 'test/fixtures/paths_vars_query/src',
      //     paths: {
      //     },
      //     vars: {
      //     },
      //     debug: true
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       cwd: 'test/fixtures/paths_vars_query/src',
      //       src: '**/*.js'
      //     }
      //   ]
      // },
      // paths_vars_append: {
      //   options: {
      //     configFile: 'test/fixtures/paths_vars_append/config.js',
      //     base: 'test/fixtures/paths_vars_append/dest',
      //     paths: {
      //     },
      //     vars: {
      //     },
      //     position: 'append',
      //     debug: true
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       cwd: 'test/fixtures/paths_vars_append/src',
      //       src: '**/*.js',
      //       dest: 'test/fixtures/paths_vars_append/dest'
      //     }
      //   ]
      // }
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'seajs_fresh']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
