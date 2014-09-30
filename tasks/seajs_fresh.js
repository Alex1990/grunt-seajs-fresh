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
  var crypto = require('crypto');

  function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  }

  function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }

  var PATHS_RE = /^([^/:]+)(\/.+)$/;
  var VARS_RE = /{([^{]+)}/g;

  function hasPaths(id, paths) {
    var m = id.match(PATHS_RE);
    return paths && m && paths[m[1]];
  }

  function hasVars(id) {
    return VARS_RE.test(id);
  }

  function parsePaths(id, paths) {
    var m;

    if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
      id = path.join(paths[m[1]], m[2]);
    }

    return id;
  }

  function parseVars(id, vars) {
    if (vars && id.indexOf("{") > -1) {
      id = id.replace(VARS_RE, function(m, key) {
        return isString(vars[key]) ? vars[key] : m;
      });
    }
    return id;
  }

  // Check if a value is in the array
  function inArray(array, value) {
    for (var i = 0, l = array.length; i < l; i++) {
      if (array[i] === value) {
        return true;
      }
    }
    return false;
  }

  // Generate the hash of the file with the specified algorithm
  function fcrypto(filepath, algorithm) {
    var file = grunt.file.read(filepath);
    return crypto.createHash(algorithm)
                .update(file).digest('hex');
  }

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('seajs_fresh', 'Bust the assets cache by inserting a timestamp or hash to urls.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      configFile: null,
      base: '',
      paths: null,
      vars: null,
      type: 'timestamp',
      length: '10',
      position: 'query',
      blockRe: /\/\*fresh start\*\/[^]*?\/\*fresh end\*\//g,
      fileRe: /([:,]\s*?['"])(.*?)(['"][^,\]\}]*?[,\]\}])/g,
      debug: false
    });

    // The seajs config file must be specified
    if (!options.configFile) {
      throw new Error('options.configFile is expected');
    }

    // If the algorithm isn't supported, throw an error.
    if (!/timestamp|datetime/.test(options.type) &&
        !inArray(crypto.getHashes(), options.type)) {
      throw new Error('the argument options.type isn\'t supported');
    }

    var mapFileName = 'freshmap.json';

    // The modified time (and the pathname) of the files are stored in freshmap.json
    var map = grunt.file.exists(mapFileName) ? grunt.file.readJSON(mapFileName) : {};

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

        // For test
        if (options.debug) {
          var file = grunt.file.read(filepath);
          file = file.lastIndexOf(';;') > -1 ?
                  file.replace(';;', ';') :
                  file + ';';
          grunt.file.write(filepath, file);
        }

        // All changed files will be filtered in
        var mtime = fs.statSync(filepath).mtime.getTime();
        if (typeof map[filepath] === 'undefined') {
          map[filepath] = [mtime];
          return true;
        } else if (mtime > map[filepath][0]) {
          map[filepath][0] = mtime;
          return true;
        }
        return false;
      })
      .forEach(function(filepath) {
        var idStr = '';

        // Use the user-defined function to generate the inserted string
        if (isFunction(options.type)) {
          idStr = options.type(filepath).slice(0, options.length);
        }
        // Use the timestamp or hash string
        else if (isString(options.type)) {
          switch (options.type) {
            case 'timestamp':
              idStr = fs.statSync(filepath).mtime.getTime().toString();
              break;
            case 'datetime':
              idStr = fs.statSync(filepath).mtime.toJSON()
                      .slice(0, 19).replace(/[-:T]/g, '');
              break;
            default:
              idStr = fcrypto(filepath, options.type).slice(0, options.length);
          }
        } else {
          throw new Error('options.type is not valid.');
        }

        // The string will be inserted to the after the file's basename
        if (options.position === 'append') {

          var filename = path.basename(f.dest, path.extname(f.dest)) +
                        '.' + idStr + path.extname(f.dest);
          var pathname = path.join(path.dirname(f.dest), filename);

          // Delete the old hash file
          if (isString(map[filepath][1])) {
            grunt.file.delete(map[filepath][1]);
          }
          grunt.file.copy(filepath, pathname);

          blocks = blocks.map(function(block) {
            return block.replace(options.fileRe, function(m, s1, s2, s3) {
              s2 = s2.indexOf('?') > -1 ? s2.slice(0, s2.indexOf('?')) : s2;

              var ss2 = s2;

              if (!hasVars(ss2) && !hasPaths(ss2, options.paths)) {
                ss2 = path.join(options.base, ss2);
              } else {
                ss2 = parsePaths(ss2, options.paths);
                ss2 = parseVars(ss2, options.vars);
              }

              if (f.dest !== ss2 && map[filepath][1] !== ss2) {
                return m;
              }
              var idx1 = s2.lastIndexOf('/') + 1;
              var idx2 = s2.lastIndexOf('}') + 1;
              s2 = s2.slice(0, idx1 > idx2 ? idx1 : idx2) + path.basename(pathname);
              return s1 + s2 + s3;
            });
          });
          map[filepath][1] = pathname;

        }
        // The string will be inserted as a query string
        else if (options.position === 'query') {
          if (isString(map[filepath][1])) {
            grunt.file.delete(map[filepath][1]);
          }

          blocks = blocks.map(function(block) {
            return block.replace(options.fileRe, function(m, s1, s2, s3) {
              s2 = s2.indexOf('?') > -1 ? s2.slice(0, s2.indexOf('?')) : s2;

              var ss2 = s2;

              if (!hasVars(ss2) && !hasPaths(ss2, options.paths)) {
                ss2 = path.join(options.base, ss2);
              } else {
                ss2 = parsePaths(ss2, options.paths);
                ss2 = parseVars(ss2, options.vars);
              }

              if (filepath !== ss2 && map[filepath][1] !== ss2) {
                return m;
              }
              if (map[filepath][1]) {
                s2 = s2.split('.');
                s2.splice(s2.length - 2);
                s2 = s2.join('.');
              }
              return s1 + s2 + '?v=' + idStr + s3;
            });
          });
          map[filepath].length = 1;
        } else {
          throw new Error('options.position must be "append" or "query" string.');
        }
      });
    });

    var count = 0; 
    configSrc = configSrc.replace(options.blockRe, function(block) {
      return blocks[count++];
    });

    // Generate the `options.configFile` file
    grunt.file.write(options.configFile, configSrc);
    grunt.log.writeln('The file "' + options.configFile + '" has been rewritten');

    // Generate the `freshmap.json` file
    var freshmapPath = path.join(path.dirname(options.configFile), mapFileName);
    grunt.file.write(freshmapPath, JSON.stringify(map, null, 2));
    grunt.log.writeln('The file "' + freshmapPath + '" has been generated.');
  });
  
};
