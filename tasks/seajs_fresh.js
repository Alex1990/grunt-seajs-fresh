/*
 * grunt-seajs-fresh
 * https://github.com/Alex1990/grunt-seajs-fresh
 *
 * Copyright (c) 2014 Alex Chao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var fs = require('fs');
  var path = require('path');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('seajs_fresh', 'Bust the assets cache by inserting a timestamp or hash to urls.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      configFile: null,
      base: null,
      type: 'timestamp',
      length: '10',
      position: 'query',
      blockRe: /\/\*fresh start\*\/[^]*?\/\*fresh end\*\//g,
      fileRe: /([:,]\s*?['"])(.*?)(['"][^,\]\}]*?[,\]\}])/g,
      debug: false
    });

    if (!options.configFile) {
      return;
    }

    var configSrc = grunt.file.read(options.configFile);
    var blocks = configSrc.match(options.blockRe);

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Check if the source file is exists
      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      })
      .filter(function(filepath) {
        // Return the changed file sources
        var mtimeSrc = fs.statSync(filepath).mtime.getTime();
        var mtimeDest = fs.statSync(f.dest).mtime.getTime();

        return options.debug || mtimeSrc > mtimeDest; 
      })
      .forEach(function(filepath) {
        var mtimeSrc = options.debug ? Date.now() : fs.statSync(filepath).mtime.getTime();
        blocks = blocks.map(function(block) {
          return block.replace(options.fileRe, function(m, s1, s2, s3) {
            s2 = s2.indexOf('?') > -1 ? s2.slice(0, s2.indexOf('?')) : s2;
            if (f.dest !== path.join(options.base, s2)) {
              return m;
            }
            return s1 + s2 + '?v=' + mtimeSrc + s3;
          });
        });
      });

    });
    var count = 0; 
    configSrc = configSrc.replace(options.blockRe, function(block) {
      return blocks[count++];
    });

    grunt.file.write(options.configFile, configSrc);
  });

};
