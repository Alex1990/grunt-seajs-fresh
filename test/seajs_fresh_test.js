'use strict';

var grunt = require('grunt');
var fs = require('fs');
var path = require('path');
/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
function getDirs(parent) {
  return fs.readdirSync(parent).filter(function(v) {
    if (fs.statSync(path.join(parent, v)).isDirectory()) {
      return true;
    } else {
      return false;
    }
  });
}

exports.seajs_fresh = {
  all: function(test) {
    var testDirs = getDirs('test/origin/');
    var blockRe = /\/\*fresh start\*\/[^]*?\/\*fresh end\*\//g;
    var fileRe = /([:,]\s*?['"])(.*?)(['"][^,\]\}]*?[,\]\}])/g;

    testDirs.forEach(function(testDir) {
      var originConfig = grunt.file.read('test/origin/' + testdir + '/config.js');
      var originBlocks = originConfig.match(blockRe);
      var originStrs = blocks.map(function(block) {
        var m, arr = [];
        while (m = fileRe.exec(block)) {
          arr.push(m[2]);
        }
        return arr;
      });

      var config = grunt.file.read('test/fixtures/' + testDir + '/config.js');
      var blocks = config.match(blockRe);
      var strs = blocks.map(function(block) {
        var m, arr = [];
        fileRe.lastIndex = 0;
        while (m = fileRe.exec(block)) {
          arr.push(m[2]);
        }
        return arr;
      });

      originStrs.forEach(function(v, i) {
        v.forEach(function(vv, j) {
          test.notEqual(vv, strs[i][j], 'Should not be equal');
        });
      });
    });
    test.done();
  }
};
